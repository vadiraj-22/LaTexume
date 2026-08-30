import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import connectDB from './src/db/db.js'
import generateResumeRouter from './routes/generateResume.js'
import parseResumeRouter from './routes/parseResume.js'
import aiRouter from './routes/ai.routes.js'
import userRouter from './src/routes/user.routes.js'
import resumeRouter from './src/routes/resume.routes.js'

const app = express()
const PORT = process.env.PORT ?? 3000

// Log environment setup
// ─── Environment summary ──────────────────────────────────────────────────────
console.log('🚀 Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  VERCEL: !!process.env.VERCEL,
  MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ MISSING',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'not set',
})

// ─── Middleware ───────────────────────────────────────────────────────────────
// CORS configuration - must be FIRST middleware
// ─── Allowed Origins List ─────────────────────────────────────────────────────
const defaultAllowedOrigins = [
  'https://latexume.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
]

const getAllowedOrigins = () => {
  const origins = [...defaultAllowedOrigins]
  if (process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN.split(',').forEach((orig) => {
      const trimmed = orig.trim()
      if (trimmed && !origins.includes(trimmed)) {
        origins.push(trimmed)
      }
    })
  }
  return origins
}

const isOriginAllowed = (origin) => {
  if (!origin) return true
  const allowed = getAllowedOrigins()
  if (allowed.includes(origin)) return true
  if (origin.endsWith('.vercel.app')) return true
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true
  return false
}

// ─── CORS Middleware ──────────────────────────────────────────────────────────
// Ensure CORS headers on ALL responses (including OPTIONS preflights and error responses)
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/')
  
  // Allow all vercel.app domains
  if (origin?.includes('vercel.app') || origin?.includes('localhost')) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (isOriginAllowed(origin)) {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
    )
    res.setHeader('Access-Control-Max-Age', '86400')
  }
  

  // Preflight fast-exit
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
    return res.status(200).end()
  }
  

  next()
})

// Additional CORS middleware as fallback
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
        return callback(null, true)
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

// ─── Database Middleware (Ensures Serverless Connects Per Request) ────────────
let dbPromise = null
const ensureDBConnected = async () => {
  if (mongoose.connection.readyState === 1) {
    return
  }
  if (!dbPromise) {
    dbPromise = connectDB().finally(() => {
      dbPromise = null
    })
  }
  return dbPromise
}

app.use(async (_req, _res, next) => {
  try {
    await ensureDBConnected()
  } catch (err) {
    console.error('Database connection error in middleware:', err.message)
  }
  next()
})

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
app.use((err, req, res, _next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Ensure CORS headers on error responses
  const origin = req.headers.origin
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

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
// Only listen locally (not in serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅  LaTexume API running on http://localhost:${PORT}`)
    console.log(`✅ LaTexume API running on http://localhost:${PORT}`)
  })
}

// Export for Vercel serverless functions
export default app
