import zlib from 'zlib'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

let _pdf = null
let _pdfjsLib = null

async function getPdfParse() {
  if (_pdf) return _pdf
  try {
    const { createRequire } = await import('module')
    const require = createRequire(import.meta.url)
    _pdf = require('pdf-parse')
    return _pdf
  } catch (err) {
    console.warn('[ResumeParser] pdf-parse load warning:', err.message)
    return null
  }
}

async function getPdfJsLib() {
  if (_pdfjsLib) return _pdfjsLib
  try {
    _pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    return _pdfjsLib
  } catch (err) {
    console.warn('[ResumeParser] pdfjs-dist import warning:', err.message)
    return null
  }
}

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.1-pro-preview']
const GROQ_MODELS = ['groq/compound', 'groq/compound-mini', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b']

const GEMINI_JSON_SCHEMA = {
  type: 'object',
  properties: {
    header: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        portfolio: { type: 'string' },
        linkedin: { type: 'string' },
        github: { type: 'string' },
        leetcode: { type: 'string' },
      },
      required: ['name', 'email'],
    },
    objective: { type: 'string' },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          skills: { type: 'string' },
        },
      },
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          company: { type: 'string' },
          location: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          bullets: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
    projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          technologies: { type: 'string' },
          date: { type: 'string' },
          bullets: {
            type: 'array',
            items: { type: 'string' },
          },
          liveLink: { type: 'string' },
          githubLink: { type: 'string' },
        },
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          institution: { type: 'string' },
          location: { type: 'string' },
          degree: { type: 'string' },
          field: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          coursework: { type: 'string' },
        },
      },
    },
    certifications: {
      type: 'array',
      items: { type: 'string' },
    },
    achievements: {
      type: 'array',
      items: { type: 'string' },
    },
  },
}

const STANDALONE_LINK_REGEX = /^[•\-\*◦▪▫–—\s]*((Live(\s*Site|\s*Demo)?)|GitHub|Demo|Code)(\s*\|\s*((Live(\s*Site|\s*Demo)?)|GitHub|Demo|Code|\s*))*$/i

function normalizeSpacedLetters(text) {
  if (!text) return ''
  // 1. Collapse LaTeX small-caps spaced initials: 'O BJECTIVE' -> 'OBJECTIVE', 'V ADIRAJ' -> 'VADIRAJ'
  let res = text.replace(/\b([A-Z])\s+([A-Z]{2,})\b/g, '$1$2')
  res = res.replace(/\b([A-Z])\s+([A-Z]{2,})\b/g, '$1$2')
  // 2. Collapse isolated uppercase single-letter sequences e.g. 'V A D I R A J' -> 'VADIRAJ'
  res = res.replace(/(?<=\b[A-Z])\s+(?=[A-Z]\b(?:\s+[A-Z]\b)+)/g, '')
  return res
}

export async function parseResume({ fileBuffer, resumeText }) {
  if (!fileBuffer && resumeText && resumeText.trim().startsWith('%PDF-')) {
    fileBuffer = Buffer.from(resumeText, 'binary')
    resumeText = ''
  }

  const groqKeys = (process.env.GROQ_API_KEY || '').split(',').map((k) => k.trim()).filter(Boolean)
  const geminiKeys = (process.env.GEMINI_API_KEY || '').split(',').map((k) => k.trim()).filter(Boolean)
  let aiError = null
  let retryAfterSeconds = null

  // 1. Extract text from PDF first (needed for Groq and offline fallback)
  let rawText = resumeText || ''
  if (fileBuffer) {
    rawText = await extractTextFromPdf(fileBuffer)
  }

  if (!rawText || !rawText.trim() || rawText.trim().length < 15) {
    return {
      error: 'Could not extract text from this PDF file. If it is a scanned or image PDF, please copy & paste your resume text in the "Paste Text" tab or add a GEMINI_API_KEY in Server/.env.',
    }
  }

  rawText = normalizeSpacedLetters(rawText.replace(/\r\n/g, '\n').trim())

  // 2. Try Groq AI keys sequentially
  for (const groqKey of groqKeys) {
    try {
      console.log('[ResumeParser] Trying Groq AI (Llama 3.3 70B)...')
      const aiResult = await parseWithGroq(rawText, groqKey)
      if (aiResult) {
        return { data: sanitizeParsedData(aiResult), isAiParsed: true, aiProvider: 'Groq' }
      }
    } catch (err) {
      const isQuota = err.message?.includes('429') || err.message?.includes('rate_limit')
      const msg = isQuota ? 'Rate Limit' : err.message?.split('\n')[0]
      console.warn(`[ResumeParser] Groq AI key failed: ${msg}`)
      aiError = `Groq AI Error: ${msg}`
      const match = err.message?.match(/try again in ([\d.]+)s/i)
      retryAfterSeconds = match ? Math.ceil(parseFloat(match[1])) : 60
    }
  }

  // 3. Try Gemini AI keys as fallback
  for (const geminiKey of geminiKeys) {
    try {
      if (fileBuffer) {
        console.log('[ResumeParser] Trying Gemini AI on PDF...')
        const aiResult = await parsePdfWithGemini(fileBuffer, geminiKey)
        if (aiResult) {
          return { data: sanitizeParsedData(aiResult), isAiParsed: true, aiProvider: 'Gemini' }
        }
      } else {
        console.log('[ResumeParser] Trying Gemini AI on text...')
        const aiResult = await parseWithGemini(rawText, geminiKey)
        if (aiResult) {
          return { data: sanitizeParsedData(aiResult), isAiParsed: true, aiProvider: 'Gemini' }
        }
      }
    } catch (err) {
      const isQuota = err.message?.includes('429') || err.message?.includes('Quota')
      const msg = isQuota ? 'Rate Limit (429)' : err.message?.split('\n')[0]
      console.warn(`[ResumeParser] Gemini AI key failed: ${msg}`)
      if (!aiError || !aiError.includes('Groq')) {
        aiError = `Gemini AI Error: ${msg}`
        const match = err.message?.match(/retry in ([\d.]+)s/i)
        retryAfterSeconds = match ? Math.ceil(parseFloat(match[1])) : 60
      }
    }
  }

  // 4. Fallback: Offline Rule Engine (always works, zero API calls)
  console.log('[ResumeParser] AI parsing failed/skipped. Parsing with Offline Rule Engine...')
  const fallbackResult = parseWithRules(rawText)
  return { data: sanitizeParsedData(fallbackResult), isAiParsed: false, aiError, retryAfterSeconds }
}

