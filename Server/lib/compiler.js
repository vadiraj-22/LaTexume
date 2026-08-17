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
    return await compileLocal(texSource)
  }
}

/**
 * Compiles LaTeX using resilient online APIs (latex.ytotech.com & latexonline.cc)
 */
async function compileOnline(texSource) {
  // Primary: latex.ytotech.com
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
    })

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (buffer.length > 100 && buffer.toString('utf8', 0, 4) === '%PDF') {
        return buffer
      }
    }
  } catch (err) {
    console.warn('ytotech online LaTeX compiler failed:', err.message)
  }

  // Secondary Fallback: latexonline.cc
  try {
    const url = `https://latexonline.cc/compile?text=${encodeURIComponent(texSource)}`
    const response = await fetch(url)
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (buffer.length > 100 && buffer.toString('utf8', 0, 4) === '%PDF') {
        return buffer
      }
    }
  } catch (err) {
    console.warn('latexonline.cc compiler failed:', err.message)
  }

  throw new Error('All online LaTeX compiler APIs failed')
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
