import { Pool } from 'pg'
import { logger } from '../utils/logger'

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'codebattle',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export const connectPostgres = async () => {
  try {
    const client = await pool.connect()
    logger.info('Connected to PostgreSQL')
    client.release()
    return pool
  } catch (error) {
    logger.error('PostgreSQL connection error:', error)
    throw error
  }
}