async function extractTextFromPdf(fileBuffer) {
  let extractedText = ''

  const pdfjs = await getPdfJsLib()
  if (pdfjs && pdfjs.getDocument) {
    try {
      const data = new Uint8Array(fileBuffer)
      const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
      const pdfDocument = await loadingTask.promise

      let fullText = ''
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i)
        let annotations = []
        try {
          annotations = await page.getAnnotations()
        } catch {
          annotations = []
        }
        const textContent = await page.getTextContent()

        const links = (annotations || []).filter((a) => a?.subtype === 'Link' && a?.url)

        // Group text items by line baseline Y
        const lineBuckets = []
        let currentBucket = []
        let lastY = null

        for (const item of textContent.items) {
          if (!item.str) continue
          const y = item.transform[5]
          if (lastY === null || Math.abs(lastY - y) < 3) {
            currentBucket.push(item)
          } else {
            if (currentBucket.length) lineBuckets.push({ y: lastY, items: currentBucket })
            currentBucket = [item]
          }
          lastY = y
        }
        if (currentBucket.length) lineBuckets.push({ y: lastY, items: currentBucket })

        for (const bucket of lineBuckets) {
          let lineText = bucket.items.map((it) => it.str).join(' ').trim()
          const overlappingLinks = links.filter((l) => {
            const minY = Math.min(l.rect[1], l.rect[3]) - 2
            const maxY = Math.max(l.rect[1], l.rect[3]) + 2
            return bucket.y >= minY && bucket.y <= maxY
          })

          if (overlappingLinks.length) {
            // Case 1: Standalone project link bullet: "– Live Site | GitHub"
            if (STANDALONE_LINK_REGEX.test(lineText)) {
              const ghLink = overlappingLinks.find((l) => /github\.com/i.test(l.url))?.url
              const liveLink = overlappingLinks.find((l) => !/github\.com/i.test(l.url) && !l.url.startsWith('mailto:'))?.url

              const parts = []
              if (liveLink) parts.push(`Live: ${liveLink}`)
              if (ghLink) parts.push(`GitHub: ${ghLink}`)
              if (parts.length > 0) {
                lineText = (lineText.startsWith('–') || lineText.startsWith('•') || lineText.startsWith('-') ? '– ' : '') + parts.join(' | ')
              }
            }
            // Case 2: Header line with clickable "LinkedIn" or "GitHub" words without explicit URL
            else if (/\b(LinkedIn|GitHub)\b/i.test(lineText) && !lineText.includes('http')) {
              const ghLink = overlappingLinks.find((l) => /github\.com/i.test(l.url))?.url
              const liLink = overlappingLinks.find((l) => /linkedin\.com/i.test(l.url))?.url

              if (ghLink && !lineText.toLowerCase().includes('github.com')) {
                lineText = lineText.replace(/\bGitHub\b/i, ghLink)
              }
              if (liLink && !lineText.toLowerCase().includes('linkedin.com')) {
                lineText = lineText.replace(/\bLinkedIn\b/i, liLink)
              }
            }
          }

          fullText += lineText + '\n'
        }
      }
      extractedText = fullText
    } catch (err1) {
      console.warn('[ResumeParser] pdfjs-dist extraction failed:', err1.message)
    }
  }

  if (extractedText && extractedText.trim().length > 30) {
    return extractedText
  }

  const parsePdf = await getPdfParse()
  if (parsePdf) {
    try {
      const pdfData = await parsePdf(fileBuffer)
      extractedText = pdfData.text || ''
    } catch (err2) {
      console.warn('[ResumeParser] Standard pdf-parse failed:', err2.message)
    }
  }

  if (extractedText && extractedText.trim().length > 30) {
    return extractedText
  }

  try {
    extractedText = extractTextFromZlibStreams(fileBuffer)
  } catch (err3) {
    console.warn('[ResumeParser] zlib stream extraction failed:', err3.message)
  }

  return extractedText || ''
}

