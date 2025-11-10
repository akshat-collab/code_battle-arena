'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  hard: 'bg-red-500/20 text-red-400',
}

interface Room {
  id: string
  name: string
  creator_name: string
  participant_count: number
  max_participants: number
  difficulty: string
  status: string
}

export default function ChallengesPage() {
  const [filter, setFilter] = useState('all')
  const [showRooms, setShowRooms] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [showCreateRoom, setShowCreateRoom] = useState(false)

  useEffect(() => {
    if (showRooms) {
      fetchRooms()
    }
  }, [showRooms])

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rooms')
      const data = await res.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    }
  }
  
  const handleCreateRoom = async (formData: any) => {
    try {
      const res = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          creator_id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        })
      })
      if (res.ok) {
        setShowCreateRoom(false)
        fetchRooms()
      }
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Actions Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-arena-primary/20 to-purple-500/20 rounded-xl border border-arena-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">⚔️ Ready to Compete?</h2>
            <p className="text-gray-300">
              Join competition rooms and battle other developers in real-time!
            </p>
          </div>
          <button
            onClick={() => setShowRooms(!showRooms)}
            className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all whitespace-nowrap"
          >
            {showRooms ? 'View Challenges' : 'View Competition Rooms'} →
          </button>
        </div>
      </div>

      {/* Competition Rooms Section */}
      {showRooms && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">🏆 Competition Rooms</h2>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
            >
              + Create Room
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-12 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-2">No Active Rooms</h3>
              <p className="text-gray-400 mb-4">Be the first to create a competition room!</p>
              <button
                onClick={() => setShowCreateRoom(true)}
                className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg"
              >
                Create Room
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {rooms.map((room) => (
                <div key={room.id} className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      room.status === 'waiting' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {room.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[room.difficulty as keyof typeof difficultyColors]}`}>
                      {room.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Creator:</span>
                      <span className="text-white">{room.creator_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Participants:</span>
                      <span className="text-white">{room.participant_count}/{room.max_participants}</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg">
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={() => setShowRooms(false)}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            ← Back to Challenges
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Coding Challenges</h1>
        <p className="text-gray-400 mb-6">
          Test your skills with problems ranging from beginner to expert level
        </p>
        
        <div className="flex gap-4 mb-8">
          {['all', 'easy', 'medium', 'hard'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilter(diff)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === diff
                  ? 'bg-arena-primary text-white'
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges
          .filter(challenge => filter === 'all' || challenge.difficulty === filter)
          .map((challenge, idx) => (
            <Link key={challenge.id} href={`/arena/challenges/${challenge.id}`}>
              <div
                className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all cursor-pointer h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[challenge.difficulty]}`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-400">{challenge.points} pts</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                <p className="text-gray-400 mb-4 flex-grow">{challenge.description}</p>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-arena-primary/20 text-arena-primary rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full mx-4">
            <h2 className="text-3xl font-bold mb-6">🏆 Create Competition Room</h2>
            <CreateRoomForm 
              onSubmit={handleCreateRoom}
              onCancel={() => setShowCreateRoom(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function CreateRoomForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'medium',
    max_participants: 10,
    time_limit: 60,
    generate_ai: false,
    question_count: 3
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Room Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
          placeholder="e.g., Friday Code Battle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
          rows={3}
          placeholder="What's this competition about?"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
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
            className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
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
          className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
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
              className="w-full px-4 py-2 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg"
        >
          Create Room
        </button>
      </div>
    </form>
  )
}

const challenges = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers, find two numbers that add up to a specific target.',
    difficulty: 'easy' as const,
    points: 10,
    tags: ['arrays', 'hash-table'],
  },
  {
    id: '2',
    title: 'Longest Palindromic Substring',
    description: 'Find the longest palindromic substring in a given string.',
    difficulty: 'medium' as const,
    points: 20,
    tags: ['strings', 'dynamic-programming'],
  },
  {
    id: '3',
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists and return it as one sorted list.',
    difficulty: 'hard' as const,
    points: 30,
    tags: ['linked-list', 'heap', 'divide-and-conquer'],
  },
  {
    id: '4',
    title: 'Reverse Linked List',
    description: 'Reverse a singly linked list iteratively or recursively.',
    difficulty: 'easy' as const,
    points: 10,
    tags: ['linked-list'],
  },
  {
    id: '5',
    title: '3Sum',
    description: 'Find all unique triplets that sum to zero.',
    difficulty: 'medium' as const,
    points: 20,
    tags: ['arrays', 'two-pointers'],
  },
  {
    id: '6',
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap.',
    difficulty: 'hard' as const,
    points: 30,
    tags: ['arrays', 'two-pointers', 'stack'],
  },
]

