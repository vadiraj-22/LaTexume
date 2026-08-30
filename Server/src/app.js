import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'


const app = express();

const allowedOrigins = [
  'https://latexume.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
]

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
        callback(null, true)
      } else if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.split(',').map(s => s.trim()).includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

//routes import 
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)


export {app}