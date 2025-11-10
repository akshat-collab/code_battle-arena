'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import ArenaChatbot from '@/components/ArenaChatbot'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const API_URL = 'http://localhost:5000'

interface Question {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  testCases: TestCase[]
  hints: string[]
}

interface TestCase {
  input: string
  expected: string
  hidden?: boolean
}

interface Participant {
  id: string
  name: string
  avatar?: string
  score: number
  status: 'ready' | 'coding' | 'submitted'
}

const LANGUAGES = [
  { id: 'python', name: 'Python', extension: 'py', template: '# Write your code here\ndef solution():\n    pass\n\n# Call your solution\nsolution()' },
  { id: 'javascript', name: 'JavaScript', extension: 'js', template: '// Write your code here\nfunction solution() {\n    // Your code\n}\n\nsolution();' },
  { id: 'typescript', name: 'TypeScript', extension: 'ts', template: '// Write your code here\nfunction solution(): void {\n    // Your code\n}\n\nsolution();' },
  { id: 'java', name: 'Java', extension: 'java', template: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}' },
  { id: 'cpp', name: 'C++', extension: 'cpp', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}' },
  { id: 'go', name: 'Go', extension: 'go', template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your code here\n    fmt.Println("Hello, World!")\n}' },
  { id: 'rust', name: 'Rust', extension: 'rs', template: 'fn main() {\n    // Write your code here\n    println!("Hello, World!");\n}' },
  { id: 'c', name: 'C', extension: 'c', template: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}' },
]

// Sample AI-generated DSA questions
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    difficulty: 'easy',
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
      { input: '[3,3], 6', expected: '[0,1]', hidden: true }
    ],
    hints: [
      'Try using a hash map to store numbers you\'ve seen',
      'For each number, check if target - number exists in the hash map'
    ]
  },
  {
    id: '2',
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
    difficulty: 'medium',
    testCases: [
      { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: '[1,2]', expected: '[2,1]' },
      { input: '[]', expected: '[]', hidden: true }
    ],
    hints: [
      'Think about changing the next pointers',
      'You can do this iteratively with three pointers'
    ]
  },
  {
    id: '3',
    title: 'Binary Tree Maximum Path Sum',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node\'s values in the path.\n\nGiven the root of a binary tree, return the maximum path sum of any non-empty path.',
    difficulty: 'hard',
    testCases: [
      { input: '[1,2,3]', expected: '6' },
      { input: '[-10,9,20,null,null,15,7]', expected: '42' },
      { input: '[1]', expected: '1', hidden: true }
    ],
    hints: [
      'Use post-order traversal (left, right, root)',
      'For each node, calculate the maximum path sum that includes that node',
      'Keep track of the global maximum'
    ]
  }
]

