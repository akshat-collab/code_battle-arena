'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function TopicPage() {
  const params = useParams()
  const topic = params.topic as string
  const topicName = topic.charAt(0).toUpperCase() + topic.slice(1)

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
          <h1 className="text-4xl font-bold mb-4">#{topicName}</h1>
          <p className="text-gray-400 max-w-2xl">
            Discussions and resources about {topicName}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Discussions</h2>
            {topicDiscussions.map((discussion, idx) => (
              <div
                key={idx}
                className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-2xl font-bold">
                    {discussion.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{discussion.author}</h3>
                      <span className="text-sm text-gray-400">{discussion.time}</span>
                    </div>
                    <Link href={`/community/${discussion.id}`}>
                      <h4 className="text-xl font-semibold mb-2 hover:text-arena-primary transition-colors">
                        {discussion.title}
                      </h4>
                    </Link>
                    <p className="text-gray-400 mb-4">{discussion.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>💬 {discussion.replies} replies</span>
                      <span>👍 {discussion.likes} likes</span>
                      <span>👁️ {discussion.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center py-8 text-gray-400">
              <p className="mb-4">No more discussions to show</p>
              <button className="px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-colors">
                Start a New Discussion
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
              <div className="space-y-2">
                {relatedTopics.map(t => (
                  <Link
                    key={t}
                    href={`/community/topic/${t.toLowerCase()}`}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      t.toLowerCase() === topic 
                        ? 'bg-arena-primary text-white' 
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-4">
                {contributors.map((contributor, idx) => (
                  <div key={contributor.name} className="flex items-center gap-3">
                    <div className="text-2xl font-bold">#{idx + 1}</div>
                    <div className="w-10 h-10 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-lg font-bold">
                      {contributor.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{contributor.name}</div>
                      <div className="text-sm text-gray-400">{contributor.posts} posts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const topicDiscussions = [
  {
    id: '1',
    title: 'Best practices for WebSocket connections in production',
    excerpt: 'What are your experiences with scaling WebSocket connections? I\'m working on a real-time collaboration feature...',
    author: 'Alex Chen',
    time: '2 hours ago',
    replies: 23,
    likes: 45,
    views: 234,
  },
  {
    id: '7',
    title: 'Setting up a Node.js cluster for better performance',
    excerpt: 'How do you properly set up clustering in Node.js to take advantage of multi-core systems?',
    author: 'Tom Harris',
    time: '3 hours ago',
    replies: 14,
    likes: 28,
    views: 187,
  },
  {
    id: '8',
    title: 'Authentication strategies with JWT and refresh tokens',
    excerpt: 'What\'s the best way to implement JWT authentication with refresh tokens in a Node.js application?',
    author: 'Lisa Brown',
    time: '1 day ago',
    replies: 42,
    likes: 89,
    views: 523,
  },
]

const relatedTopics = [
  'JavaScript',
  'TypeScript',
  'Node.js',
  'React',
  'Next.js',
  'Python',
  'Docker',
  'Kubernetes'
]

const contributors = [
  { name: 'Alex Chen', posts: 45 },
  { name: 'Sarah Johnson', posts: 38 },
  { name: 'Mike Rodriguez', posts: 32 },
]