function extractTextFromZlibStreams(buffer) {
  let combined = ''
  try {
    const raw = buffer.toString('latin1')
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g
    let match

    while ((match = streamRegex.exec(raw)) !== null) {
      try {
        const streamBuffer = Buffer.from(match[1], 'latin1')
        const decompressed = zlib.inflateSync(streamBuffer).toString('utf-8')
        combined += ' ' + decompressed
      } catch (e) {
        combined += ' ' + match[1]
      }
    }

    const cleaned = combined
      .replace(/\(([^()]{1,300})\)\s*(?:Tj|TJ|'|")/g, '$1 ')
      .replace(/\[\s*\(([^()]+)\)[\s\S]*?\]\s*TJ/g, '$1 ')
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return cleaned
  } catch (err) {
    return ''
  }
}

async function parsePdfWithGemini(fileBuffer, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const pdfPart = {
    inlineData: {
      data: fileBuffer.toString('base64'),
      mimeType: 'application/pdf',
    },
  }

  const prompt = `You are an expert resume parser. Extract ALL structured JSON data from this attached PDF resume.
RULES:
- Extract ONLY real data. NEVER fabricate or invent information.
- Extract EVERY bullet point under experience and projects.
- Split company name and location into separate fields.
- Put achievements and certifications into their respective separate arrays. Do not merge them.
- Extract 'Core Coursework' into the coursework field in the education array.
- Bullet descriptions starting with verbs are NOT project names.`

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[ResumeParser] Trying Gemini model: ${modelName}`)
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: GEMINI_JSON_SCHEMA,
        },
      })

      const result = await model.generateContent([prompt, pdfPart])
      const responseText = result.response.text()
      return JSON.parse(responseText)
    } catch (err) {
      const isQuota = err.message?.includes('429') || err.message?.includes('Quota')
      const msg = isQuota ? 'Quota/Rate Limit Exceeded (429)' : err.message?.split('\n')[0]
      console.warn(`[ResumeParser] Gemini model ${modelName} warning: ${msg}`)
    }
  }

  throw new Error('All Gemini model attempts failed or quota exceeded')
}

async function parseWithGemini(text, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const prompt = `You are an expert resume parser. Extract ALL structured JSON data from this resume text.
RULES:
- Extract ONLY real data. NEVER fabricate or invent information.
- Extract EVERY bullet point under experience and projects.
- Split company name and location into separate fields.
- Put achievements and certifications into their respective separate arrays. Do not merge them.
- Extract 'Core Coursework' into the coursework field in the education array.
- Bullet descriptions starting with verbs are NOT project names.

Resume Text:
${text}`

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[ResumeParser] Trying Gemini model for text: ${modelName}`)
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: GEMINI_JSON_SCHEMA,
        },
      })

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()
      return JSON.parse(responseText)
    } catch (err) {
      const isQuota = err.message?.includes('429') || err.message?.includes('Quota')
      const msg = isQuota ? 'Quota/Rate Limit Exceeded (429)' : err.message?.split('\n')[0]
      console.warn(`[ResumeParser] Gemini model ${modelName} warning: ${msg}`)
    }
  }

  throw new Error('All Gemini model attempts failed or quota exceeded')
}

