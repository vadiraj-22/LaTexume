import { Router } from 'express'
import { enhanceBulletPoint, matchJobDescription } from '../lib/aiOptimizer.js'

const router = Router()

/**
 * POST /api/ai/enhance-bullet
 * Body: { bullet: string, roleTitle?: string }
 */
router.post('/enhance-bullet', async (req, res, next) => {
  try {
    const { bullet, roleTitle } = req.body
    const suggestions = await enhanceBulletPoint({ bullet, roleTitle })
    return res.json({ success: true, suggestions })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Could not enhance bullet point.',
    })
  }
})

/**
 * POST /api/ai/match-jd
 * Body: { resumeData: object, jobDescription: string }
 */
router.post('/match-jd', async (req, res, next) => {
  try {
    const result = await matchJobDescription({ resumeData: resumeData || {}, jobDescription })
    return res.json({ success: true, result, match: result })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Could not analyze job description.',
    })
  }
})

export default router
