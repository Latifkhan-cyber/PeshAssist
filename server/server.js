import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRoutes from './routes/api.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PeshAssist Server running on http://localhost:${PORT}`)
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`)
})
