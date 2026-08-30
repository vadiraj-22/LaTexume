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

// Log environment setup
console.log('🚀 Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  VERCEL: !!process.env.VERCEL,
  MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ MISSING',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'not set',
})

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://latexume.vercel.app',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools without origin header
      if (!origin) return callback(null, true)
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true)
      }
      return callback(null, origin)
    },
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'LaTexume API is running',
    timestamp: new Date().toISOString(),
  })
})

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

// ─── Initialize Database Connection ───────────────────────────────────────
// For serverless: connect on first use, don't crash on init
let dbConnected = false
const ensureDBConnected = async () => {
  if (!dbConnected) {
    try {
      await connectDB()
      dbConnected = true
    } catch (err) {
      console.error('❌  MongoDB connection failed:', err)
      // Don't exit in serverless - let request handlers deal with it
      if (process.env.NODE_ENV !== 'production') {
        throw err
      }
    }
  }
}

// Try to connect on startup (async, don't await)
ensureDBConnected().catch(() => {
  console.warn('⚠️  Skipping initial DB connection - will retry on first request')
})

// Only listen locally (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅  LaTexume API running on http://localhost:${PORT}`)
  })
}

// Export for Vercel serverless functions
export default app