async function parseWithGroq(text, apiKey) {
  const groq = new Groq({ apiKey })

  const systemPrompt = `You are an expert resume parser. Your job is to extract ALL structured data from a resume with 100% accuracy.

CRITICAL RULES:
1. Extract ONLY real data that exists in the resume. NEVER invent, fabricate, or hallucinate any information.
2. Extract EVERY SINGLE bullet point - do NOT skip or summarize any points.
3. Each achievement/certification/award must be its OWN separate string in the certifications array.

OUTPUT FORMAT - Return ONLY valid JSON with this exact structure:
{
  "header": {
    "name": "Full Name",
    "phone": "+91-XXXXXXXXXX",
    "email": "email@example.com",
    "portfolio": "portfolio URL if any",
    "linkedin": "linkedin URL if any",
    "github": "github URL if any",
    "leetcode": "leetcode/coding profile URL if any"
  },
  "objective": "Career objective or summary paragraph if present, otherwise empty string",
  "skills": [
    { "label": "Category Name", "skills": "comma separated skills as a single string" }
  ],
  "experience": [
    {
      "title": "Job Title / Role",
      "company": "Company Name ONLY (e.g. InvictoLabs, Google, Infosys Springboard)",
      "location": "City, Country ONLY (e.g. Bengaluru, India or Remote)",
      "startDate": "Mon YYYY (e.g. Sep 2024)",
      "endDate": "Mon YYYY or Present",
      "bullets": ["Each bullet point as a separate string - extract ALL of them"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "technologies": "Tech1, Tech2, Tech3 (from the tech stack line)",
      "date": "Mon YYYY – Mon YYYY or Mon YYYY",
      "bullets": ["Each bullet point as a separate string - extract ALL of them"],
      "liveLink": "live demo URL if mentioned",
      "githubLink": "github repo URL if mentioned"
    }
  ],
  "education": [
    {
      "institution": "College/University/School Name",
      "location": "City, State or City, Country",
      "degree": "B.Tech / M.Tech / PUC / etc.",
      "field": "Computer Science / Electronics / etc.",
      "startDate": "YYYY or Mon YYYY",
      "endDate": "YYYY or Mon YYYY or Present",
      "coursework": "Extracted coursework string if present"
    }
  ],
  "certifications": [
    "Each certification as its OWN separate string"
  ],
  "achievements": [
    "Each achievement, award, or honor as its OWN separate string"
  ]
}

FIELD EXTRACTION RULES:
- COMPANY vs LOCATION: If a line says "InvictoLabs Bengaluru, India", then company="InvictoLabs" and location="Bengaluru, India". ALWAYS split them.
- EXPERIENCE BULLETS: Extract every single dash/bullet point under each job. Do NOT skip any.
- PROJECT BULLETS: Extract every single dash/bullet point under each project. Do NOT skip any.
- PROJECTS: Only extract real project names. Bullet point descriptions that start with verbs (Enabled, Implemented, Built, Developed, etc.) are NOT project names - they are bullet points belonging to the project above them.
- CERTIFICATIONS/ACHIEVEMENTS: Put them in their respective arrays. Do not merge them.
- COURSEWORK: Extract 'Core Coursework: ...' into the coursework field.
- SKILLS: Group by the category label used in the resume (e.g., "Languages", "Frameworks/Libraries", "Developer Tools", "Technical Skills").
- DATES: Use the exact format from the resume. Prefer "Mon YYYY" format.
- LINKS: Extract ALL URLs (portfolio, live demo, github, linkedin, leetcode, etc.)`

  let lastErr = null

  for (const modelName of GROQ_MODELS) {
    try {
      console.log(`[ResumeParser] Calling Groq ${modelName}...`)
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Extract ALL data from this resume. Do not skip any bullet points or achievements:\n\n${text}` },
        ],
        model: modelName,
        response_format: {
          type: 'json_object',
        },
        temperature: 0,
        max_tokens: 8192,
      })

      const responseText = completion.choices[0]?.message?.content
      if (!responseText) {
        throw new Error('Groq returned empty response')
      }

      console.log(`[ResumeParser] Groq AI response received successfully with ${modelName} ✅`)
      const parsed = JSON.parse(responseText)
      console.log(`[ResumeParser] Groq extracted: ${parsed.experience?.length || 0} experience, ${parsed.projects?.length || 0} projects, ${parsed.education?.length || 0} education, ${parsed.certifications?.length || 0} certifications, ${parsed.skills?.length || 0} skill categories`)
      return parsed
    } catch (err) {
      console.warn(`[ResumeParser] Groq model ${modelName} failed:`, err.message?.split('\n')[0])
      lastErr = err
    }
  }

  throw lastErr || new Error('All Groq model attempts failed')
}

function parseWithRules(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

  const header = parseHeader(text, lines)
  const sections = splitSections(lines)

  const objective = extractObjective(sections)
  const skills = extractSkills(sections)
  const experience = extractExperience(sections)
  const projects = extractProjects(sections)
  const education = extractEducation(sections)
  const certifications = extractCertifications(sections)
  const achievements = extractAchievements(sections)

  return {
    header,
    objective,
    skills,
    experience,
    projects,
    education,
    certifications,
    achievements,
  }
}

function parseHeader(text, lines) {
  const header = {
    name: '',
    phone: '',
    email: '',
    portfolio: '',
    linkedin: '',
    github: '',
    leetcode: '',
  }

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i]
    if (
      !line.includes('@') &&
      !line.match(/\+?\d{10}/) &&
      !line.toLowerCase().includes('github') &&
      !line.toLowerCase().includes('linkedin') &&
      !line.toLowerCase().includes('skills') &&
      !line.toLowerCase().includes('education') &&
      !line.toLowerCase().includes('objective') &&
      line.length < 50
    ) {
      header.name = line.replace(/^[•\-\*]\s*/, '').replace(/\s+/g, ' ').trim()
      break
    }
  }

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) header.email = emailMatch[0]

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/)
  if (phoneMatch) header.phone = phoneMatch[0]

  const portfolioMatch =
    text.match(/portfolio:\s*([^\s,|]+)/i) ||
    text.match(/(?:https?:\/\/)?([a-zA-Z0-9_-]+\.vercel\.app|[a-zA-Z0-9_-]+\.dev|[a-zA-Z0-9_-]+\.me|[a-zA-Z0-9_-]+portfolio\.[a-z]{2,})/i)
  if (portfolioMatch) {
    const url = portfolioMatch[1] || portfolioMatch[0]
    header.portfolio = url.startsWith('http') ? url : `https://${url}`
  }

  const linkedinMatch =
    text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i) ||
    text.match(/linkedin:\s*([a-zA-Z0-9_-]+)/i)
  if (linkedinMatch) {
    const handle = linkedinMatch[1] || linkedinMatch[0]
    header.linkedin = handle.startsWith('http')
      ? handle
      : `https://linkedin.com/in/${handle.replace(/.*linkedin\.com\/in\//i, '')}`
  }

  const githubMatch =
    text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i) || text.match(/github:\s*([a-zA-Z0-9_-]+)/i)
  if (githubMatch) {
    const handle = githubMatch[1] || githubMatch[0]
    header.github = handle.startsWith('http') ? handle : `https://github.com/${handle.replace(/.*github\.com\//i, '')}`
  }

  const leetcodeMatch =
    text.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([a-zA-Z0-9_ -]+)/i) ||
    text.match(/leetcode:\s*([a-zA-Z0-9_ -]+)/i)
  if (leetcodeMatch && text.toLowerCase().includes('leetcode')) {
    const handle = (leetcodeMatch[1] || leetcodeMatch[0]).replace(/\s+/g, '')
    if (handle.toLowerCase() !== 'using') {
      header.leetcode = handle.startsWith('http')
        ? handle
        : `https://leetcode.com/u/${handle.replace(/.*leetcode\.com\/(?:u\/)?/i, '')}`
    }
  }

  return header
}

