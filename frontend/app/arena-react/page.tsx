'use client'

import { useState, useEffect } from 'react'
import ArenaChatbot from '@/components/ArenaChatbot'

const API_URL = 'http://localhost:5000'

interface Room {
  id: string
  name: string
  description: string
  creator_name: string
  participant_count: number
  max_participants: number
  difficulty: 'easy' | 'medium' | 'hard'
  status: string
}

export default function ArenaReactPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'medium',
    max_participants: 10,
    time_limit: 60,
    generate_ai: false,
    question_count: 3
  })

  useEffect(() => {
    loadRooms()
    const interval = setInterval(loadRooms, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`)
      const data = await res.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error('Failed to load rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          time_limit: formData.time_limit * 60,
          creator_id: 'user-' + Math.random().toString(36).substr(2, 9)
        })
      })

      if (res.ok) {
        const data = await res.json()
        
        if (formData.generate_ai) {
          await generateAIQuestions(data.room.id)
        }
        
        alert('✅ Room created successfully!')
        setShowCreateModal(false)
        setFormData({
          name: '',
          description: '',
          difficulty: 'medium',
          max_participants: 10,
          time_limit: 60,
          generate_ai: false,
          question_count: 3
        })
        loadRooms()
      }
    } catch (error) {
      console.error('Error creating room:', error)
      alert('❌ Failed to create room')
    }
  }

  const generateAIQuestions = async (roomId: string) => {
    try {
      await fetch(`${API_URL}/api/ai-questions/generate-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: formData.difficulty,
          count: formData.question_count,
          topics: ['algorithms', 'data-structures']
        })
      })
    } catch (error) {
      console.error('Failed to generate AI questions:', error)
    }
  }

  const joinRoom = (roomId: string) => {
    window.location.href = `/arena-react/room/${roomId}`
  }

  const shareRoom = (room: Room) => {
    setSelectedRoom(room)
    setShowInviteModal(true)
  }

  const copyRoomLink = () => {
    if (!selectedRoom) return
    const roomLink = `${window.location.origin}/arena-react/room/${selectedRoom.id}`
    navigator.clipboard.writeText(roomLink)
    alert('✅ Room link copied! Share it with friends to invite them!')
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      hard: 'bg-red-500/20 text-red-400'
    }
    return colors[difficulty as keyof typeof colors] || colors.medium
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-dark-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              CodeBattle Arena
            </div>
            <div className="flex gap-6">
              <a href="#challenges" className="text-gray-400 hover:text-white transition-colors">Challenges</a>
              <a href="#rooms" className="text-gray-400 hover:text-white transition-colors">Rooms</a>
              <a href="#leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">⚔️ Competition Rooms</h2>
              <p className="text-gray-300">Create rooms, join battles, and compete with AI-generated challenges!</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
            >
              + Create Room
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading rooms...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && rooms.length === 0 && (
          <div className="text-center py-12 bg-dark-card rounded-xl border border-gray-800">
            <h3 className="text-2xl font-semibold mb-2">No Active Rooms</h3>
            <p className="text-gray-400 mb-6">Be the first to create a competition room!</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg"
            >
              Create First Room
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && rooms.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === 'waiting' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {room.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(room.difficulty)}`}>
                    {room.difficulty.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                {room.description && (
                  <p className="text-gray-400 text-sm mb-4">{room.description}</p>
                )}
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Creator:</span>
                    <span className="text-white">{room.creator_name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Participants:</span>
                    <span className="text-white">{room.participant_count || 0}/{room.max_participants}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => joinRoom(room.id)}
                    className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Join Room
                  </button>
                  <button 
                    onClick={() => shareRoom(room)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                    title="Share invite link"
                  >
                    📤
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Invite Modal */}
      {showInviteModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6">📤 Invite Friends to Join</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{selectedRoom.name}</h3>
                <p className="text-gray-400 text-sm">{selectedRoom.description}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-gray-400">Difficulty: <span className="text-white">{selectedRoom.difficulty}</span></span>
                  <span className="text-gray-400">Players: <span className="text-white">{selectedRoom.participant_count}/{selectedRoom.max_participants}</span></span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Share this room link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/arena-react/room/${selectedRoom.id}`}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />
                  <button
                    onClick={copyRoomLink}
                    className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400 mb-3">
                  💡 Share via messaging apps to invite friends to this coding battle!
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={`https://wa.me/?text=Join my coding battle: ${selectedRoom.name}! ${encodeURIComponent(`${window.location.origin}/arena-react/room/${selectedRoom.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
                  >
                    📱 WhatsApp
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/arena-react/room/${selectedRoom.id}`)}&text=Join my coding battle: ${selectedRoom.name}!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                  >
                    ✈️ Telegram
                  </a>
                  <a
                    href={`mailto:?subject=Join my coding battle&body=Join my coding battle: ${selectedRoom.name}! Link: ${window.location.origin}/arena-react/room/${selectedRoom.id}`}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold"
                  >
                    📧 Email
                  </a>
                </div>
              </div>

              <button
                onClick={() => setShowInviteModal(false)}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">🏆 Create Competition Room</h2>
            
            <form onSubmit={createRoom} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Room Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="e.g., Friday Code Battle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="What's this competition about?"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
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
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  min="10"
                  max="240"
                  value={formData.time_limit}
                  onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>

              <div className="border-t border-gray-800 pt-6">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={formData.generate_ai}
                    onChange={(e) => setFormData({ ...formData, generate_ai: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <span className="font-semibold">🤖 Generate AI Questions</span>
                    <p className="text-sm text-gray-400">Automatically create coding challenges using AI</p>
                  </div>
                </label>

                {formData.generate_ai && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Questions</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.question_count}
                      onChange={(e) => setFormData({ ...formData, question_count: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <ArenaChatbot />
    </div>
  )
}

