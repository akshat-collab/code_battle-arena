import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectRedis } from './database/redis'
import { connectPostgres } from './database/postgres'
import { setupRoutes } from './api/routes'
import { setupSocket } from './services/real-time/socket'
import { logger } from './utils/logger'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connections
const initDatabases = async () => {
  try {
    await connectRedis()
    await connectPostgres()
    logger.info('Databases connected successfully')
  } catch (error) {
    logger.error('Database connection failed:', error)
    logger.warn('⚠️  Starting server without database connections')
    // Don't exit in development mode, allow server to start
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}

// API Routes
setupRoutes(app)

// Socket.IO setup
setupSocket(io)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await initDatabases()
  
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`)
    logger.info(`📡 Socket.IO server ready`)
  })
}

startServer().catch(err => {
  logger.error('Failed to start server:', err)
  process.exit(1)
})

export { io }