export default function RoomPage() {
  const params = useParams()
  const roomId = params.id as string

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [currentQuestion, setCurrentQuestion] = useState<Question>(SAMPLE_QUESTIONS[0])
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS)
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', score: 0, status: 'coding' },
    { id: '2', name: 'Player 2', score: 45, status: 'coding' },
    { id: '3', name: 'Player 3', score: 30, status: 'ready' }
  ])
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
  const [testResults, setTestResults] = useState<any[]>([])
  const [generatingQuestion, setGeneratingQuestion] = useState(false)

  // Initialize code template
  useEffect(() => {
    setCode(language.template)
  }, [language])

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running code...\n')

    try {
      // Simulate code execution (in real app, call backend API)
      setTimeout(() => {
        const results = currentQuestion.testCases.filter(tc => !tc.hidden).map((tc, i) => ({
          index: i + 1,
          passed: Math.random() > 0.3, // Simulate pass/fail
          input: tc.input,
          expected: tc.expected,
          actual: tc.expected // In real app, this would be actual output
        }))

        setTestResults(results)
        const passed = results.filter(r => r.passed).length
        setOutput(`\n✅ Passed: ${passed}/${results.length} test cases\n\n` + 
          results.map(r => 
            `Test ${r.index}: ${r.passed ? '✅ PASS' : '❌ FAIL'}\n` +
            `Input: ${r.input}\n` +
            `Expected: ${r.expected}\n` +
            (r.passed ? '' : `Got: ${r.actual}\n`)
          ).join('\n'))
        
        setIsRunning(false)
      }, 1500)
    } catch (error) {
      setOutput(`❌ Error: ${error}`)
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    setIsRunning(true)
    setOutput('Submitting code...\n')

    try {
      // Run all test cases including hidden ones
      setTimeout(() => {
        const allResults = currentQuestion.testCases.map((tc, i) => ({
          index: i + 1,
          passed: Math.random() > 0.2,
          hidden: tc.hidden || false
        }))

        const passed = allResults.filter(r => r.passed).length
        const total = allResults.length
        const score = Math.floor((passed / total) * 100)

        setOutput(
          `\n🎯 Submission Results\n\n` +
          `✅ Passed: ${passed}/${total} test cases\n` +
          `🏆 Score: ${score}/100\n\n` +
          allResults.map(r => 
            `Test ${r.index}: ${r.passed ? '✅ PASS' : '❌ FAIL'}${r.hidden ? ' (hidden)' : ''}`
          ).join('\n')
        )

        // Update participant score
        setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, score: p.score + score, status: 'submitted' as const } : p
        ))

        setIsRunning(false)
      }, 2000)
    } catch (error) {
      setOutput(`❌ Error: ${error}`)
      setIsRunning(false)
    }
  }

  const generateAIQuestion = async () => {
    setGeneratingQuestion(true)
    setOutput('🤖 Generating new DSA question using AI...\n')

    try {
      // In real app, call OpenAI API via backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate AI-generated question
      const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']
      const newQuestion: Question = {
        id: Date.now().toString(),
        title: 'AI Generated: Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n\nExample:\nInput: s = "()"\nOutput: true\n\nInput: s = "([)]"\nOutput: false',
        difficulty: difficulties[Math.floor(Math.random() * 3)],
        testCases: [
          { input: '"()"', expected: 'true' },
          { input: '"()[]{}"', expected: 'true' },
          { input: '"(]"', expected: 'false', hidden: true }
        ],
        hints: [
          'Use a stack data structure',
          'Push opening brackets, pop for closing brackets'
        ]
      }

      setQuestions(prev => [...prev, newQuestion])
      setCurrentQuestion(newQuestion)
      setOutput(`✅ New question generated!\n\n${newQuestion.title}\n\nDifficulty: ${newQuestion.difficulty.toUpperCase()}`)
    } catch (error) {
      setOutput(`❌ Failed to generate question: ${error}`)
    } finally {
      setGeneratingQuestion(false)
    }
  }

  const inviteFriend = () => {
    setShowInvite(true)
  }

  const copyRoomLink = () => {
    const link = `${window.location.origin}/arena-react/room/${roomId}`
    navigator.clipboard.writeText(link)
    alert('✅ Room link copied! Share with friends!')
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/arena-react" className="text-purple-400 hover:text-purple-300">
            ← Back to Rooms
          </a>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="text-xl font-bold">Room #{roomId}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">⏱️</span>
            <span className={`text-lg font-mono font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-green-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">👥</span>
            <span className="font-semibold">{participants.length} Players</span>
          </div>

          {/* Invite Button */}
          <button
            onClick={inviteFriend}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-sm"
          >
            + Invite Friends
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Participants & Questions */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Participants */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold mb-3">👥 Participants</h3>
            <div className="space-y-2">
              {participants.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                      {p.name[0]}
                    </div>
                    <span className="text-sm">{p.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{p.score}pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">📝 Questions</h3>
              <button
                onClick={generateAIQuestion}
                disabled={generatingQuestion}
                className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
                title="Generate new AI question"
              >
                {generatingQuestion ? '⏳' : '🤖 AI'}
              </button>
            </div>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(q)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    currentQuestion.id === q.id
                      ? 'bg-purple-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">Q{i + 1}: {q.title}</div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {q.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle - Problem Description */}
        <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">{currentQuestion.title}</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h3 className="font-bold mb-2">Problem</h3>
              <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                {currentQuestion.description}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Test Cases</h3>
              <div className="space-y-2">
                {currentQuestion.testCases.filter(tc => !tc.hidden).map((tc, i) => (
                  <div key={i} className="bg-gray-700 p-3 rounded text-sm">
                    <div className="mb-1"><span className="text-gray-400">Input:</span> {tc.input}</div>
                    <div><span className="text-gray-400">Expected:</span> {tc.expected}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
              >
                💡 {showHints ? 'Hide' : 'Show'} Hints ({currentQuestion.hints.length})
              </button>
              {showHints && (
                <div className="mt-2 space-y-2">
                  {currentQuestion.hints.map((hint, i) => (
                    <div key={i} className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded text-sm text-yellow-200">
                      Hint {i + 1}: {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Code Editor & Output */}
        <div className="flex-1 flex flex-col">
          {/* Language Selector & Actions */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">Language:</label>
              <select
                value={language.id}
                onChange={(e) => {
                  const newLang = LANGUAGES.find(l => l.id === e.target.value) || LANGUAGES[0]
                  setLanguage(newLang)
                }}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold text-sm disabled:opacity-50"
              >
                {isRunning ? '⏳ Running...' : '▶️ Run'}
              </button>
              <button
                onClick={submitCode}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold text-sm disabled:opacity-50"
              >
                {isRunning ? '⏳ Submitting...' : '✅ Submit'}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={language.id}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output Terminal */}
          <div className="h-48 bg-black border-t border-gray-700 p-4 overflow-y-auto font-mono text-sm">
            <div className="text-gray-400 mb-2">Output:</div>
            <pre className="text-green-400 whitespace-pre-wrap">{output || 'No output yet. Run your code to see results.'}</pre>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">👥 Invite Friends to Compete</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm mb-3">
                  💡 Share this room link with friends so they can join and compete with you!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Room Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/arena-react/room/${roomId}`}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg"
                  />
                  <button
                    onClick={copyRoomLink}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Share via</label>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={`https://wa.me/?text=Join my coding battle! ${encodeURIComponent(`${window.location.origin}/arena-react/room/${roomId}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                  >
                    📱 WhatsApp
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/arena-react/room/${roomId}`)}&text=Join my coding battle!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    ✈️ Telegram
                  </a>
                  <a
                    href={`mailto:?subject=Join my coding battle&body=Join me: ${window.location.origin}/arena-react/room/${roomId}`}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold"
                  >
                    📧 Email
                  </a>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Join my coding battle!',
                          text: 'Compete with me in this coding challenge',
                          url: `${window.location.origin}/arena-react/room/${roomId}`
                        })
                      } else {
                        alert('Share feature not supported on this browser')
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
                  >
                    📤 Share
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowInvite(false)}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot with current question context */}
      <ArenaChatbot 
        currentQuestion={{
          title: currentQuestion.title,
          description: currentQuestion.description,
          difficulty: currentQuestion.difficulty
        }}
      />
    </div>
  )
}

