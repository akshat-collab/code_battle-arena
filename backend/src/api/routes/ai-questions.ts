import { Router } from 'express'
import { questionGenerator } from '../../services/ai-question-generator'

export const aiQuestionsRouter = Router()

// Generate a new question using AI
aiQuestionsRouter.post('/generate', async (req, res) => {
  try {
    const { difficulty = 'medium', topics = ['algorithms'], count = 1 } = req.body

    const { id, question } = await questionGenerator.generateAndSaveQuestion({
      difficulty,
      topics,
      count
    })

    res.status(201).json({ 
      message: 'Question generated successfully',
      challenge_id: id,
      question 
    })
  } catch (error) {
    console.error('Generate question error:', error)
    res.status(500).json({ error: 'Failed to generate question' })
  }
})

// Generate multiple questions
aiQuestionsRouter.post('/generate-batch', async (req, res) => {
  try {
    const { difficulty = 'medium', topics = ['algorithms'], count = 3 } = req.body

    const questions = []

    for (let i = 0; i < count; i++) {
      const result = await questionGenerator.generateAndSaveQuestion({
        difficulty,
        topics: topics,
        count: 1
      })
      questions.push(result)
    }

    res.status(201).json({ 
      message: `Generated ${count} questions successfully`,
      questions 
    })
  } catch (error) {
    console.error('Generate batch error:', error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
})

// Generate questions for a specific room
aiQuestionsRouter.post('/generate-for-room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params
    const { difficulty = 'medium', count = 5 } = req.body

    const questions = []

    for (let i = 0; i < count; i++) {
      const result = await questionGenerator.generateAndSaveQuestion({
        difficulty,
        topics: ['algorithms', 'data-structures'],
        count: 1
      })
      questions.push(result)
    }

    res.status(201).json({ 
      room_id: roomId,
      questions 
    })
  } catch (error) {
    console.error('Generate room questions error:', error)
    res.status(500).json({ error: 'Failed to generate questions for room' })
  }
})

