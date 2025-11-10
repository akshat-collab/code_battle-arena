'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton, useUser, SignInButton } from '@clerk/nextjs'

export default function Navigation() {
  const router = useRouter()
  const { isSignedIn, user, isLoaded } = useUser()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <nav className="border-b border-gray-800 bg-dark-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="text-2xl font-bold bg-gradient-to-r from-arena-primary to-arena-secondary bg-clip-text text-transparent cursor-pointer">
              CodeBattle Arena
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/arena-react" className="text-gray-400 hover:text-white transition-colors font-medium">
              Arena
            </Link>
            <Link href="/learn" className="text-gray-400 hover:text-white transition-colors font-medium">
              Learn
            </Link>
            <Link href="/automate" className="text-gray-400 hover:text-white transition-colors font-medium">
              Automate
            </Link>
            <Link href="/community" className="text-gray-400 hover:text-white transition-colors font-medium">
              Community
            </Link>

            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-lg font-bold overflow-hidden">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.fullName || ''} className="w-full h-full object-cover" />
                        ) : (
                          user.firstName?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <span className="font-medium">{user.firstName || 'User'}</span>
                    </button>

                    {showDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-dark-card border border-gray-800 rounded-lg shadow-xl py-2 z-20">
                          <div className="px-4 py-3 border-b border-gray-800">
                            <p className="font-semibold">{user.fullName || user.firstName}</p>
                            <p className="text-sm text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
                          </div>
                          <Link 
                            href="/profile"
                            onClick={() => setShowDropdown(false)}
                            className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                          >
                            👤 Your Profile
                          </Link>
                          <Link 
                            href="/community/friends"
                            onClick={() => setShowDropdown(false)}
                            className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                          >
                            👥 Friends
                          </Link>
                          <Link 
                            href="/settings"
                            onClick={() => setShowDropdown(false)}
                            className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                          >
                            ⚙️ Settings
                          </Link>
                          <div className="border-t border-gray-800 mt-2 pt-2 px-4 py-2">
                            <UserButton 
                              appearance={{
                                elements: {
                                  userButtonAvatarBox: "w-8 h-8",
                                  userButtonTrigger: "focus:shadow-none"
                                }
                              }}
                              afterSignOutUrl="/"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/sign-in">
                      <button className="px-6 py-2 text-gray-300 hover:text-white font-medium transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-all">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

