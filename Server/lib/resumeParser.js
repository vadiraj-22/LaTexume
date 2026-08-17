import { createRequire } from 'module'
import zlib from 'zlib'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

let pdfjsLib = null
try {
  pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
} catch (e) {
  console.warn('[ResumeParser] pdfjs-dist import warning:', e.message)
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
        },
      },
    },
    certifications: {
      type: 'array',
      items: { type: 'string' },
    },
  },
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

  rawText = rawText.replace(/\r\n/g, '\n').trim()

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

  if (pdfjsLib && pdfjsLib.getDocument) {
    try {
      const data = new Uint8Array(fileBuffer)
      const loadingTask = pdfjsLib.getDocument({ data, useSystemFonts: true })
      const pdfDocument = await loadingTask.promise

      let fullText = ''
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i)
        const textContent = await page.getTextContent()

        let lastY,
          pageText = ''
        for (const item of textContent.items) {
          if (!item.str) continue
          if (lastY === undefined || Math.abs(lastY - item.transform[5]) < 3) {
            pageText += item.str + ' '
          } else {
            pageText += '\n' + item.str + ' '
          }
          lastY = item.transform[5]
        }
        fullText += pageText + '\n'
      }
      extractedText = fullText
    } catch (err1) {
      console.warn('[ResumeParser] pdfjs-dist extraction failed:', err1.message)
    }
  }

  if (extractedText && extractedText.trim().length > 30) {
    return extractedText
  }

  try {
    const pdfData = await pdf(fileBuffer)
    extractedText = pdfData.text || ''
  } catch (err2) {
    console.warn('[ResumeParser] Standard pdf-parse failed:', err2.message)
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
- Split company name and location into separate fields (e.g. "InvictoLabs" = company, "Bengaluru, India" = location).
- Each achievement/certification must be its own separate string in the certifications array.
- Bullet descriptions starting with verbs (Enabled, Implemented, Built) are NOT project names.`

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
- Split company name and location into separate fields (e.g. "InvictoLabs" = company, "Bengaluru, India" = location).
- Each achievement/certification must be its own separate string in the certifications array.
- Bullet descriptions starting with verbs (Enabled, Implemented, Built) are NOT project names.

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
      "endDate": "YYYY or Mon YYYY or Present"
    }
  ],
  "certifications": [
    "Each achievement, certification, award, or honor as its OWN separate string",
    "Do NOT combine multiple points into one string",
    "Include any section titled Achievements, Certifications, Awards, Honors, etc."
  ]
}

FIELD EXTRACTION RULES:
- COMPANY vs LOCATION: If a line says "InvictoLabs Bengaluru, India", then company="InvictoLabs" and location="Bengaluru, India". ALWAYS split them.
- EXPERIENCE BULLETS: Extract every single dash/bullet point under each job. Do NOT skip any.
- PROJECT BULLETS: Extract every single dash/bullet point under each project. Do NOT skip any.
- PROJECTS: Only extract real project names. Bullet point descriptions that start with verbs (Enabled, Implemented, Built, Developed, etc.) are NOT project names - they are bullet points belonging to the project above them.
- CERTIFICATIONS/ACHIEVEMENTS: Each line/bullet is a SEPARATE entry in the array. If the resume has 4 achievements, return 4 strings.
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

  return {
    header,
    objective,
    skills,
    experience,
    projects,
    education,
    certifications,
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
      header.name = line.replace(/^[•\-\*]\s*/, '').trim()
      break
    }
  }

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) header.email = emailMatch[0]

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/)
  if (phoneMatch) header.phone = phoneMatch[0]

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
    text.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/i) ||
    text.match(/leetcode:\s*([a-zA-Z0-9_-]+)/i)
  if (leetcodeMatch && text.toLowerCase().includes('leetcode')) {
    const handle = leetcodeMatch[1] || leetcodeMatch[0]
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
    'OBJECTIVE',
    'SUMMARY',
    'PROFILE',
    'SKILLS',
    'TECHNICAL SKILLS',
    'SKILLS SUMMARY',
    'EXPERIENCE',
    'WORK EXPERIENCE',
    'PROJECTS',
    'PERSONAL PROJECTS',
    'EDUCATION',
    'CERTIFICATIONS',
    'ACHIEVEMENTS',
  ]

  for (const line of lines) {
    const upper = line.toUpperCase().replace(/[^A-Z\s]/g, '').trim()
    const matchedHeader = secHeaders.find((h) => upper === h || upper.startsWith(h))

    if (matchedHeader) {
      if (matchedHeader.includes('SKILL')) currentSec = 'SKILLS'
      else if (matchedHeader.includes('EXPERIENCE') || matchedHeader.includes('WORK')) currentSec = 'EXPERIENCE'
      else if (matchedHeader.includes('PROJECT')) currentSec = 'PROJECTS'
      else if (matchedHeader.includes('EDUCATION')) currentSec = 'EDUCATION'
      else if (matchedHeader.includes('CERTIFICATION') || matchedHeader.includes('ACHIEVEMENT'))
        currentSec = 'CERTIFICATIONS'
      else if (matchedHeader.includes('OBJECTIVE') || matchedHeader.includes('SUMMARY') || matchedHeader.includes('PROFILE'))
        currentSec = 'OBJECTIVE'

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

    const clean = line.replace(/^[•\-\*◦]\s*/, '').trim()
    const dateMatch = clean.match(dateRegex)

    const isNewJobLine = dateMatch || line.startsWith('•')

    if (isNewJobLine) {
      if (current && (current.title || current.company)) {
        list.push(current)
        current = null
      }

      if (!current) {
        current = {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          bullets: [],
        }
      }

      if (dateMatch) {
        current.title = clean.replace(dateRegex, '').trim()
        const dates = dateMatch[0].split(/–|-|—|to/i)
        current.startDate = dates[0]?.trim() || ''
        current.endDate = dates[1]?.trim() || ''
      } else {
        const { company, location } = splitCompanyAndLocation(clean)
        current.company = company
        current.location = location
      }
    } else if (current) {
      if (!current.company && !current.location && !line.startsWith('–') && !line.startsWith('-') && !line.startsWith('◦')) {
        const { company, location } = splitCompanyAndLocation(clean)
        current.company = company
        current.location = location
      } else {
        const bulletText = clean.replace(/^(Role Overview|Impact|Collaboration|In Virtual Internship):\s*/i, '').replace(/^[–\-•\*◦]\s*/, '').trim()
        if (bulletText) {
          if (current.bullets.length > 0 && !line.startsWith('–') && !line.startsWith('-') && !line.startsWith('◦') && !line.startsWith('•')) {
            current.bullets[current.bullets.length - 1] += ' ' + bulletText
          } else {
            current.bullets.push(bulletText)
          }
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
  let parsingBullets = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const clean = line.replace(/^[•\-\*◦]\s*/, '').trim()
    const isBulletStart = line.startsWith('•') || line.startsWith('-') || line.startsWith('◦') || line.startsWith('*')
    const isTechOrLink = /^(Tech|Live|GitHub|http|https):/i.test(clean)

    // A line is a header if it's not a bullet, not tech/link, and we either aren't in a project yet, 
    // or it has project-like markers (pipe, em-dash, year)
    const hasProjectMarkers = clean.includes('|') || clean.match(/\b20\d{2}\b/) || clean.includes('–') || clean.includes('—')
    const isHeader = !isBulletStart && !isTechOrLink && (!current || hasProjectMarkers || (!parsingBullets && !current.bullets.length))

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
          techPart = right.replace(/\b20\d{2}\b/, '').trim()
        } else {
          techPart = right.trim()
        }
      } else if (clean.includes('–') || clean.includes('—')) {
        const parts = clean.split(/–|—/)
        projName = parts[0].trim()
        if (parts[1] && parts[1].match(/\b20\d{2}\b/)) {
            datePart = parts[1].trim()
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
      parsingBullets = false
    } else if (current) {
      if (clean.toLowerCase().startsWith('tech:')) {
        current.technologies = clean.replace(/^tech:\s*/i, '').trim()
      } else if (clean.toLowerCase().includes('live:') || clean.toLowerCase().includes('github:')) {
        const liveMatch = clean.match(/live:\s*([^\s,]+)/i)
        if (liveMatch) {
          const link = liveMatch[1].trim()
          current.liveLink = link.startsWith('http') ? link : `https://${link}`
        }
        const githubMatch = clean.match(/github:\s*([^\s,]+)/i)
        if (githubMatch) {
          const link = githubMatch[1].trim()
          current.githubLink = link.startsWith('http') ? link : `https://${link}`
        }
      } else {
        parsingBullets = true
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

    const clean = line.replace(/^[•\-\*◦]\s*/, '').trim()
    if (clean.toLowerCase().startsWith('core coursework:')) continue

    const dateMatch = clean.match(/\b(20\d{2})\s*[-–—]\s*(20\d{2})\b/)

    const isSchoolHeader =
      !clean.toLowerCase().includes('pre-university') &&
      (line.startsWith('•') ||
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

      const locKeywords = ['Tumakuru', 'Hosapete', 'Karnataka', 'India', 'Bangalore', 'Bengaluru']
      for (const kw of locKeywords) {
        if (clean.includes(` ${kw}`)) {
          const idx = clean.indexOf(` ${kw}`)
          inst = clean.substring(0, idx).trim()
          loc = clean.substring(idx).trim()
          break
        }
      }

      current = {
        institution: inst,
        location: loc,
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
      }
    } else if (current) {
      if (dateMatch && !current.startDate) {
        current.startDate = dateMatch[1]
        current.endDate = dateMatch[2]
      }

      const degField = clean
        .replace(/;\s*CGPA:.*$/i, '')
        .replace(/,\s*CGPA\s*[-:]\s*[\d.]+/i, '')
        .replace(/\b20\d{2}\s*[-–—]\s*20\d{2}\b/, '')
        .trim()

      if (degField && !current.degree) {
        if (degField.includes(' in ')) {
          const [d, f] = degField.split(/\bin\b/i)
          current.degree = d.trim()
          current.field = f.trim()
        } else if (degField.includes('-')) {
          const [d, f] = degField.split('-')
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
  const lines = [
    ...(sections['CERTIFICATIONS'] || []),
    ...(sections['ACHIEVEMENTS'] || []),
  ]

  if (lines.length === 0) return ['']

  const result = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const clean = line.replace(/^[•\-\*◦]\s*/, '').trim()
    result.push(clean)
  }

  return result.length > 0 ? result : ['']
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
      ? data.projects.map((p) => ({
          name: p.name || '',
          technologies: p.technologies || '',
          date: p.date || '',
          bullets: Array.isArray(p.bullets) && p.bullets.length > 0 ? p.bullets : [''],
          liveLink: ensureUrl(p.liveLink),
          githubLink: ensureUrl(p.githubLink),
        }))
      : [{ name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }],
    education: Array.isArray(data?.education) && data.education.length > 0
      ? data.education.map((ed) => ({
          institution: ed.institution || '',
          location: ed.location || '',
          degree: ed.degree || '',
          field: ed.field || '',
          startDate: ed.startDate || '',
          endDate: ed.endDate || '',
        }))
      : [{ institution: '', location: '', degree: '', field: '', startDate: '', endDate: '' }],
    certifications: Array.isArray(data?.certifications) && data.certifications.length > 0
      ? data.certifications.filter(Boolean)
      : [''],
  }
}
