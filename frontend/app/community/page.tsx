'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CommunityPage() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [postAnonymous, setPostAnonymous] = useState(false)
  const [postContent, setPostContent] = useState({
    title: '',
    content: '',
    category: 'General'
  })

  const handleCreatePost = () => {
    console.log('Creating post:', { ...postContent, anonymous: postAnonymous })
    alert('✅ Post created successfully!')
    setShowCreatePost(false)
    setPostContent({ title: '', content: '', category: 'General' })
    setPostAnonymous(false)
  }

  const handleSharePost = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/community/${postId}`)
    alert('🔗 Link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Developer Community</h1>
              <p className="text-gray-400 max-w-2xl">
                Connect, collaborate, and learn from fellow developers
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCreatePost(true)}
                className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all"
              >
                ✍️ Create Post
              </button>
              <button 
                onClick={() => setShowCreateGroup(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                👥 Create Group
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Discussions</h2>
            {discussions.map((discussion, idx) => (
              <div
                key={discussion.id}
                className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all"
              >
                <div className="flex items-start gap-4">
                  <Link href={`/community/user/${discussion.author.toLowerCase().replace(' ', '-')}`}>
                    <div className="w-12 h-12 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer hover:scale-110 transition-transform">
                      {discussion.author.charAt(0)}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Link href={`/community/user/${discussion.author.toLowerCase().replace(' ', '-')}`}>
                          <h3 className="font-semibold hover:text-arena-primary cursor-pointer">
                            {discussion.author}
                          </h3>
                        </Link>
                        <span className="text-sm text-gray-400">{discussion.time}</span>
                        <span className="px-2 py-1 bg-arena-primary/20 text-arena-primary rounded text-xs">
                          {discussion.category}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleSharePost(discussion.id)}
                        className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        🔗 Share
                      </button>
                    </div>
                    <Link href={`/community/${discussion.id}`}>
                      <h4 className="text-xl font-semibold mb-2 hover:text-arena-primary transition-colors">
                        {discussion.title}
                      </h4>
                    </Link>
                    <p className="text-gray-400 mb-4">{discussion.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <button className="hover:text-arena-primary transition-colors">
                        💬 {discussion.replies} replies
                      </button>
                      <button className="hover:text-arena-primary transition-colors">
                        👍 {discussion.likes} likes
                      </button>
                      <span>👁️ {discussion.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">👥 Your Friends</h3>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.name} className="flex items-center justify-between">
                    <Link href={`/community/user/${friend.name.toLowerCase().replace(' ', '-')}`}>
                      <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{friend.name}</div>
                          <div className="text-xs text-gray-400">{friend.status}</div>
                        </div>
                      </div>
                    </Link>
                    <button className="text-xs bg-arena-primary/20 text-arena-primary px-2 py-1 rounded hover:bg-arena-primary/30">
                      Message
                    </button>
                  </div>
                ))}
              </div>
              <Link href="/community/friends">
                <button className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                  View All Friends
                </button>
              </Link>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">🔥 Your Groups</h3>
              <div className="space-y-3">
                {groups.map((group) => (
                  <Link key={group.name} href={`/community/groups/${group.id}`}>
                    <div className="p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{group.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{group.name}</div>
                          <div className="text-xs text-gray-400">{group.members} members</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <button 
                onClick={() => setShowCreateGroup(true)}
                className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
              >
                + Create Group
              </button>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">🏷️ Popular Topics</h3>
              <div className="space-y-2">
                {topics.map(topic => (
                  <Link
                    key={topic}
                    href={`/community/topic/${topic.toLowerCase()}`}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    #{topic}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">🏆 Top Contributors</h3>
              <div className="space-y-4">
                {contributors.map((contributor, idx) => (
                  <div key={contributor.name} className="flex items-center gap-3">
                    <div className="text-2xl font-bold">#{idx + 1}</div>
                    <Link href={`/community/user/${contributor.name.toLowerCase().replace(' ', '-')}`}>
                      <div className="w-10 h-10 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-lg font-bold cursor-pointer hover:scale-110 transition-transform">
                        {contributor.name.charAt(0)}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/community/user/${contributor.name.toLowerCase().replace(' ', '-')}`}>
                        <div className="font-semibold hover:text-arena-primary cursor-pointer">
                          {contributor.name}
                        </div>
                      </Link>
                      <div className="text-sm text-gray-400">{contributor.points} points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">✍️ Create New Post</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={postContent.title}
                  onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={postContent.category}
                  onChange={(e) => setPostContent({ ...postContent, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                >
                  <option value="General">General</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Career">Career</option>
                  <option value="Help">Help</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  value={postContent.content}
                  onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                  placeholder="Share your thoughts, questions, or insights..."
                />
              </div>

              <div className="border-t border-gray-800 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postAnonymous}
                    onChange={(e) => setPostAnonymous(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <div>
                    <span className="font-semibold">🕶️ Post Anonymously</span>
                    <p className="text-sm text-gray-400">Your identity will be hidden</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6">👥 Create New Group</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Group Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="e.g., React Developers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="What is this group about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Group Icon</label>
                <div className="grid grid-cols-8 gap-3">
                  {['💻', '🚀', '🎨', '📱', '🔧', '⚡', '🎯', '🔥', '💡', '🌟', '🎮', '📚', '🎭', '🎪', '🎨', '🎵'].map((icon) => (
                    <button
                      key={icon}
                      className="text-3xl p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Privacy</label>
                <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white">
                  <option value="public">Public - Anyone can join</option>
                  <option value="private">Private - Invitation only</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('✅ Group created successfully!')
                    setShowCreateGroup(false)
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const discussions = [
  {
    id: '1',
    title: 'Best practices for WebSocket connections in production',
    excerpt: 'What are your experiences with scaling WebSocket connections? I\'m working on a real-time collaboration feature...',
    author: 'Alex Chen',
    time: '2 hours ago',
    category: 'Backend',
    replies: 23,
    likes: 45,
    views: 234,
  },
  {
    id: '2',
    title: 'TypeScript vs JavaScript: When to use each?',
    excerpt: 'I\'m starting a new project and wondering if I should use TypeScript or stick with plain JavaScript...',
    author: 'Sarah Johnson',
    time: '5 hours ago',
    category: 'General',
    replies: 18,
    likes: 32,
    views: 156,
  },
  {
    id: '3',
    title: 'Docker container orchestration strategies',
    excerpt: 'Looking for advice on managing multiple containers in a microservices architecture...',
    author: 'Mike Rodriguez',
    time: '1 day ago',
    category: 'DevOps',
    replies: 31,
    likes: 67,
    views: 445,
  },
]

const topics = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'System Design',
  'Algorithms',
  'Docker',
  'Kubernetes',
]

const contributors = [
  { name: 'Alex Chen', points: 2340 },
  { name: 'Sarah Johnson', points: 1876 },
  { name: 'Mike Rodriguez', points: 1654 },
]

const friends = [
  { name: 'Emma Wilson', status: 'Online' },
  { name: 'David Kim', status: 'Away' },
  { name: 'Sophia Martinez', status: 'Online' },
  { name: 'Tom Harris', status: 'Offline' },
]

const groups = [
  { id: '1', name: 'React Developers', icon: '⚛️', members: 1243 },
  { id: '2', name: 'TypeScript Ninjas', icon: '💻', members: 856 },
  { id: '3', name: 'Node.js Masters', icon: '🚀', members: 2105 },
  { id: '4', name: 'DevOps Engineers', icon: '🔧', members: 543 },
]

