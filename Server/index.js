import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './src/db/db.js'
import generateResumeRouter from './routes/generateResume.js'
import userRouter from './src/routes/user.routes.js'

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
app.use('/api/v1/users', userRouter)                  // Auth (register / login / logout / me)

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500
  console.error(`[${statusCode}] ${err.message}`)
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
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
