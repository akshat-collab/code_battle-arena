import Redis from 'ioredis'
import { logger } from '../utils/logger'

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

redis.on('connect', () => {
  logger.info('Connected to Redis')
})

redis.on('error', (error) => {
  logger.error('Redis connection error:', error)
})

export const connectRedis = async () => {
  try {
    await redis.ping()
    logger.info('Redis connection established')
    return redis
  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    throw error
  }
}