function splitSections(lines) {
  const sectionMap = {}
  let currentSec = 'HEADER'
  sectionMap[currentSec] = []

  const secHeaders = [
    { key: 'OBJECTIVE', matches: ['OBJECTIVE', 'SUMMARY', 'PROFESSIONAL SUMMARY', 'CAREER OBJECTIVE', 'PROFILE'] },
    { key: 'SKILLS', matches: ['SKILLS', 'TECHNICAL SKILLS', 'SKILLS SUMMARY', 'CORE COMPETENCIES'] },
    { key: 'EXPERIENCE', matches: ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'PROFESSIONAL EXPERIENCE', 'WORK HISTORY'] },
    { key: 'PROJECTS', matches: ['PROJECTS', 'PERSONAL PROJECTS', 'ACADEMIC PROJECTS', 'KEY PROJECTS'] },
    { key: 'EDUCATION', matches: ['EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS'] },
    { key: 'ACHIEVEMENTS', matches: ['ACHIEVEMENTS', 'AWARDS', 'HONORS', 'ACCOMPLISHMENTS'] },
    { key: 'CERTIFICATIONS', matches: ['CERTIFICATIONS', 'CERTIFICATIONS TRAINING', 'CERTIFICATIONS AND TRAINING', 'LICENSES'] },
  ]

  for (const line of lines) {
    const cleanLine = line.trim()
    if (!cleanLine) continue

    const upper = cleanLine.toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ').trim()
    const upperNoSpace = upper.replace(/\s+/g, '')

    // A section header must be short (<= 35 characters) and match a known section title
    let foundSec = null
    if (upper.length <= 35) {
      for (const group of secHeaders) {
        if (
          group.matches.some((m) => {
            const mNoSpace = m.replace(/\s+/g, '')
            return (
              upper === m ||
              upper === `${m}S` ||
              upper.startsWith(`${m} `) ||
              upper.endsWith(` ${m}`) ||
              upperNoSpace === mNoSpace ||
              upperNoSpace === `${mNoSpace}S`
            )
          })
        ) {
          foundSec = group.key
          break
        }
      }
    }

    if (foundSec) {
      currentSec = foundSec
      if (!sectionMap[currentSec]) sectionMap[currentSec] = []
    } else {
      if (!sectionMap[currentSec]) sectionMap[currentSec] = []
      sectionMap[currentSec].push(line)
    }
  }

  return sectionMap
}

function extractObjective(sections) {
  const lines = sections['OBJECTIVE'] || []
  return lines.join(' ').replace(/^[•\-\*]\s*/, '').trim()
}

function extractSkills(sections) {
  const lines = sections['SKILLS'] || []
  if (lines.length === 0) return [{ label: '', skills: '' }]

  const skillsList = []
  let currentSkill = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const clean = line.replace(/^[•\-\*◦]\s*/, '').trim()

    if (clean.includes(':')) {
      if (currentSkill) {
        skillsList.push(currentSkill)
      }
      const [label, val] = clean.split(/:(.+)/)
      currentSkill = {
        label: label.trim(),
        skills: val ? val.trim().replace(/,\s*$/, '') : '',
      }
    } else if (currentSkill) {
      currentSkill.skills += ', ' + clean.replace(/,\s*$/, '')
    }
  }

  if (currentSkill) {
    skillsList.push(currentSkill)
  }

  return skillsList.length > 0 ? skillsList : [{ label: '', skills: '' }]
}

