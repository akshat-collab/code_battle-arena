import Link from 'next/link'

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="border-b border-dark-border bg-dark-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-arena-primary to-arena-secondary bg-clip-text text-transparent">
              CodeBattle Arena
            </Link>
            <div className="flex gap-6">
              <Link href="/arena/challenges" className="text-gray-400 hover:text-white transition-colors">
                Challenges
              </Link>
              <Link href="/arena/competitions" className="text-gray-400 hover:text-white transition-colors">
                Competitions
              </Link>
              <Link href="/arena/tournaments" className="text-gray-400 hover:text-white transition-colors">
                Tournaments
              </Link>
              <Link href="/arena/leaderboard" className="text-gray-400 hover:text-white transition-colors">
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

