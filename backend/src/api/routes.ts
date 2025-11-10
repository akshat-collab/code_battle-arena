import { Express } from 'express'
import { authRouter } from './routes/auth'
import { challengesRouter } from './routes/challenges'
import { usersRouter } from './routes/users'
import { competitionsRouter } from './routes/competitions'
import { roomsRouter } from './routes/rooms'
import { aiQuestionsRouter } from './routes/ai-questions'

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRouter)
  app.use('/api/challenges', challengesRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/competitions', competitionsRouter)
  app.use('/api/rooms', roomsRouter)
  app.use('/api/ai-questions', aiQuestionsRouter)
}

