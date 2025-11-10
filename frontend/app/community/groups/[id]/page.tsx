'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function GroupPage() {
  const params = useParams()
  const groupId = params.id as string
  const [isMember, setIsMember] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)

  const group = groups.find(g => g.id === groupId) || groups[0]

  const handleJoinGroup = () => {
    setIsMember(!isMember)
    alert(isMember ? '❌ Left the group' : '✅ Joined the group!')
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
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-5xl">
              {group.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
              <p className="text-gray-400 mb-4">{group.members} members • {group.privacy}</p>
              <div className="flex gap-3">
                <button 
                  onClick={handleJoinGroup}
                  className={`px-6 py-2 font-semibold rounded-lg transition-all ${
                    isMember 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isMember ? '✓ Member' : '+ Join Group'}
                </button>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all"
                >
                  ✍️ Create Post
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
                <p className="text-gray-300">
                  {group.description || 'A community for developers passionate about modern web development, sharing knowledge, code, and best practices.'}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
              <div className="space-y-4">
                {groupPosts.map((post, idx) => (
                  <div key={idx} className="p-6 bg-dark-card rounded-xl border border-gray-800">
                    <div className="flex items-start gap-4">
                      <Link href={`/community/user/${post.author.toLowerCase().replace(' ', '-')}`}>
                        <div className="w-12 h-12 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-xl font-bold cursor-pointer hover:scale-110 transition-transform">
                          {post.author.charAt(0)}
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{post.author}</h3>
                          <span className="text-sm text-gray-400">{post.time}</span>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
                        <p className="text-gray-400 mb-3">{post.content}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <button className="hover:text-arena-primary transition-colors">
                            💬 {post.comments} comments
                          </button>
                          <button className="hover:text-arena-primary transition-colors">
                            👍 {post.likes} likes
                          </button>
                          <button className="hover:text-gray-300 transition-colors">
                            🔗 Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Group Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Members</span>
                  <span className="font-bold">{group.members}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Posts</span>
                  <span className="font-bold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Today</span>
                  <span className="font-bold text-green-400">156</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Admins</h3>
              <div className="space-y-3">
                {groupAdmins.map((admin) => (
                  <Link 
                    key={admin.name} 
                    href={`/community/user/${admin.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-lg font-bold">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{admin.name}</div>
                        <div className="text-xs text-gray-400">{admin.role}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Active Members</h3>
              <div className="space-y-3">
                {activeMembers.map((member) => (
                  <Link 
                    key={member.name} 
                    href={`/community/user/${member.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.posts} posts</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6">✍️ Create Post in {group.name}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  rows={8}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Share with the group..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('✅ Post created in group!')
                    setShowCreatePost(false)
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const groups = [
  { 
    id: '1', 
    name: 'React Developers', 
    icon: '⚛️', 
    members: 1243,
    privacy: 'Public',
    description: 'A community for React developers to share knowledge, discuss best practices, and help each other build amazing applications.'
  },
  { 
    id: '2', 
    name: 'TypeScript Ninjas', 
    icon: '💻', 
    members: 856,
    privacy: 'Public',
    description: 'Master TypeScript with fellow developers. Share tips, tricks, and advanced patterns.'
  },
  { 
    id: '3', 
    name: 'Node.js Masters', 
    icon: '🚀', 
    members: 2105,
    privacy: 'Public',
    description: 'Everything about Node.js - from basics to advanced architecture patterns.'
  },
  { 
    id: '4', 
    name: 'DevOps Engineers', 
    icon: '🔧', 
    members: 543,
    privacy: 'Public',
    description: 'CI/CD, Docker, Kubernetes, and all things DevOps.'
  },
]

const groupPosts = [
  {
    author: 'Emma Wilson',
    time: '2 hours ago',
    title: 'New React 18 features you should know',
    content: 'Just explored the new concurrent features in React 18. The automatic batching is a game changer! Here\'s what I learned...',
    comments: 15,
    likes: 34
  },
  {
    author: 'David Kim',
    time: '5 hours ago',
    title: 'How to optimize React re-renders',
    content: 'Been working on performance optimization lately. Here are some practical tips that helped me reduce unnecessary re-renders...',
    comments: 23,
    likes: 56
  }
]

const groupAdmins = [
  { name: 'Alex Chen', role: 'Owner' },
  { name: 'Sarah Johnson', role: 'Moderator' }
]

const activeMembers = [
  { name: 'Emma Wilson', posts: 45 },
  { name: 'David Kim', posts: 38 },
  { name: 'Mike Rodriguez', posts: 32 }
]

