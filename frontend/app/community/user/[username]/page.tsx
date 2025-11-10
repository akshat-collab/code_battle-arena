'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [isFriend, setIsFriend] = useState(false)

  const displayName = username.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  const handleAddFriend = () => {
    setIsFriend(!isFriend)
    alert(isFriend ? '❌ Friend removed' : '✅ Friend request sent!')
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/community" 
            className="text-arena-primary hover:underline mb-4 inline-block"
          >
            ← Back to Community
          </Link>
          
          <div className="flex items-start gap-6 mt-4">
            <div className="w-24 h-24 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-5xl font-bold">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{displayName}</h1>
              <p className="text-gray-400 mb-4">@{username}</p>
              <div className="flex gap-3">
                <button 
                  onClick={handleAddFriend}
                  className={`px-6 py-2 font-semibold rounded-lg transition-all ${
                    isFriend 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-arena-primary hover:bg-arena-primary/80 text-white'
                  }`}
                >
                  {isFriend ? '✓ Friends' : '+ Add Friend'}
                </button>
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all">
                  💬 Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
                <p className="text-gray-300 mb-4">
                  Full-stack developer passionate about building scalable web applications. 
                  Love working with React, Node.js, and TypeScript.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Joined</span>
                    <p className="font-semibold">January 2024</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Location</span>
                    <p className="font-semibold">San Francisco, CA</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Skills</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['React', 'Node.js', 'TypeScript', 'Python'].map(skill => (
                        <span key={skill} className="px-2 py-1 bg-arena-primary/20 text-arena-primary rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {userPosts.map((post, idx) => (
                  <div key={idx} className="p-6 bg-dark-card rounded-xl border border-gray-800">
                    <Link href={`/community/${post.id}`}>
                      <h3 className="text-xl font-semibold mb-2 hover:text-arena-primary cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-400 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>💬 {post.replies} replies</span>
                      <span>👍 {post.likes} likes</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Posts</span>
                  <span className="font-bold">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reputation</span>
                  <span className="font-bold text-arena-primary">2,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Friends</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Groups</span>
                  <span className="font-bold">12</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {['🏆', '⭐', '🔥', '💎', '🎯', '🚀'].map((badge, idx) => (
                  <div key={idx} className="text-center p-3 bg-gray-800 rounded-lg">
                    <div className="text-3xl mb-1">{badge}</div>
                    <div className="text-xs text-gray-400">Level {idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Groups</h3>
              <div className="space-y-3">
                {userGroups.map((group) => (
                  <Link key={group.id} href={`/community/groups/${group.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="text-2xl">{group.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{group.name}</div>
                        <div className="text-xs text-gray-400">{group.members} members</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const userPosts = [
  {
    id: '1',
    title: 'Best practices for WebSocket connections in production',
    excerpt: 'What are your experiences with scaling WebSocket connections? I\'m working on a real-time collaboration feature...',
    replies: 23,
    likes: 45,
    time: '2 hours ago'
  },
  {
    id: '5',
    title: 'Building scalable microservices with Node.js',
    excerpt: 'Sharing my experience building a microservices architecture...',
    replies: 18,
    likes: 32,
    time: '1 day ago'
  }
]

const userGroups = [
  { id: '1', name: 'React Developers', icon: '⚛️', members: 1243 },
  { id: '2', name: 'TypeScript Ninjas', icon: '💻', members: 856 },
  { id: '3', name: 'Node.js Masters', icon: '🚀', members: 2105 }
]

