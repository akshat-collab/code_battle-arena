import { Router } from 'express'
import { pool } from '../../database/postgres'

export const competitionsRouter = Router()

// Get all competitions
competitionsRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM competitions WHERE status IN ($1, $2) ORDER BY start_time DESC',
      ['upcoming', 'ongoing']
    )
    res.json({ competitions: result.rows })
  } catch (error) {
    console.error('Get competitions error:', error)
    res.status(500).json({ error: 'Failed to fetch competitions' })
  }
})

// Get competition by ID
competitionsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM competitions WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competition not found' })
    }

    res.json({ competition: result.rows[0] })
  } catch (error) {
    console.error('Get competition error:', error)
    res.status(500).json({ error: 'Failed to fetch competition' })
  }
})

// Join competition
competitionsRouter.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    await pool.query(
      'INSERT INTO competition_participants (competition_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, userId]
    )

    res.json({ message: 'Joined competition successfully' })
  } catch (error) {
    console.error('Join competition error:', error)
    res.status(500).json({ error: 'Failed to join competition' })
  }
})

