import { Router } from 'express'
import { pool } from '../../database/postgres'
import { redis } from '../../database/redis'
import { io } from '../../server'

export const roomsRouter = Router()

// Get all active rooms
roomsRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
              u.username as creator_name,
              COUNT(DISTINCT rp.user_id) as participant_count
       FROM competition_rooms r
       LEFT JOIN users u ON r.creator_id = u.id
       LEFT JOIN room_participants rp ON r.id = rp.room_id
       WHERE r.status IN ('waiting', 'ongoing')
       GROUP BY r.id, u.username
       ORDER BY r.created_at DESC`
    )
    res.json({ rooms: result.rows })
  } catch (error) {
    console.error('Get rooms error:', error)
    res.status(500).json({ error: 'Failed to fetch rooms' })
  }
})

// Get room by ID with details
roomsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const roomResult = await pool.query(
      `SELECT r.*, u.username as creator_name
       FROM competition_rooms r
       LEFT JOIN users u ON r.creator_id = u.id
       WHERE r.id = $1`,
      [id]
    )

    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' })
    }

    const participantsResult = await pool.query(
      `SELECT rp.*, u.username, u.stats
       FROM room_participants rp
       JOIN users u ON rp.user_id = u.id
       WHERE rp.room_id = $1
       ORDER BY rp.score DESC, rp.joined_at ASC`,
      [id]
    )

    res.json({ 
      room: roomResult.rows[0],
      participants: participantsResult.rows 
    })
  } catch (error) {
    console.error('Get room error:', error)
    res.status(500).json({ error: 'Failed to fetch room' })
  }
})

// Helper function to ensure user exists in database
async function ensureUserExists(
  clerkId: string,
  email?: string,
  name?: string
): Promise<string> {
  try {
    // First, try to add clerk_id column if it doesn't exist (for migration)
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255)
      `)
      // Add unique constraint if it doesn't exist
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'users_clerk_id_key'
          ) THEN
            ALTER TABLE users ADD CONSTRAINT users_clerk_id_key UNIQUE (clerk_id);
          END IF;
        END $$;
      `)
    } catch (alterError) {
      // Column or constraint might already exist, ignore error
      console.log('Migration note:', alterError instanceof Error ? alterError.message : 'Unknown error')
    }

    // Check if user exists by clerk_id or email
    let userResult = await pool.query(
      `SELECT id FROM users WHERE clerk_id = $1 OR email = $2 LIMIT 1`,
      [clerkId, email || '']
    )

    if (userResult.rows.length > 0) {
      // Update clerk_id if it's missing
      await pool.query(
        `UPDATE users SET clerk_id = $1 WHERE id = $2 AND clerk_id IS NULL`,
        [clerkId, userResult.rows[0].id]
      )
      return userResult.rows[0].id
    }

    // Create new user if doesn't exist
    const username = name?.toLowerCase().replace(/\s+/g, '_').substring(0, 50) || `user_${clerkId.substring(0, 8)}`
    
    // Check if username already exists and make it unique
    let finalUsername = username
    let counter = 1
    while (true) {
      const existingUser = await pool.query(
        `SELECT id FROM users WHERE username = $1`,
        [finalUsername]
      )
      if (existingUser.rows.length === 0) break
      finalUsername = `${username}_${counter}`
      counter++
      if (counter > 1000) {
        // Fallback to random suffix
        finalUsername = `${username}_${Math.random().toString(36).substring(2, 8)}`
        break
      }
    }

    // Try to insert user, handle conflicts
    let insertResult
    try {
      insertResult = await pool.query(
        `INSERT INTO users (email, username, password_hash, stats, clerk_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [
          email || `${clerkId}@clerk.local`,
          finalUsername,
          'clerk_auth', // Placeholder since Clerk handles auth
          JSON.stringify({ total_submissions: 0, problems_solved: 0, current_rating: 1500 }),
          clerkId
        ]
      )
    } catch (insertError) {
      // If conflict, try to get existing user
      if (insertError instanceof Error && 
          (insertError.message.includes('unique constraint') || insertError.message.includes('duplicate key'))) {
        const existingUser = await pool.query(
          `SELECT id FROM users WHERE clerk_id = $1 OR email = $2 LIMIT 1`,
          [clerkId, email || '']
        )
        if (existingUser.rows.length > 0) {
          // Update clerk_id if missing
          await pool.query(
            `UPDATE users SET clerk_id = $1 WHERE id = $2 AND clerk_id IS NULL`,
            [clerkId, existingUser.rows[0].id]
          )
          return existingUser.rows[0].id
        }
      }
      throw insertError
    }

    return insertResult.rows[0].id
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    // If there's a constraint error, try to find existing user
    if (error instanceof Error && error.message.includes('unique constraint')) {
      const userResult = await pool.query(
        `SELECT id FROM users WHERE clerk_id = $1 OR email = $2 LIMIT 1`,
        [clerkId, email || '']
      )
      if (userResult.rows.length > 0) {
        return userResult.rows[0].id
      }
    }
    throw error
  }
}

