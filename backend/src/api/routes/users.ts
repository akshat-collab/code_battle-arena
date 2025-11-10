import { Router } from 'express'
import { pool } from '../../database/postgres'

export const usersRouter = Router()

// Get user profile
usersRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT id, username, email, created_at, 
              COALESCE(stats->>'total_submissions', '0') as total_submissions,
              COALESCE(stats->>'problems_solved', '0') as problems_solved,
              COALESCE(stats->>'current_rating', '0') as current_rating
       FROM users WHERE id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user: result.rows[0] })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Get leaderboard
usersRouter.get('/leaderboard', async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query

    const result = await pool.query(
      `SELECT id, username, 
              COALESCE((stats->>'current_rating')::int, 0) as rating,
              COALESCE((stats->>'problems_solved')::int, 0) as solved
       FROM users
       ORDER BY rating DESC, solved DESC
       LIMIT $1 OFFSET $2`,
      [limit, (page as number - 1) * (limit as number)]
    )

    res.json({ leaderboard: result.rows })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

