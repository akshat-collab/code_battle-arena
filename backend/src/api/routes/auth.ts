import { Router } from 'express'
import { pool } from '../../database/postgres'
import { redis } from '../../database/redis'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Register
authRouter.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
      [email, username, hashedPassword]
    )

    const user = result.rows[0]

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ user, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const result = await pool.query(
      'SELECT id, email, username, password_hash FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // Cache user data in Redis
    await redis.setex(`user:${user.id}`, 3600, JSON.stringify({
      id: user.id,
      email: user.email,
      username: user.username,
    }))

    res.json({ 
      user: { id: user.id, email: user.email, username: user.username },
      token 
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// Get current user
authRouter.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    // Try to get from cache
    const cachedUser = await redis.get(`user:${decoded.userId}`)
    if (cachedUser) {
      return res.json({ user: JSON.parse(cachedUser) })
    }

    // Get from database
    const result = await pool.query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user: result.rows[0] })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