function splitCompanyAndLocation(cleanStr) {
  let company = cleanStr
  let location = ''

  const locKeywords = ['Remote', 'India', 'USA', 'Bengaluru', 'Bangalore', 'Karnataka', 'Tumakuru', 'Hosapete', 'Virtual']

  if (cleanStr.includes(',')) {
    const parts = cleanStr.split(',')
    const firstPart = parts[0].trim()
    const secondPart = parts.slice(1).join(',').trim()

    const words = firstPart.split(' ')
    if (words.length > 1 && locKeywords.some((k) => words[words.length - 1].toLowerCase() === k.toLowerCase())) {
      company = words.slice(0, -1).join(' ').trim()
      location = words[words.length - 1] + ', ' + secondPart
    } else {
      company = firstPart
      location = secondPart
    }
  } else {
    const words = cleanStr.split(' ')
    for (let i = 0; i < words.length; i++) {
      if (locKeywords.some((k) => words[i].toLowerCase() === k.toLowerCase())) {
        company = words.slice(0, i).join(' ').trim()
        location = words.slice(i).join(' ').trim()
        break
      }
    }
  }

  return {
    company: company || cleanStr,
    location: location || '',
  }
}

function extractExperience(sections) {
  const lines = sections['EXPERIENCE'] || []
  if (lines.length === 0) return []

  const list = []
  let current = null

  const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December|\d{4})\s*[\d\w]*\s*(?:–|-|—|to)\s*(?:Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December|\d{4})[\d\w\s]*/i

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const isBulletStart = /^[•\-\*◦▪▫–—]\s*/.test(line)
    const clean = line.replace(/^[•\-\*◦▪▫–—]\s*/, '').trim()
    const dateMatch = clean.match(dateRegex)

    const isNewJobHeader = !current || (dateMatch && current.bullets.length > 0)

    if (isNewJobHeader) {
      if (current && (current.title || current.company)) {
        list.push(current)
      }
      current = {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        bullets: [],
      }
    }

    if (current && current.bullets.length === 0 && !isBulletStart) {
      if (dateMatch) {
        const dateStr = dateMatch[0]
        const dates = dateStr.split(/–|-|—|to/i)
        current.startDate = dates[0]?.trim() || ''
        current.endDate = dates[1]?.trim() || ''

        const remaining = clean.replace(dateRegex, '').trim()
        if (remaining) {
          if (!current.title) {
            current.title = remaining
          } else if (!current.company) {
            const { company, location } = splitCompanyAndLocation(remaining)
            current.company = company
            if (location) current.location = location
          }
        }
      } else {
        if (!current.company) {
          const { company, location } = splitCompanyAndLocation(clean)
          current.company = company
          current.location = location
        } else if (!current.title) {
          current.title = clean
        }
      }
    } else if (current) {
      const bulletText = clean.replace(/^(?:Role Overview|Impact|Collaboration|AI Title Automation|In Virtual Internship)\s*:\s*/i, '').trim()
      if (bulletText) {
        if (current.bullets.length > 0 && !isBulletStart) {
          current.bullets[current.bullets.length - 1] += ' ' + bulletText
        } else {
          current.bullets.push(bulletText)
        }
      }
    }
  }

  if (current && (current.title || current.company)) {
    list.push(current)
  }

  return list.length > 0 ? list : [{ title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }]
}

function extractProjects(sections) {
  const lines = sections['PROJECTS'] || []
  if (lines.length === 0) return []

  const list = []
  let current = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const isBulletStart = /^[•\-\*◦▪▫–—]\s*/.test(line)
    const clean = line.replace(/^[•\-\*◦▪▫–—]\s*/, '').trim()
    const isTechOrLink = /^(?:Tech|Technologies|Tech Stack|Live|GitHub|http|https)\s*:/i.test(clean) || /Live(?:\s+Site)?\s*\|\s*GitHub/i.test(clean)

    let isHeader = false
    if (!isTechOrLink) {
      if (isBulletStart) {
        if (clean.includes('|') || /^[A-Z][A-Za-z0-9\s]{1,40}\s*[-–—]\s*[A-Z]/.test(clean)) {
          isHeader = true
        }
      } else {
        if (clean.includes('|') || /^[A-Z][A-Za-z0-9\s]{1,40}\s*[-–—]\s*[A-Z]/.test(clean)) {
          isHeader = true
        } else if (!current && clean.length < 50) {
          isHeader = true
        }
      }
    }

    if (isHeader) {
      if (current && current.name) {
        list.push(current)
      }

      let projName = clean
      let techPart = ''
      let datePart = ''

      if (clean.includes('|')) {
        const [left, right] = clean.split('|')
        projName = left.split(/–|—/)[0].trim()

        const yearMatch = right.match(/\b(20\d{2})\b/)
        if (yearMatch) {
          datePart = yearMatch[1]
          techPart = right.replace(/\b20\d{2}\b/, '').replace(/^.*?—\s*/, '').trim()
        } else {
          techPart = right.replace(/^.*?—\s*/, '').trim()
        }
      } else if (clean.includes('–') || clean.includes('—')) {
        const parts = clean.split(/–|—/)
        projName = parts[0].trim()
        if (parts[1] && parts[1].match(/\b20\d{2}\b/)) {
          datePart = parts[1].match(/\b20\d{2}\b/)[0]
        }
      } else if (clean.includes(':')) {
        projName = clean.split(':')[0].trim()
      }

      current = {
        name: projName,
        technologies: techPart,
        date: datePart,
        bullets: [],
        liveLink: '',
        githubLink: '',
      }
    } else if (current) {
      if (/^(?:tech|technologies|tech stack)\s*:/i.test(clean)) {
        current.technologies = clean.replace(/^(?:tech|technologies|tech stack)\s*:\s*/i, '').trim()
      } else if (clean.toLowerCase().includes('live:') || clean.toLowerCase().includes('live site:') || clean.toLowerCase().includes('github:')) {
        const liveMatch = clean.match(/(?:live|live site):\s*([^\s,|]+)/i)
        if (liveMatch) {
          const link = liveMatch[1].trim()
          current.liveLink = link.startsWith('http') ? link : `https://${link}`
        }
        const githubMatch = clean.match(/github:\s*([^\s,|]+)/i)
        if (githubMatch) {
          const link = githubMatch[1].trim()
          current.githubLink = link.startsWith('http') ? link : `https://${link}`
        }
      } else {
        const bulletText = clean
        if (bulletText) {
          if (current.bullets.length > 0 && !isBulletStart) {
            current.bullets[current.bullets.length - 1] += ' ' + bulletText
          } else {
            current.bullets.push(bulletText)
          }
        }
      }
    }
  }

  if (current && current.name) {
    list.push(current)
  }

  return list.length > 0 ? list : [{ name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }]
}

