'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-purple-900/20 to-dark-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-arena-primary to-arena-secondary bg-clip-text text-transparent">
            CodeBattle Arena
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Competitive coding meets learning meets automation. 
            Challenge your skills, build workflows, and dominate the arena.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/arena-react">
              <button className="px-8 py-4 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-arena-primary/50 transition-all hover:scale-105 active:scale-95">
                Enter Arena
              </button>
            </Link>
            <Link href="/learn">
              <button className="px-8 py-4 bg-dark-card border border-gray-700 rounded-lg font-semibold text-white hover:border-arena-primary transition-all hover:scale-105 active:scale-95">
                Start Learning
              </button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <Link key={feature.title} href={feature.link}>
              <div className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all cursor-pointer hover:scale-105 transform">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

const features = [
  {
    icon: '⚔️',
    title: 'Competitive Arena',
    description: 'Battle other developers in real-time coding challenges and tournaments',
    link: '/arena-react'
  },
  {
    icon: '📚',
    title: 'Learn & Grow',
    description: 'Follow structured learning paths and master new technologies',
    link: '/learn'
  },
  {
    icon: '🤖',
    title: 'Automation Builder',
    description: 'Create powerful workflows with visual automation tools',
    link: '/automate'
  },
  {
    icon: '👥',
    title: 'Community',
    description: 'Collaborate, share, and learn from a vibrant developer community',
    link: '/community'
  }
]

