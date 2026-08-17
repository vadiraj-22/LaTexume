import { Router } from 'express'
import { templateEngine } from '../lib/templateEngine.js'
import { compileTex } from '../lib/compiler.js'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const data = req.body

    // Ensure fallback header values so preview compilation never fails
    const payload = {
      ...data,
      header: {
        ...data?.header,
        name: data?.header?.name?.trim() || 'Your Name',
        email: data?.header?.email?.trim() || 'your.email@example.com',
      },
    }

    // Generate .tex source from resume data
    const texSource = templateEngine(payload)

    // Compile .tex to PDF
    const pdfBuffer = await compileTex(texSource)

    // Send PDF response
    res.set('Content-Type', 'application/pdf')
    res.set('Content-Disposition', 'attachment; filename="resume.pdf"')
    res.send(pdfBuffer)
  } catch (err) {
    next(err)
  }
})

/**
 * Endpoint to get raw LaTeX (.tex) source string
 */
router.post('/tex', async (req, res, next) => {
  try {
    const data = req.body
    const texSource = templateEngine(data)
    res.json({ success: true, texSource })
  } catch (err) {
    next(err)
  }
})

export default router
