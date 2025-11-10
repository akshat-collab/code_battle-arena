'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'requests' | 'search'>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteLink, setInviteLink] = useState('')

  const filteredFriends = allFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeTab === 'all' || 
     (activeTab === 'online' && friend.status === 'Online') ||
     (activeTab === 'requests'))
  )

  const searchResults = activeTab === 'search' 
    ? suggestedFriends.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const generateInviteLink = () => {
    const userId = 'user-' + Math.random().toString(36).substr(2, 9)
    const link = `${window.location.origin}/community/invite/${userId}`
    setInviteLink(link)
    setShowInviteModal(true)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    alert('✅ Invite link copied! Share it via WhatsApp, email, or any messaging app!')
  }

  const sendFriendRequest = (userName: string) => {
    alert(`✅ Friend request sent to ${userName}!`)
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Friends</h1>
              <p className="text-gray-400">
                Connect and collaborate with your developer friends
              </p>
            </div>
            <button
              onClick={generateInviteLink}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <span>📤</span>
              Share Invite Link
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'search' ? "Search people by name or email..." : "Search friends..."}
              className="w-full px-4 py-3 bg-dark-card border border-gray-800 rounded-lg focus:outline-none focus:border-arena-primary text-white"
            />
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'all' 
                  ? 'bg-arena-primary text-white' 
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              All Friends ({allFriends.length})
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'online' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              Online ({allFriends.filter(f => f.status === 'Online').length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'requests' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              Requests (3)
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'search' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              🔍 Find Friends
            </button>
          </div>

          {activeTab === 'requests' && (
            <div className="mb-8 space-y-4">
              <h2 className="text-xl font-bold">Friend Requests</h2>
              {friendRequests.map((request) => (
                <div key={request.name} className="p-6 bg-dark-card rounded-xl border border-gray-800">
                  <div className="flex items-center justify-between">
                    <Link href={`/community/user/${request.name.toLowerCase().replace(' ', '-')}`}>
                      <div className="flex items-center gap-4 cursor-pointer">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                          {request.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg hover:text-arena-primary">
                            {request.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{request.mutualFriends} mutual friends</p>
                        </div>
                      </div>
                    </Link>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg">
                        Accept
                      </button>
                      <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div key={friend.name} className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all">
                <div className="flex items-center justify-between">
                  <Link href={`/community/user/${friend.name.toLowerCase().replace(' ', '-')}`}>
                    <div className="flex items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-2xl font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        {friend.status === 'Online' && (
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-dark-card rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg hover:text-arena-primary">
                          {friend.name}
                        </h3>
                        <p className={`text-sm ${
                          friend.status === 'Online' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {friend.status}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg">
                      💬 Message
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                      ⋮
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeTab === 'search' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">🔍 Find New Friends</h2>
              {searchResults.map((user) => (
                <div key={user.email} className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.mutualFriends} mutual friends • {user.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.name)}
                      className="px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg"
                    >
                      + Add Friend
                    </button>
                  </div>
                </div>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl mb-2">No users found</p>
                  <p>Try a different search term</p>
                </div>
              )}
            </div>
          )}

          {filteredFriends.length === 0 && activeTab !== 'search' && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-2">No friends found</p>
              <p>Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Invite Link Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6">📤 Share Your Invite Link</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Personal Invite Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400 mb-3">
                  💡 Share this link with friends to invite them to CodeBattle Arena!
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={`https://wa.me/?text=Join me on CodeBattle Arena! ${encodeURIComponent(inviteLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
                  >
                    📱 WhatsApp
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=Join me on CodeBattle Arena!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                  >
                    ✈️ Telegram
                  </a>
                  <a
                    href={`mailto:?subject=Join CodeBattle Arena&body=Join me on CodeBattle Arena: ${inviteLink}`}
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
    </div>
  )
}

const allFriends = [
  { name: 'Emma Wilson', status: 'Online' },
  { name: 'David Kim', status: 'Away' },
  { name: 'Sophia Martinez', status: 'Online' },
  { name: 'Tom Harris', status: 'Offline' },
  { name: 'Alex Chen', status: 'Online' },
  { name: 'Sarah Johnson', status: 'Offline' },
  { name: 'Mike Rodriguez', status: 'Online' },
  { name: 'Lisa Brown', status: 'Away' },
]

const friendRequests = [
  { name: 'John Doe', mutualFriends: 5 },
  { name: 'Jane Smith', mutualFriends: 12 },
  { name: 'Bob Wilson', mutualFriends: 3 },
]

const suggestedFriends = [
  { name: 'Alice Johnson', email: 'alice@example.com', mutualFriends: 8, location: 'San Francisco, CA' },
  { name: 'Carlos Garcia', email: 'carlos@example.com', mutualFriends: 5, location: 'Austin, TX' },
  { name: 'Priya Patel', email: 'priya@example.com', mutualFriends: 12, location: 'New York, NY' },
  { name: 'James Lee', email: 'james@example.com', mutualFriends: 3, location: 'Seattle, WA' },
  { name: 'Maria Santos', email: 'maria@example.com', mutualFriends: 7, location: 'Miami, FL' },
]

