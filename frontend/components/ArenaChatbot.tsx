'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatbotProps {
  currentQuestion?: {
    title: string
    description: string
    difficulty: string
  }
}

export default function ArenaChatbot({ currentQuestion }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m your coding assistant. I can help you with:\n• Understanding problems\n• Explaining algorithms\n• Debugging code\n• Providing hints\n• Code optimization\n\nWhat would you like help with?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response (in production, connect to OpenAI/Claude API)
    setIsTyping(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Context-aware responses based on user message
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('hint') || lowerMessage.includes('help')) {
      return `💡 Here's a helpful hint:\n\n${currentQuestion ? 
        'For this problem, try thinking about:\n• What data structure would work best?\n• Can you break it into smaller subproblems?\n• What edge cases should you consider?' :
        'Start by understanding the problem requirements. Break it down into smaller steps and think about the data structures that might help.'}`
    }
    
    if (lowerMessage.includes('algorithm') || lowerMessage.includes('approach')) {
      return `🧠 Algorithm approach:\n\n1. **Understand the problem**: Read the problem carefully\n2. **Identify patterns**: Look for common patterns (arrays, trees, graphs)\n3. **Choose data structure**: Pick the right DS for efficient solution\n4. **Write pseudocode**: Plan before coding\n5. **Code & test**: Implement and test with examples\n6. **Optimize**: Improve time/space complexity if needed`
    }
    
    if (lowerMessage.includes('debug') || lowerMessage.includes('error')) {
      return `🐛 Debugging tips:\n\n• **Check syntax**: Look for typos, missing brackets\n• **Print statements**: Add console.log/print to see values\n• **Test cases**: Try with smaller inputs first\n• **Edge cases**: Test with empty arrays, null values\n• **Logic errors**: Trace through your code step by step\n• **Time/Space**: Check for infinite loops or memory issues`
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('complexity')) {
      return `⚡ Optimization strategies:\n\n• **Time Complexity**:\n  - Use hash maps O(1) instead of arrays O(n)\n  - Two pointers technique\n  - Sliding window for subarrays\n  - Binary search for sorted data\n\n• **Space Complexity**:\n  - Use in-place operations when possible\n  - Avoid unnecessary data structures\n  - Reuse variables when you can`
    }
    
    if (currentQuestion && lowerMessage.includes(currentQuestion.title.toLowerCase())) {
      return `📝 About "${currentQuestion.title}":\n\n${currentQuestion.description.substring(0, 200)}...\n\nDifficulty: ${currentQuestion.difficulty}\n\nWould you like hints or a step-by-step approach?`
    }
    
    // Default intelligent response
    return `🤖 I understand you're asking about: "${userMessage}"\n\nHere's some guidance:\n\n• **Break it down**: Break complex problems into smaller parts\n• **Use examples**: Work through examples manually first\n• **Think aloud**: Explain your approach step by step\n• **Test incrementally**: Test each part as you build\n\nWould you like more specific help with:\n• Algorithm explanation\n• Code debugging\n• Problem hints\n• Complexity analysis`
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    const response = await generateAIResponse(userMessage)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    'Give me a hint',
    'Explain the approach',
    'Help me debug',
    'Optimize my code'
  ]

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
        title="AI Assistant"
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold text-white">AI Coding Assistant</h3>
                <p className="text-xs text-purple-100">Always here to help!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-purple-200' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(action)
                      setTimeout(() => handleSend(), 100)
                    }}
                    className="text-xs px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-full border border-purple-500/30"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about coding..."
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-semibold transition-all"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              💡 Tip: Ask for hints, explanations, or debugging help
            </p>
          </div>
        </div>
      )}
    </>
  )
}