function extractEducation(sections) {
  const lines = sections['EDUCATION'] || []
  if (lines.length === 0) return []

  const list = []
  let current = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const isBulletStart = /^[•\-\*◦▪▫–—]\s*/.test(line)
    const clean = line.replace(/^[•\-\*◦▪▫–—]\s*/, '').trim()
    if (clean.toLowerCase().startsWith('core coursework:') || clean.toLowerCase().startsWith('coursework:')) {
      if (current) current.coursework = clean.replace(/^(?:core coursework|coursework)\s*:\s*/i, '').trim()
      continue
    }

    const dateMatch = clean.match(/\b(20\d{2})\s*[-–—]\s*(20\d{2}|Present)\b/i)

    const isSchoolHeader =
      !clean.toLowerCase().includes('pre-university course') &&
      !clean.toLowerCase().includes('bachelor of') &&
      !clean.toLowerCase().includes('master of') &&
      (isBulletStart ||
      clean.toLowerCase().includes('institute') ||
      clean.toLowerCase().includes('university') ||
      clean.toLowerCase().includes('college') ||
      clean.toLowerCase().includes('school') ||
      clean.toLowerCase().includes('academy'))

    if (isSchoolHeader) {
      if (current && current.institution) {
        list.push(current)
      }

      let inst = clean
      let loc = ''
      let sDate = ''
      let eDate = ''

      if (dateMatch) {
        sDate = dateMatch[1]
        eDate = dateMatch[2]
        inst = inst.replace(dateMatch[0], '').trim()
      }

      const locKeywords = ['Tumakuru', 'Hosapete', 'Karnataka', 'India', 'Bangalore', 'Bengaluru']
      for (const kw of locKeywords) {
        if (inst.includes(` ${kw}`)) {
          const idx = inst.indexOf(` ${kw}`)
          loc = inst.substring(idx).trim()
          inst = inst.substring(0, idx).trim()
          break
        }
      }

      current = {
        institution: inst,
        location: loc,
        degree: '',
        field: '',
        startDate: sDate,
        endDate: eDate,
        coursework: '',
      }
    } else if (current) {
      if (dateMatch && !current.startDate) {
        current.startDate = dateMatch[1]
        current.endDate = dateMatch[2]
      }

      let degField = clean
        .replace(/;\s*CGPA:.*$/i, '')
        .replace(/,\s*CGPA\s*[-:]\s*[\d.]+/i, '')
        .replace(/\b20\d{2}\s*[-–—]\s*(20\d{2}|Present)\b/i, '')
        .trim()

      const locKeywords = ['Tumakuru', 'Hosapete', 'Karnataka', 'India', 'Bangalore', 'Bengaluru']
      for (const kw of locKeywords) {
        if (degField.includes(` ${kw}`) || degField.endsWith(`, ${kw}`)) {
          const idx = degField.indexOf(` ${kw}`) !== -1 ? degField.indexOf(` ${kw}`) : degField.indexOf(`, ${kw}`)
          if (!current.location) current.location = degField.substring(idx).replace(/^,\s*/, '').trim()
          degField = degField.substring(0, idx).trim()
          break
        }
      }

      if (degField.includes('Object-Oriented') || degField.includes('Data Structures') || degField.includes('Operating Systems')) {
        current.coursework = degField
        continue
      }

      if (degField && !current.degree) {
        if (degField.includes(' in ')) {
          const [d, f] = degField.split(/\bin\b/i)
          current.degree = d.trim()
          current.field = f.trim()
        } else if (degField.includes(' - ') && !degField.includes('Pre-University')) {
          const [d, f] = degField.split(' - ')
          current.degree = d.trim()
          current.field = f.trim()
        } else {
          current.degree = degField
        }
      }
    }
  }

  if (current && current.institution) {
    list.push(current)
  }

  return list.length > 0 ? list : [{ institution: '', location: '', degree: '', field: '', startDate: '', endDate: '' }]
}

