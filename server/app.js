import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRoutes from './routes/api.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PeshAssist API — AI Peshawar Assistant',
    status: 'online',
    docs: '/api/health',
  })
})

// Mount API Routes
app.use('/api', apiRoutes)

// 404 & Error Handling Middlewares
app.use(notFoundHandler)
app.use(errorHandler)

export default app
