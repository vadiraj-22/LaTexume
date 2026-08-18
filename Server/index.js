import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './src/db/db.js'
import generateResumeRouter from './routes/generateResume.js'
import parseResumeRouter from './routes/parseResume.js'
import aiRouter from './routes/ai.routes.js'
import userRouter from './src/routes/user.routes.js'
import resumeRouter from './src/routes/resume.routes.js'

const app = express()
const PORT = process.env.PORT ?? 3000

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://latexume.vercel.app',
      /\.vercel\.app$/, // Allow all Vercel preview deployments
    ],
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'LaTexume API is running',
    timestamp: new Date().toISOString(),
  })
})

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/generate-resume', generateResumeRouter) // PDF generation
app.use('/api/parse-resume', parseResumeRouter)       // Resume parsing & auto-fill
app.use('/api/ai', aiRouter)                           // AI Optimization (Bullet Polish & JD Matcher)
app.use('/api/v1/users', userRouter)                  // Auth (register / login / logout / me)
app.use('/api/v1/resumes', resumeRouter)               // Resume Persistence (Save/Load/Delete)

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Handle MongoDB duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    message = `User with this ${field} already exists`
  }

  // Log unexpected internal server errors (5xx), omit expected client operational responses (4xx)
  if (statusCode >= 500) {
    console.error(`[${statusCode}] ${message}`, err)
  }
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  })
})

// ─── Start server after DB connection ────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅  LaTexume API running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err)
    process.exit(1)
  })
