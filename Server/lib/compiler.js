import { writeFileSync, readFileSync, mkdirSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { randomUUID } from 'crypto'

/**
 * Compiles a LaTeX source string into a PDF buffer using latex.vercel.app API.
 * Falls back to local pdflatex if available.
 *
 * @param {string} texSource - Complete .tex file content
 * @returns {Promise<Buffer>} - The compiled PDF as a Buffer
 */
export async function compileTex(texSource) {
  // Try online API first (no local install needed)
  try {
    return await compileOnline(texSource)
  } catch (onlineErr) {
    console.warn('Online compilation failed, trying local pdflatex...', onlineErr.message)
    // Fall back to local pdflatex
    try {
      return await compileLocal(texSource)
    } catch (localErr) {
      if (localErr.message === 'LaTeX compiler not found locally') {
        throw new Error(onlineErr.message || 'LaTeX compilation service is currently unavailable. Please try again.')
      }
      throw localErr
    }
  }
}

/**
 * Pure JS single-file tar archive creator (in-memory, no dependencies)
 */
function createSingleFileTar(filename, contentBuffer) {
  const header = Buffer.alloc(512)
  header.write(filename, 0, 100, 'utf-8')
  header.write('0000644\0', 100, 8, 'utf-8')
  header.write('0000000\0', 108, 8, 'utf-8')
  header.write('0000000\0', 116, 8, 'utf-8')
  const sizeOctal = contentBuffer.length.toString(8).padStart(11, '0') + '\0'
  header.write(sizeOctal, 124, 12, 'utf-8')
  const mtimeOctal = Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0'
  header.write(mtimeOctal, 136, 12, 'utf-8')
  header.fill(0x20, 148, 156)
  header.write('0', 156, 1, 'utf-8')
  header.write('ustar\0', 257, 6, 'utf-8')
  header.write('00', 263, 2, 'utf-8')

  let checksum = 0
  for (let i = 0; i < 512; i++) checksum += header[i]
  const checksumOctal = checksum.toString(8).padStart(6, '0') + '\0 '
  header.write(checksumOctal, 148, 8, 'utf-8')

  const remainder = contentBuffer.length % 512
  const paddingLength = remainder === 0 ? 0 : 512 - remainder
  const padding = Buffer.alloc(paddingLength)
  const endBlocks = Buffer.alloc(1024)

  return Buffer.concat([header, contentBuffer, padding, endBlocks])
}

/**
 * Compiles LaTeX using resilient online APIs (latexonline.cc GET/POST & fallbacks)
 */
async function compileOnline(texSource) {
  let lastErrorDetail = ''

  // If text is short (< 3500 chars), GET is fast and reliable
  if (texSource.length < 3500) {
    try {
      const url = `https://latexonline.cc/compile?text=${encodeURIComponent(texSource)}`
      const response = await fetch(url, { signal: AbortSignal.timeout(22000) })
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        if (buffer.length > 100 && buffer.toString('utf8', 0, 4) === '%PDF') {
          return buffer
        }
      } else if (response.status === 414) {
        console.warn('latexonline.cc GET returned 414, falling back to POST /data...')
      } else {
        const errText = await response.text().catch(() => '')
        const errorMatch = errText.match(/error:\s*([^\n\r]+)/i)
        if (errorMatch) {
          lastErrorDetail = errorMatch[1]
        }
        console.warn('latexonline.cc GET returned status:', response.status, lastErrorDetail || errText.slice(0, 150))
      }
    } catch (err) {
      console.warn('latexonline.cc GET failed:', err.message)
    }
  }

  // Primary for larger documents or fallback: POST /data with in-memory tarball (no 414 URL length issues)
  try {
    const tarBuf = createSingleFileTar('main.tex', Buffer.from(texSource, 'utf-8'))
    const blob = new Blob([tarBuf], { type: 'application/x-tar' })
    const fd = new FormData()
    fd.append('file', blob, 'project.tar')

    const response = await fetch('https://latexonline.cc/data?target=main.tex', {
      method: 'POST',
      body: fd,
      signal: AbortSignal.timeout(25000),
    })

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (buffer.length > 100 && buffer.toString('utf8', 0, 4) === '%PDF') {
        return buffer
      }
    } else {
      const errText = await response.text().catch(() => '')
      const errorMatch = errText.match(/error:\s*([^\n\r]+)/i)
      if (errorMatch) {
        lastErrorDetail = errorMatch[1]
      }
      console.warn('latexonline.cc POST /data returned non-ok status:', response.status, lastErrorDetail || errText.slice(0, 150))
    }
  } catch (err) {
    console.warn('latexonline.cc POST /data failed:', err.message)
  }

  // Tertiary Fallback: latex.ytotech.com
  try {
    const response = await fetch('https://latex.ytotech.com/builds/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [
          {
            main: true,
            content: texSource,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (buffer.length > 100 && buffer.toString('utf8', 0, 4) === '%PDF') {
        return buffer
      }
    } else {
      const errJson = await response.json().catch(() => ({}))
      if (errJson.message || errJson.error) {
        lastErrorDetail = errJson.message || errJson.error
      }
    }
  } catch (err) {
    console.warn('ytotech online LaTeX compiler failed:', err.message)
  }

  throw new Error(lastErrorDetail ? `LaTeX error: ${lastErrorDetail}` : 'All online LaTeX compiler APIs failed')
}

/**
 * Local pdflatex fallback
 */
async function compileLocal(texSource) {
  const { spawn } = await import('child_process')

  const tmpDir = join(tmpdir(), randomUUID())
  const texPath = join(tmpDir, 'resume.tex')

  mkdirSync(tmpDir, { recursive: true })
  writeFileSync(texPath, texSource, 'utf8')

  try {
    await runPdflatex(spawn, tmpDir, texPath)
    await runPdflatex(spawn, tmpDir, texPath)

    const pdfPath = join(tmpDir, 'resume.pdf')
    return readFileSync(pdfPath)
  } finally {
    rmSync(tmpDir, { recursive: true, force: true })
  }
}

function runPdflatex(spawn, cwd, texPath) {
  return new Promise((resolve, reject) => {
    let stderr = ''
    const proc = spawn('pdflatex', [
      '-interaction=nonstopmode',
      '-output-directory', cwd,
      texPath,
    ], { cwd })

    proc.stderr.on('data', (chunk) => { stderr += chunk.toString() })
    proc.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(new Error('LaTeX compiler not found locally'))
      } else {
        reject(err)
      }
    })
    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`LaTeX compilation failed:\n${stderr.slice(0, 500)}`))
    })
  })
}
