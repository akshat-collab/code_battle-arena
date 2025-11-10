import { Router } from 'express'
import { pool } from '../../database/postgres'

export const challengesRouter = Router()

// Get all challenges
challengesRouter.get('/', async (req, res) => {
  try {
    const { difficulty, tag, page = 1, limit = 20 } = req.query
    
    let query = 'SELECT * FROM challenges WHERE 1=1'
    const params: any[] = []
    let paramCount = 1

    if (difficulty) {
      query += ` AND difficulty = $${paramCount}`
      params.push(difficulty)
      paramCount++
    }

    if (tag) {
      query += ` AND tags @> $${paramCount}`
      params.push(JSON.stringify([tag]))
      paramCount++
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, (page as number - 1) * (limit as number))

    const result = await pool.query(query, params)
    res.json({ challenges: result.rows })
  } catch (error) {
    console.error('Get challenges error:', error)
    res.status(500).json({ error: 'Failed to fetch challenges' })
  }
})

// Get challenge by ID
challengesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM challenges WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' })
    }

    res.json({ challenge: result.rows[0] })
  } catch (error) {
    console.error('Get challenge error:', error)
    res.status(500).json({ error: 'Failed to fetch challenge' })
  }
})

// Create challenge (admin only)
challengesRouter.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, points, tags, test_cases } = req.body

    const result = await pool.query(
      `INSERT INTO challenges (title, description, difficulty, points, tags, test_cases)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, difficulty, points, JSON.stringify(tags), JSON.stringify(test_cases)]
    )

    res.status(201).json({ challenge: result.rows[0] })
  } catch (error) {
    console.error('Create challenge error:', error)
    res.status(500).json({ error: 'Failed to create challenge' })
  }
})

// Submit solution
challengesRouter.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params
    const { code, language, userId } = req.body

    // TODO: Execute code and validate against test cases
    // This will be handled by the code execution service

    // Store submission
    const result = await pool.query(
      `INSERT INTO submissions (challenge_id, user_id, code, language, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, userId, code, language, 'pending']
    )

    res.status(201).json({ submission: result.rows[0] })
  } catch (error) {
    console.error('Submit challenge error:', error)
    res.status(500).json({ error: 'Failed to submit solution' })
  }
})

