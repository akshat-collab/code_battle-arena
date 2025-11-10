'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'

export default function ProfilePage() {
  const router = useRouter()
  const { isSignedIn, user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    skills: [] as string[]
  })
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
    
    // Load additional profile data from localStorage
    if (isLoaded && isSignedIn && user) {
      const savedProfile = localStorage.getItem(`profile_${user.id}`)
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile)
        setFormData(profileData)
      }
    }
  }, [isLoaded, isSignedIn, user, router])

  const handleSave = () => {
    if (user) {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(formData))
      setIsEditing(false)
      alert('✅ Profile updated successfully!')
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
  }

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-arena-primary mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/community" 
              className="text-arena-primary hover:underline"
            >
              ← Back to Community
            </Link>
            <SignOutButton>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all">
                Logout
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-8 mb-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-5xl font-bold overflow-hidden">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.fullName || ''} className="w-full h-full object-cover" />
                ) : (
                  user.firstName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.fullName || user.firstName}</h1>
                <p className="text-gray-400 mb-4">{user.primaryEmailAddress?.emailAddress}</p>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-6 border-t border-gray-800 pt-6">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400">
                    ℹ️ Name and email are managed by Clerk. Update them in your account settings.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Username</label>
                    <input
                      type="text"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter Username</label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                      placeholder="Add a skill..."
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-arena-primary/20 text-arena-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 border-t border-gray-800 pt-6">
                {formData.bio && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Bio</h3>
                    <p className="text-gray-300">{formData.bio}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {formData.location && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">📍 Location</h3>
                      <p className="text-gray-300">{formData.location}</p>
                    </div>
                  )}
                  {formData.website && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">🌐 Website</h3>
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-arena-primary hover:underline">
                        {formData.website}
                      </a>
                    </div>
                  )}
                  {formData.github && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">💻 GitHub</h3>
                      <a href={`https://github.com/${formData.github}`} target="_blank" rel="noopener noreferrer" className="text-arena-primary hover:underline">
                        @{formData.github}
                      </a>
                    </div>
                  )}
                  {formData.twitter && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">🐦 Twitter</h3>
                      <a href={`https://twitter.com/${formData.twitter}`} target="_blank" rel="noopener noreferrer" className="text-arena-primary hover:underline">
                        @{formData.twitter}
                      </a>
                    </div>
                  )}
                </div>

                {formData.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">🎯 Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-arena-primary/20 text-arena-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Stats</h3>
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
              </div>
            </div>

            <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">🏆 Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {['🏆', '⭐', '🔥', '💎', '🎯', '🚀'].map((badge, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-800 rounded-lg">
                    <div className="text-3xl">{badge}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">⚙️ Settings</h3>
              <div className="space-y-2">
                <Link href="/profile" className="block py-2 hover:text-arena-primary transition-colors">
                  Edit Profile
                </Link>
                <Link href="/settings/privacy" className="block py-2 hover:text-arena-primary transition-colors">
                  Privacy
                </Link>
                <Link href="/settings/notifications" className="block py-2 hover:text-arena-primary transition-colors">
                  Notifications
                </Link>
                <SignOutButton>
                  <button className="w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

