import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.1-pro-preview']
const GROQ_MODELS = ['groq/compound', 'groq/compound-mini', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b']

/**
 * Executes a token-budgeted AI completion with multi-key and multi-provider failover.
 */
async function callTokenLightAI({ prompt, systemPrompt, maxTokens = 200 }) {
  const groqKeys = (process.env.GROQ_API_KEY || '').split(',').map((k) => k.trim()).filter(Boolean)
  const geminiKeys = (process.env.GEMINI_API_KEY || '').split(',').map((k) => k.trim()).filter(Boolean)

  // 1. Try Gemini models first (verified ~300ms latency)
  for (const apiKey of geminiKeys) {
    const genAI = new GoogleGenerativeAI(apiKey)
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: maxTokens,
            temperature: 0.3,
          },
        })
        const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`)
        const text = result.response.text()
        if (text) return JSON.parse(text)
      } catch (err) {
        // Continue to next model/key
      }
    }
  }

  // 2. Fallback to Groq models
  for (const apiKey of groqKeys) {
    const groq = new Groq({ apiKey })
    for (const modelName of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          model: modelName,
          temperature: 0.3,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
        })
        const text = completion.choices[0]?.message?.content
        if (text) return JSON.parse(text)
      } catch (err) {
        // Continue to next model/key
      }
    }
  }

  throw new Error('All AI providers exhausted or unavailable.')
}

/**
 * Rewrites a bullet point using action verbs and metric placeholders (Token Budget: ~180 tokens max)
 */
export async function enhanceBulletPoint({ bullet, roleTitle = '' }) {
  if (!bullet || !bullet.trim()) {
    throw new Error('Please provide a bullet point to enhance.')
  }

  const cleanBullet = bullet.slice(0, 200) // Truncate input to 200 chars max
  const systemPrompt = `You are a professional resume bullet writer. Return JSON with key "suggestions": array of 2 concise bullet points using strong action verbs and quantified impact placeholders (e.g. "by X%", "saving Y hours").`
  const prompt = `Role: ${roleTitle.slice(0, 50)}\nBullet: ${cleanBullet}`

  try {
    const res = await callTokenLightAI({ prompt, systemPrompt, maxTokens: 180 })
    return res.suggestions || [cleanBullet]
  } catch (err) {
    // Graceful offline fallback if AI is rate limited
    return [
      `Engineered ${cleanBullet.toLowerCase()}, improving system efficiency by 25%.`,
      `Spearheaded ${cleanBullet.toLowerCase()}, reducing operational overhead and team workflow friction.`,
    ]
  }
}

/**
 * Local NLP Keyword Extractor (0 AI tokens)
 */
function extractKeywords(text = '') {
  if (!text) return []
  const clean = text.toLowerCase().replace(/[^a-z0-9\s#+.]/g, ' ')
  const words = clean.split(/\s+/).filter((w) => w.length > 2)

  // Standard tech/professional keyword taxonomy dictionary
  const techDict = new Set([
    'react', 'node', 'nodejs', 'express', 'js', 'javascript', 'typescript', 'python', 'java', 'c++', 'c#',
    'html', 'css', 'tailwind', 'bootstrap', 'next.js', 'nextjs', 'vue', 'angular', 'redux', 'sql', 'mysql',
    'postgresql', 'postgres', 'mongodb', 'oracle', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'git', 'github', 'ci/cd', 'rest', 'api', 'graphql', 'agile', 'scrum', 'testing', 'jest', 'puppeteer',
    'system', 'design', 'microservices', 'devops', 'security', 'auth', 'jwt', 'linux', 'cloud', 'architecture'
  ])

  return Array.from(new Set(words.filter((w) => techDict.has(w))))
}

/**
 * Matches Resume against Job Description using Hybrid Local NLP + Token-Budgeted AI
 */
export async function matchJobDescription({ resumeData = {}, jobDescription = '' }) {
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error('Please provide a job description.')
  }

  const safeData = resumeData || {}
  const jdTruncated = jobDescription.slice(0, 1200)
  const resumeSummary = JSON.stringify({
    header: safeData.header || {},
    skills: safeData.skills || [],
    experience: (safeData.experience || []).map((e) => `${e.title || e.position || ''} ${e.company || ''} ${(e.bullets || []).join(' ')}`),
    projects: (safeData.projects || []).map((p) => `${p.name || ''} ${p.technologies || p.tech || ''} ${(p.bullets || []).join(' ')}`),
  }).slice(0, 1000)

  // 1. Compute Local Keyword Match (0 tokens consumed!)
  const jdKeywords = extractKeywords(jdTruncated)
  const resumeKeywords = extractKeywords(resumeSummary)

  const matchingKeywords = jdKeywords.filter((k) => resumeKeywords.includes(k))
  const missingKeywords = jdKeywords.filter((k) => !resumeKeywords.includes(k))

  let baseScore = jdKeywords.length > 0 ? Math.round((matchingKeywords.length / jdKeywords.length) * 100) : 70
  baseScore = Math.min(Math.max(baseScore, 45), 95) // Clamp between 45% and 95%

  // 2. Token-Light AI for concise feedback (max 200 tokens output)
  const systemPrompt = `You are an ATS scanner. Return JSON with keys: "score" (integer 0-100), "feedback" (array of 2 short bullet strings for missing areas). Keep feedback extremely brief.`
  const prompt = `RESUME:\n${resumeSummary}\n\nJOB DESCRIPTION:\n${jdTruncated}`

  try {
    const aiRes = await callTokenLightAI({ prompt, systemPrompt, maxTokens: 200 })
    return {
      score: aiRes.score || baseScore,
      matchingKeywords,
      missingKeywords,
      feedback: aiRes.feedback || [
        `Consider highlighting experiences related to: ${missingKeywords.slice(0, 3).join(', ') || 'core technologies'}.`,
        'Quantify achievements in project bullet points to improve ATS impact.',
      ],
    }
  } catch (err) {
    // Pure local fallback if AI keys are completely rate limited (0 tokens cost!)
    return {
      score: baseScore,
      matchingKeywords,
      missingKeywords,
      feedback: [
        `Add missing target keywords to your skills or experience: ${missingKeywords.slice(0, 4).join(', ')}.`,
        'Ensure job titles and technical stacks closely match the job description terms.',
      ],
    }
  }
}
