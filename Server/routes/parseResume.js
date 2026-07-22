import { Router } from 'express'
import multer from 'multer'
import { parseResume } from '../lib/resumeParser.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const fileBuffer = req.file?.buffer
    const resumeText = req.body?.resumeText

    if (!fileBuffer && (!resumeText || !resumeText.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a file or paste your resume text',
      })
    }

    const result = await parseResume({ fileBuffer, resumeText })

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      data: result.data,
      isAiParsed: result.isAiParsed,
      aiProvider: result.aiProvider || null,
      aiError: result.aiError || null,
      retryAfterSeconds: result.retryAfterSeconds || null,
      message: result.isAiParsed
        ? `Resume data parsed successfully with ${result.aiProvider || 'AI'}!`
        : result.aiError
        ? 'AI rate limit hit. Parsed with built-in engine.'
        : 'Resume data parsed successfully with built-in engine.',
    })
  } catch (err) {
    console.error('[ParseResumeRoute Error]:', err)
    return res.status(400).json({
      success: false,
      message: err.message || 'Could not parse resume file. Please try pasting the text directly into the "Paste Text" tab.',
    })
  }
})

export default router
