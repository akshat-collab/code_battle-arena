'use client'

import Link from 'next/link'

export default function ArenaPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">⚔️ Welcome to the Arena</h1>
        <p className="text-xl text-gray-400 mb-8">
          Choose your path to glory
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/arena/challenges">
          <div className="p-8 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all cursor-pointer hover:scale-105">
            <div className="text-6xl mb-4 text-center">🎯</div>
            <h2 className="text-2xl font-bold mb-2 text-center">Challenges</h2>
            <p className="text-gray-400 text-center">
              Solve coding problems and improve your skills
            </p>
          </div>
        </Link>

        <Link href="/arena/competitions">
          <div className="p-8 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all cursor-pointer hover:scale-105">
            <div className="text-6xl mb-4 text-center">🏆</div>
            <h2 className="text-2xl font-bold mb-2 text-center">Competitions</h2>
            <p className="text-gray-400 text-center">
              Compete against other developers in real-time
            </p>
          </div>
        </Link>

        <Link href="/arena/tournaments">
          <div className="p-8 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all cursor-pointer hover:scale-105">
            <div className="text-6xl mb-4 text-center">👑</div>
            <h2 className="text-2xl font-bold mb-2 text-center">Tournaments</h2>
            <p className="text-gray-400 text-center">
              Join multi-round elimination tournaments
            </p>
          </div>
        </Link>

        <Link href="/arena/leaderboard">
          <div className="p-8 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all cursor-pointer hover:scale-105">
            <div className="text-6xl mb-4 text-center">📊</div>
            <h2 className="text-2xl font-bold mb-2 text-center">Leaderboard</h2>
            <p className="text-gray-400 text-center">
              See where you rank among the best
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