// Create a new competition room
roomsRouter.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      creator_id, 
      creator_email,
      creator_name,
      max_participants = 10, 
      difficulty = 'medium',
      time_limit = 3600, // 1 hour in seconds
      is_private = false,
      room_code = null
    } = req.body

    // Validate required fields
    if (!name || !creator_id) {
      return res.status(400).json({ error: 'Room name and creator ID are required' })
    }

    // Ensure user exists in database
    const userId = await ensureUserExists(creator_id, creator_email, creator_name)

    // Validate room code for private rooms
    if (is_private && !room_code) {
      return res.status(400).json({ error: 'Room code is required for private rooms' })
    }

    const result = await pool.query(
      `INSERT INTO competition_rooms 
       (name, description, creator_id, max_participants, difficulty, time_limit, is_private, room_code, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'waiting')
       RETURNING *`,
      [name, description, userId, max_participants, difficulty, time_limit, is_private, room_code]
    )

    const room = result.rows[0]

    // Add creator as first participant
    try {
      await pool.query(
        `INSERT INTO room_participants (room_id, user_id, is_ready)
         VALUES ($1, $2, false)
         ON CONFLICT (room_id, user_id) DO NOTHING`,
        [room.id, userId]
      )
    } catch (participantError) {
      console.warn('Failed to add creator as participant:', participantError)
      // Continue even if adding participant fails
    }

    // Notify all connected clients about new room
    io.emit('room-created', { room })

    res.status(201).json({ room })
  } catch (error) {
    console.error('Create room error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create room'
    res.status(500).json({ error: errorMessage })
  }
})

// Join a room
roomsRouter.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params
    const { user_id, room_code } = req.body

    // Check if room exists and is available
    const roomResult = await pool.query(
      `SELECT * FROM competition_rooms WHERE id = $1`,
      [id]
    )

    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' })
    }

    const room = roomResult.rows[0]

    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Room is not accepting participants' })
    }

    if (room.is_private && room.room_code !== room_code) {
      return res.status(403).json({ error: 'Invalid room code' })
    }

    // Check participant count
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM room_participants WHERE room_id = $1`,
      [id]
    )

    if (parseInt(countResult.rows[0].count) >= room.max_participants) {
      return res.status(400).json({ error: 'Room is full' })
    }

    // Add participant
    await pool.query(
      `INSERT INTO room_participants (room_id, user_id, is_ready)
       VALUES ($1, $2, false)
       ON CONFLICT (room_id, user_id) DO NOTHING`,
      [id, user_id]
    )

    // Get updated participant info
    const userResult = await pool.query(
      `SELECT id, username, stats FROM users WHERE id = $1`,
      [user_id]
    )

    // Notify room members
    io.to(`room:${id}`).emit('user-joined', {
      room_id: id,
      user: userResult.rows[0]
    })

    res.json({ message: 'Joined room successfully' })
  } catch (error) {
    console.error('Join room error:', error)
    res.status(500).json({ error: 'Failed to join room' })
  }
})

// Leave a room
roomsRouter.post('/:id/leave', async (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.body

    await pool.query(
      `DELETE FROM room_participants WHERE room_id = $1 AND user_id = $2`,
      [id, user_id]
    )

    // Notify room members
    io.to(`room:${id}`).emit('user-left', {
      room_id: id,
      user_id
    })

    // Check if room is empty
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM room_participants WHERE room_id = $1`,
      [id]
    )

    if (parseInt(countResult.rows[0].count) === 0) {
      // Delete empty room
      await pool.query(
        `DELETE FROM competition_rooms WHERE id = $1`,
        [id]
      )
    }

    res.json({ message: 'Left room successfully' })
  } catch (error) {
    console.error('Leave room error:', error)
    res.status(500).json({ error: 'Failed to leave room' })
  }
})

// Start competition
roomsRouter.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params
    const { creator_id } = req.body

    // Verify creator
    const roomResult = await pool.query(
      `SELECT * FROM competition_rooms WHERE id = $1 AND creator_id = $2`,
      [id, creator_id]
    )

    if (roomResult.rows.length === 0) {
      return res.status(403).json({ error: 'Only room creator can start competition' })
    }

    // Update room status
    await pool.query(
      `UPDATE competition_rooms 
       SET status = 'ongoing', started_at = NOW()
       WHERE id = $1`,
      [id]
    )

    // Notify all participants
    io.to(`room:${id}`).emit('competition-started', {
      room_id: id,
      started_at: new Date().toISOString()
    })

    res.json({ message: 'Competition started' })
  } catch (error) {
    console.error('Start competition error:', error)
    res.status(500).json({ error: 'Failed to start competition' })
  }
})

// Submit solution in room
roomsRouter.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params
    const { user_id, challenge_id, code, language } = req.body

    // Record submission
    const result = await pool.query(
      `INSERT INTO submissions (challenge_id, user_id, code, language, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [challenge_id, user_id, code, language]
    )

    const submission = result.rows[0]

    // TODO: Execute code and validate
    // For now, mark as accepted and give points
    const points = 100
    
    await pool.query(
      `UPDATE submissions SET status = 'accepted', score = $1 WHERE id = $2`,
      [points, submission.id]
    )

    // Update participant score
    await pool.query(
      `UPDATE room_participants 
       SET score = score + $1, problems_solved = problems_solved + 1
       WHERE room_id = $2 AND user_id = $3`,
      [points, id, user_id]
    )

    // Notify room about submission
    io.to(`room:${id}`).emit('submission-update', {
      room_id: id,
      user_id,
      challenge_id,
      status: 'accepted',
      score: points
    })

    res.json({ submission, points })
  } catch (error) {
    console.error('Submit solution error:', error)
    res.status(500).json({ error: 'Failed to submit solution' })
  }
})

// Get room leaderboard
roomsRouter.get('/:id/leaderboard', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT rp.*, u.username, u.stats
       FROM room_participants rp
       JOIN users u ON rp.user_id = u.id
       WHERE rp.room_id = $1
       ORDER BY rp.score DESC, rp.problems_solved DESC
       LIMIT 100`,
      [id]
    )

    res.json({ leaderboard: result.rows })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

