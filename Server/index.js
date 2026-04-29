import express from 'express'
import cors from 'cors'
import generateResumeRouter from './routes/generateResume.js'

const app = express()
const PORT = process.env.PORT ?? 3001

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

// Routes
app.use('/api/generate-resume', generateResumeRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: err.message })
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
