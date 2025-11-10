import { Server } from 'socket.io'

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Join competition room
    socket.on('join-competition', (competitionId) => {
      socket.join(`competition:${competitionId}`)
      io.to(`competition:${competitionId}`).emit('user-joined', {
        userId: socket.id,
        competitionId,
      })
    })

    // Leave competition room
    socket.on('leave-competition', (competitionId) => {
      socket.leave(`competition:${competitionId}`)
    })

    // Join competition room (new rooms feature)
    socket.on('join-room', (data) => {
      const { roomId, userId, username } = data
      socket.join(`room:${roomId}`)
      
      // Notify others in the room
      socket.to(`room:${roomId}`).emit('user-joined-room', {
        userId,
        username,
        roomId,
        timestamp: new Date().toISOString()
      })
      
      console.log(`User ${username} joined room ${roomId}`)
    })

    // Leave competition room
    socket.on('leave-room', (data) => {
      const { roomId, userId, username } = data
      socket.leave(`room:${roomId}`)
      
      socket.to(`room:${roomId}`).emit('user-left-room', {
        userId,
        username,
        roomId,
        timestamp: new Date().toISOString()
      })
    })

    // Room ready status
    socket.on('toggle-ready', (data) => {
      const { roomId, userId, isReady } = data
      io.to(`room:${roomId}`).emit('user-ready-status', {
        userId,
        isReady,
        timestamp: new Date().toISOString()
      })
    })

    // Competition start countdown
    socket.on('start-countdown', (data) => {
      const { roomId, countdown } = data
      io.to(`room:${roomId}`).emit('countdown-update', {
        countdown,
        timestamp: new Date().toISOString()
      })
    })

    // Live leaderboard updates
    socket.on('score-update', (data) => {
      const { roomId, userId, score, problemsSolved } = data
      io.to(`room:${roomId}`).emit('leaderboard-update', {
        userId,
        score,
        problemsSolved,
        timestamp: new Date().toISOString()
      })
    })

    // Real-time code sync
    socket.on('code-change', (data) => {
      socket.to(data.roomId).emit('code-update', {
        userId: socket.id,
        code: data.code,
        cursor: data.cursor,
      })
    })

    // Live submission updates
    socket.on('submission-update', (data) => {
      io.to(`competition:${data.competitionId}`).emit('submission-result', {
        userId: data.userId,
        challengeId: data.challengeId,
        status: data.status,
        score: data.score,
      })
    })

    // Room submission updates
    socket.on('room-submission', (data) => {
      const { roomId, userId, username, challengeId, status, score, language } = data
      io.to(`room:${roomId}`).emit('submission-notification', {
        userId,
        username,
        challengeId,
        status,
        score,
        language,
        timestamp: new Date().toISOString()
      })
    })

    // Chat messages
    socket.on('send-message', (data) => {
      io.to(data.roomId).emit('new-message', {
        userId: socket.id,
        username: data.username,
        message: data.message,
        timestamp: new Date().toISOString(),
      })
    })

    // Room chat messages
    socket.on('room-chat', (data) => {
      const { roomId, userId, username, message } = data
      io.to(`room:${roomId}`).emit('room-chat-message', {
        userId,
        username,
        message,
        timestamp: new Date().toISOString()
      })
    })

    // Question generated notification
    socket.on('question-generated', (data) => {
      const { roomId, question } = data
      io.to(`room:${roomId}`).emit('new-question', {
        question,
        timestamp: new Date().toISOString()
      })
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