function extractCertifications(sections) {
  const lines = sections['CERTIFICATIONS'] || []
  if (lines.length === 0) return []

  const result = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const isBulletStart = /^[•\-\*◦▪▫–—]\s*/.test(line)
    const clean = line.replace(/^[•\-\*◦▪▫–—]\s*/, '').trim()

    if (result.length > 0 && !isBulletStart && (clean.startsWith('Completed') || clean.startsWith('Developed') || clean.startsWith('Built'))) {
      result[result.length - 1] += ' - ' + clean
    } else {
      result.push(clean)
    }
  }
  return result
}

function extractAchievements(sections) {
  const lines = sections['ACHIEVEMENTS'] || []
  if (lines.length === 0) return []

  const result = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const isBulletStart = /^[•\-\*◦▪▫–—]\s*/.test(line)
    const clean = line.replace(/^[•\-\*◦▪▫–—]\s*/, '').trim()

    if (result.length > 0 && !isBulletStart) {
      result[result.length - 1] += ' ' + clean
    } else {
      result.push(clean)
    }
  }
  return result
}

function sanitizeParsedData(data) {
  const ensureUrl = (url) => {
    if (!url || !url.trim()) return ''
    url = url.trim()
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return 'https://' + url
  }

  return {
    header: {
      name: data?.header?.name || '',
      phone: data?.header?.phone || '',
      email: data?.header?.email || '',
      portfolio: ensureUrl(data?.header?.portfolio),
      linkedin: ensureUrl(data?.header?.linkedin),
      github: ensureUrl(data?.header?.github),
      leetcode: ensureUrl(data?.header?.leetcode),
    },
    objective: data?.objective || '',
    skills: Array.isArray(data?.skills) && data.skills.length > 0
      ? data.skills.map((s) => ({ label: s.label || 'Technical Skills', skills: s.skills || '' }))
      : [{ label: '', skills: '' }],
    experience: Array.isArray(data?.experience) && data.experience.length > 0
      ? data.experience.map((e) => ({
          title: e.title || '',
          company: e.company || '',
          location: e.location || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          bullets: Array.isArray(e.bullets) && e.bullets.length > 0 ? e.bullets : [''],
        }))
      : [{ title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }],
    projects: Array.isArray(data?.projects) && data.projects.length > 0
      ? data.projects.map((p) => {
          let technologies = (p.technologies || '').trim()
          let liveLink = ensureUrl(p.liveLink)
          let githubLink = ensureUrl(p.githubLink)
          const cleanBullets = []

          for (const b of (p.bullets || [])) {
            if (!b || typeof b !== 'string') continue
            const trimmed = b.trim()
            if (!trimmed) continue

            const techMatch = trimmed.match(/^(?:tech|technologies|tech stack)\s*:\s*(.*)$/i)
            if (techMatch) {
              if (!technologies) technologies = techMatch[1].trim()
              continue
            }

            if (technologies && trimmed.toLowerCase() === technologies.toLowerCase()) {
              continue
            }

            const liveMatch = trimmed.match(/live:\s*([^\s,|]+)/i)
            if (liveMatch && !liveLink) {
              liveLink = ensureUrl(liveMatch[1].trim())
            }

            const githubMatch = trimmed.match(/github:\s*([^\s,|]+)/i)
            if (githubMatch && !githubLink) {
              githubLink = ensureUrl(githubMatch[1].trim())
            }

            if (/^(?:live|github|demo|repo)\s*:\s*/i.test(trimmed)) {
              continue
            }

            if (STANDALONE_LINK_REGEX.test(trimmed)) {
              continue
            }

            cleanBullets.push(trimmed)
          }

          return {
            name: p.name || '',
            technologies,
            date: p.date || '',
            bullets: cleanBullets.length > 0 ? cleanBullets : [''],
            liveLink,
            githubLink,
          }
        })
      : [{ name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }],
    education: Array.isArray(data?.education) && data.education.length > 0
      ? data.education.map((ed) => ({
          institution: ed.institution || '',
          location: ed.location || '',
          degree: ed.degree || '',
          field: ed.field || '',
          startDate: ed.startDate || '',
          endDate: ed.endDate || '',
          coursework: ed.coursework || '',
        }))
      : [{ institution: '', location: '', degree: '', field: '', startDate: '', endDate: '', coursework: '' }],
    certifications: Array.isArray(data?.certifications) && data.certifications.length > 0
      ? data.certifications.map((c) => (typeof c === 'string' ? c.trim() : (c?.name ? [c.name, c.issuer, c.date].filter(Boolean).join(' - ') : ''))).filter(Boolean)
      : [''],
    achievements: Array.isArray(data?.achievements) && data.achievements.length > 0
      ? data.achievements.map((a) => (typeof a === 'string' ? a.trim() : '')).filter(Boolean)
      : [''],
  }
}
