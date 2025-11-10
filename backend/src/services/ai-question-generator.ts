import axios from 'axios'
import { pool } from '../database/postgres'
import { logger } from '../utils/logger'

interface QuestionGenerationParams {
  difficulty: 'easy' | 'medium' | 'hard'
  topics?: string[]
  count?: number
}

interface GeneratedQuestion {
  title: string
  description: string
  difficulty: string
  points: number
  tags: string[]
  test_cases: Array<{
    input: any
    expected_output: any
    is_hidden: boolean
  }>
  solution_template: {
    python: string
    javascript: string
    java: string
  }
  hints: string[]
}

export class AIQuestionGenerator {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
  }

  async generateQuestion(params: QuestionGenerationParams): Promise<GeneratedQuestion> {
    const { difficulty, topics = ['arrays', 'algorithms'], count = 1 } = params

    const prompt = this.buildPrompt(difficulty, topics)

    try {
      // Use OpenAI or any LLM API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert competitive programming problem setter. Generate high-quality coding challenges with test cases.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const content = response.data.choices[0].message.content
      const question = this.parseQuestion(content, difficulty)
      
      return question
    } catch (error: any) {
      logger.error('Question generation error:', error.response?.data || error.message)
      
      // Fallback to template-based generation
      return this.generateTemplateQuestion(difficulty, topics)
    }
  }

  private buildPrompt(difficulty: string, topics: string[]): string {
    return `Generate a ${difficulty} level coding challenge problem about ${topics.join(', ')}.

Include:
1. A clear, concise title
2. Detailed problem description with examples
3. Input/output format specifications
4. Constraints
5. At least 5 test cases (3 public, 2 hidden)
6. Solution templates in Python, JavaScript, and Java
7. 2-3 hints to guide solvers

Format the response as JSON with the following structure:
{
  "title": "Problem Title",
  "description": "Problem description with examples...",
  "difficulty": "${difficulty}",
  "points": <points based on difficulty>,
  "tags": ["tag1", "tag2"],
  "test_cases": [
    {
      "input": {...},
      "expected_output": {...},
      "is_hidden": false
    }
  ],
  "solution_template": {
    "python": "def solution():\\n    pass",
    "javascript": "function solution() {\\n    // your code\\n}",
    "java": "public class Solution {\\n    public void solution() {\\n        // your code\\n    }\\n}"
  },
  "hints": ["hint1", "hint2"]
}`
  }

  private parseQuestion(content: string, difficulty: string): GeneratedQuestion {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate and return
      return {
        title: parsed.title || 'Generated Challenge',
        description: parsed.description || 'Solve this challenge',
        difficulty: difficulty,
        points: this.getPointsForDifficulty(difficulty),
        tags: parsed.tags || ['algorithms'],
        test_cases: parsed.test_cases || [],
        solution_template: parsed.solution_template || this.getDefaultTemplate(),
        hints: parsed.hints || []
      }
    } catch (error) {
      logger.error('Failed to parse question:', error)
      throw error
    }
  }

  private generateTemplateQuestion(difficulty: string, topics: string[]): GeneratedQuestion {
    // Fallback template when AI fails
    const templates = {
      easy: {
        title: 'Array Sum Challenge',
        description: `Write a function that takes an array of integers and returns the sum of all elements.

Example:
Input: [1, 2, 3, 4, 5]
Output: 15

Constraints:
- Array length: 1 ≤ n ≤ 1000
- Element values: -10^6 ≤ arr[i] ≤ 10^6`,
        test_cases: [
          { input: { arr: [1, 2, 3, 4, 5] }, expected_output: 15, is_hidden: false },
          { input: { arr: [-1, -2, -3] }, expected_output: -6, is_hidden: false },
          { input: { arr: [0] }, expected_output: 0, is_hidden: false },
          { input: { arr: [100, 200, 300] }, expected_output: 600, is_hidden: true },
          { input: { arr: [-5, 10, -3, 8] }, expected_output: 10, is_hidden: true }
        ],
        hints: ['Use a loop to iterate through the array', 'Initialize a sum variable to 0']
      },
      medium: {
        title: 'Find Pair with Target Sum',
        description: `Given an array of integers and a target sum, find two numbers that add up to the target.

Return the indices of the two numbers. You may assume that each input has exactly one solution.

Example:
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Constraints:
- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- Only one valid answer exists`,
        test_cases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expected_output: [0, 1], is_hidden: false },
          { input: { nums: [3, 2, 4], target: 6 }, expected_output: [1, 2], is_hidden: false },
          { input: { nums: [3, 3], target: 6 }, expected_output: [0, 1], is_hidden: false },
          { input: { nums: [1, 5, 3, 7, 9], target: 10 }, expected_output: [1, 3], is_hidden: true },
          { input: { nums: [-1, -2, -3, -4], target: -6 }, expected_output: [1, 3], is_hidden: true }
        ],
        hints: ['Try using a hash map to store seen numbers', 'For each number, check if target - number exists in the map']
      },
      hard: {
        title: 'Longest Increasing Subsequence',
        description: `Find the length of the longest strictly increasing subsequence in an array.

A subsequence is derived by deleting some or no elements without changing the order of the remaining elements.

Example:
Input: [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4
Explanation: The longest increasing subsequence is [2, 3, 7, 101]

Constraints:
- 1 ≤ nums.length ≤ 2500
- -10^4 ≤ nums[i] ≤ 10^4`,
        test_cases: [
          { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expected_output: 4, is_hidden: false },
          { input: { nums: [0, 1, 0, 3, 2, 3] }, expected_output: 4, is_hidden: false },
          { input: { nums: [7, 7, 7, 7] }, expected_output: 1, is_hidden: false },
          { input: { nums: [1, 3, 6, 7, 9, 4, 10, 5, 6] }, expected_output: 6, is_hidden: true },
          { input: { nums: [5, 4, 3, 2, 1] }, expected_output: 1, is_hidden: true }
        ],
        hints: ['Consider dynamic programming approach', 'Can you optimize using binary search?', 'Think about patience sorting algorithm']
      }
    }

    const template = templates[difficulty as keyof typeof templates]

    return {
      ...template,
      difficulty,
      points: this.getPointsForDifficulty(difficulty),
      tags: topics,
      solution_template: this.getDefaultTemplate()
    }
  }

  private getPointsForDifficulty(difficulty: string): number {
    const pointsMap: Record<string, number> = {
      easy: 10,
      medium: 20,
      hard: 30
    }
    return pointsMap[difficulty] || 10
  }

  private getDefaultTemplate() {
    return {
      python: `def solution(input_data):
    # Write your code here
    pass
    
# Example usage:
# result = solution(input_data)`,
      javascript: `function solution(inputData) {
    // Write your code here
    
}

// Example usage:
// const result = solution(inputData);`,
      java: `public class Solution {
    public Object solution(Object inputData) {
        // Write your code here
        return null;
    }
}`
    }
  }

  async saveQuestionToDatabase(question: GeneratedQuestion): Promise<string> {
    try {
      const result = await pool.query(
        `INSERT INTO challenges 
         (title, description, difficulty, points, tags, test_cases, solution_template)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          question.title,
          question.description,
          question.difficulty,
          question.points,
          question.tags,
          JSON.stringify(question.test_cases),
          JSON.stringify(question.solution_template)
        ]
      )

      return result.rows[0].id
    } catch (error) {
      logger.error('Failed to save question:', error)
      throw error
    }
  }

  async generateAndSaveQuestion(params: QuestionGenerationParams): Promise<{ id: string, question: GeneratedQuestion }> {
    const question = await this.generateQuestion(params)
    const id = await this.saveQuestionToDatabase(question)
    return { id, question }
  }
}

export const questionGenerator = new AIQuestionGenerator()

