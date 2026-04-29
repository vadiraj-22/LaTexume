import { Router } from 'express'
import { templateEngine } from '../lib/templateEngine.js'
import { compileTex } from '../lib/compiler.js'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const data = req.body

    // Validate required fields
    if (!data?.header?.name?.trim() || !data?.header?.email?.trim()) {
      return res.status(400).json({ message: 'Missing required fields: name, email' })
    }

    // Generate .tex source from resume data
    const texSource = templateEngine(data)

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

export default router
