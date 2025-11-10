'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('@/components/code-editor/CodeEditor'), { ssr: false })

interface Participant {
  user_id: string
  username: string
  score: number
  problems_solved: number
  is_ready: boolean
}

interface Room {
  id: string
  name: string
  description: string
  creator_id: string
  creator_name: string
  status: string
  difficulty: string
  time_limit: number
  started_at?: string
}

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: string
  points: number
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [room, setRoom] = useState<Room | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const currentUserId = 'demo-user-id' // TODO: Get from auth

  useEffect(() => {
    fetchRoomData()
  }, [roomId])

  useEffect(() => {
    if (room?.status === 'ongoing' && room.started_at) {
      const interval = setInterval(() => {
        const startTime = new Date(room.started_at!).getTime()
        const elapsed = (Date.now() - startTime) / 1000
        const remaining = Math.max(0, room.time_limit - elapsed)
        setTimeRemaining(remaining)

        if (remaining === 0) {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [room])

  const fetchRoomData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`)
      const data = await res.json()
      setRoom(data.room)
      setParticipants(data.participants || [])

      // Fetch challenges for the room
      const challengesRes = await fetch('http://localhost:5000/api/challenges?limit=5')
      const challengesData = await challengesRes.json()
      setChallenges(challengesData.challenges || [])
      
      if (challengesData.challenges?.length > 0) {
        setSelectedChallenge(challengesData.challenges[0])
      }
    } catch (error) {
      console.error('Failed to fetch room:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartCompetition = async () => {
    try {
      await fetch(`http://localhost:5000/api/rooms/${roomId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creator_id: currentUserId })
      })
      fetchRoomData()
    } catch (error) {
      console.error('Failed to start competition:', error)
    }
  }

  const handleSubmit = async () => {
    if (!selectedChallenge) return

    setSubmitting(true)
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          challenge_id: selectedChallenge.id,
          code,
          language
        })
      })

      const data = await res.json()
      alert(`Submission ${data.submission.status}! Score: ${data.points}`)
      fetchRoomData()
    } catch (error) {
      console.error('Failed to submit:', error)
      alert('Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-arena-primary"></div>
          <p className="mt-4 text-gray-400">Loading room...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Room not found</h2>
        <button
          onClick={() => router.push('/arena/rooms')}
          className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg"
        >
          Back to Rooms
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-gray-800 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <p className="text-gray-400 text-sm">{room.description}</p>
          </div>

          <div className="flex items-center gap-4">
            {room.status === 'ongoing' && (
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-arena-primary">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-400">Time Remaining</div>
              </div>
            )}

            <div className="text-center">
              <div className="text-xl font-bold">{participants.length}</div>
              <div className="text-xs text-gray-400">Participants</div>
            </div>

            {room.status === 'waiting' && room.creator_id === currentUserId && (
              <button
                onClick={handleStartCompetition}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
              >
                Start Competition
              </button>
            )}

            <button
              onClick={() => router.push('/arena/rooms')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-9">
            {room.status === 'waiting' ? (
              <div className="bg-dark-card rounded-xl border border-gray-800 p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Waiting for Competition to Start</h2>
                <p className="text-gray-400 mb-6">
                  The room creator will start the competition soon. Get ready!
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="animate-pulse w-3 h-3 bg-arena-primary rounded-full"></div>
                  <div className="animate-pulse w-3 h-3 bg-arena-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
                  <div className="animate-pulse w-3 h-3 bg-arena-primary rounded-full" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : (
              <>
                {/* Challenge Selector */}
                <div className="bg-dark-card rounded-xl border border-gray-800 p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Challenges</h3>
                  <div className="flex gap-2 overflow-x-auto">
                    {challenges.map((challenge) => (
                      <button
                        key={challenge.id}
                        onClick={() => setSelectedChallenge(challenge)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                          selectedChallenge?.id === challenge.id
                            ? 'bg-arena-primary text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {challenge.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Challenge Description */}
                {selectedChallenge && (
                  <div className="bg-dark-card rounded-xl border border-gray-800 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">{selectedChallenge.title}</h2>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                        {selectedChallenge.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedChallenge.description}</p>
                    </div>
                  </div>
                )}

                {/* Code Editor */}
                <div className="bg-dark-card rounded-xl border border-gray-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="px-3 py-1 bg-dark-bg border border-gray-700 rounded text-sm"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !selectedChallenge}
                      className="px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Solution'}
                    </button>
                  </div>

                  <div className="h-[500px]">
                    <CodeEditor
                      initialCode={code || `# Write your solution here\n\ndef solution():\n    pass`}
                      language={language}
                      onChange={(value) => setCode(value || '')}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Leaderboard Sidebar */}
          <div className="col-span-3">
            <div className="bg-dark-card rounded-xl border border-gray-800 p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🏆</span>
                <span>Leaderboard</span>
              </h3>

              <div className="space-y-3">
                {participants
                  .sort((a, b) => b.score - a.score || b.problems_solved - a.problems_solved)
                  .map((participant, index) => (
                    <div
                      key={participant.user_id}
                      className={`p-3 rounded-lg ${
                        index === 0
                          ? 'bg-yellow-500/20 border border-yellow-500/50'
                          : index === 1
                          ? 'bg-gray-500/20 border border-gray-500/50'
                          : index === 2
                          ? 'bg-orange-500/20 border border-orange-500/50'
                          : 'bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-500">
                            #{index + 1}
                          </span>
                          <span className="font-semibold">{participant.username}</span>
                        </div>
                        {participant.is_ready && room.status === 'waiting' && (
                          <span className="text-xs text-green-400">✓ Ready</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Score:</span>
                        <span className="font-mono font-bold text-arena-primary">
                          {participant.score}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Solved:</span>
                        <span className="font-mono">{participant.problems_solved}</span>
                      </div>
                    </div>
                  ))}
              </div>

              {participants.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  No participants yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

