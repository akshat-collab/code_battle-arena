'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

interface Room {
  id: string
  name: string
  description: string
  creator_name: string
  max_participants: number
  participant_count: number
  difficulty: string
  status: string
  is_private: boolean
  created_at: string
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rooms')
      const data = await res.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-red-500/20 text-red-400',
    mixed: 'bg-purple-500/20 text-purple-400',
  }

  const statusColors: Record<string, string> = {
    waiting: 'bg-blue-500/20 text-blue-400',
    ongoing: 'bg-orange-500/20 text-orange-400',
    completed: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-4">Competition Rooms</h1>
          <p className="text-gray-400">
            Join or create coding competition rooms and compete in real-time
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all"
        >
          + Create Room
        </button>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-arena-primary"></div>
          <p className="mt-4 text-gray-400">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold mb-2">No Active Rooms</h3>
          <p className="text-gray-400 mb-6">Be the first to create a competition room!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all"
          >
            Create Room
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link key={room.id} href={`/arena/rooms/${room.id}`}>
              <div className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[room.status]}`}>
                    {room.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[room.difficulty]}`}>
                    {room.difficulty.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                <p className="text-gray-400 mb-4 flex-grow line-clamp-2">{room.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Created by:</span>
                    <span className="text-white font-medium">{room.creator_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Participants:</span>
                    <span className="text-white font-medium">
                      {room.participant_count} / {room.max_participants}
                    </span>
                  </div>
                  {room.is_private && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">Private Room</span>
                    </div>
                  )}
                </div>

                <button className="mt-4 w-full px-4 py-2 bg-arena-primary/20 hover:bg-arena-primary text-arena-primary hover:text-white font-semibold rounded-lg transition-all">
                  Join Room
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <CreateRoomModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchRooms()
          }}
        />
      )}
    </div>
  )
}

function CreateRoomModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_participants: 10,
    difficulty: 'medium',
    time_limit: 3600,
    is_private: false,
    room_code: '',
    generate_ai_questions: false,
    question_count: 3
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, isSignedIn } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Check if user is signed in
    if (!isSignedIn || !user) {
      setError('Please sign in to create a room')
      setLoading(false)
      return
    }

    try {
      // Create room
      const res = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          creator_id: user.id,
          creator_email: user.primaryEmailAddress?.emailAddress || '',
          creator_name: user.fullName || user.firstName || 'User',
          room_code: formData.is_private ? formData.room_code : null
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to create room' }))
        throw new Error(errorData.error || `Server error: ${res.status}`)
      }

      const data = await res.json()

      // Generate AI questions if requested
      if (formData.generate_ai_questions && data.room?.id) {
        try {
          const aiRes = await fetch('http://localhost:5000/api/ai-questions/generate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              difficulty: formData.difficulty,
              count: formData.question_count,
              topics: ['algorithms', 'data-structures'],
              room_id: data.room.id
            })
          })
          
          if (!aiRes.ok) {
            console.warn('Failed to generate AI questions, but room was created')
          }
        } catch (aiError) {
          console.warn('Error generating AI questions:', aiError)
          // Don't fail room creation if AI question generation fails
        }
      }

      onSuccess()
      router.push(`/arena/rooms/${data.room.id}`)
    } catch (error) {
      console.error('Failed to create room:', error)
      setError(error instanceof Error ? error.message : 'Failed to create room. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">Create Competition Room</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {!isSignedIn && (
          <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400">
            Please sign in to create a room. <Link href="/sign-in" className="underline">Sign in here</Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Room Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
              placeholder="e.g., Friday Night Code Battle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
              rows={3}
              placeholder="Describe your competition..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Participants</label>
              <input
                type="number"
                min="2"
                max="50"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              min="10"
              max="240"
              value={formData.time_limit / 60}
              onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) * 60 })}
              className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_private}
                onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                className="w-5 h-5 text-arena-primary"
              />
              <span>Private Room (requires code to join)</span>
            </label>

            {formData.is_private && (
              <input
                type="text"
                value={formData.room_code}
                onChange={(e) => setFormData({ ...formData, room_code: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
                placeholder="Enter room code"
              />
            )}
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🤖</span>
              <span>AI-Powered Questions</span>
            </h3>

            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={formData.generate_ai_questions}
                onChange={(e) => setFormData({ ...formData, generate_ai_questions: e.target.checked })}
                className="w-5 h-5 text-arena-primary"
              />
              <span>Generate questions using AI</span>
            </label>

            {formData.generate_ai_questions && (
              <div>
                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.question_count}
                  onChange={(e) => setFormData({ ...formData, question_count: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary"
                />
                <p className="text-sm text-gray-400 mt-2">
                  AI will generate {formData.question_count} unique {formData.difficulty} level coding challenges
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

