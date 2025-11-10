'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CommunityDetailPage() {
  const params = useParams()
  const discussionId = params.id as string

  // Find the discussion based on ID
  const discussion = discussions.find(d => d.id === discussionId)

  if (!discussion) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Discussion Not Found</h1>
          <Link href="/community" className="text-arena-primary hover:underline">
            Back to Community
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/community" 
            className="text-arena-primary hover:underline mb-4 inline-block"
          >
            ← Back to Community
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-arena-primary/20 text-arena-primary rounded text-sm font-semibold">
              {discussion.category}
            </span>
            <span className="text-gray-400">{discussion.time}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{discussion.title}</h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-arena-primary to-arena-secondary rounded-full flex items-center justify-center text-2xl font-bold">
              {discussion.author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{discussion.author}</div>
              <div className="text-sm text-gray-400">Community Member</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="p-8 bg-dark-card rounded-xl border border-gray-800 mb-6">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {discussion.fullContent}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 py-4 border-t border-gray-800">
                <button className="flex items-center gap-2 hover:text-arena-primary transition-colors">
                  👍 {discussion.likes} likes
                </button>
                <button className="flex items-center gap-2 hover:text-arena-primary transition-colors">
                  💬 {discussion.replies} replies
                </button>
                <span>👁️ {discussion.views} views</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Replies ({discussion.replies})</h2>
              
              <div className="space-y-4">
                {replies.map((reply, idx) => (
                  <div key={idx} className="p-6 bg-dark-card rounded-xl border border-gray-800">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
                        {reply.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{reply.author}</h4>
                          <span className="text-sm text-gray-400">{reply.time}</span>
                        </div>
                        <p className="text-gray-300">{reply.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <button className="hover:text-arena-primary transition-colors">
                            👍 {reply.likes}
                          </button>
                          <button className="hover:text-arena-primary transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-dark-card rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Add your reply</h3>
                <textarea
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-arena-primary text-white"
                  rows={4}
                  placeholder="Share your thoughts..."
                />
                <button className="mt-3 px-6 py-2 bg-arena-primary hover:bg-arena-primary/80 text-white font-semibold rounded-lg transition-colors">
                  Post Reply
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-dark-card rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
              <div className="space-y-2">
                {relatedTopics.map(topic => (
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
              <h3 className="text-lg font-semibold mb-4">Similar Discussions</h3>
              <div className="space-y-4">
                {similarDiscussions.map((disc, idx) => (
                  <Link 
                    key={idx} 
                    href={`/community/${disc.id}`}
                    className="block hover:text-arena-primary transition-colors"
                  >
                    <h4 className="font-semibold mb-1">{disc.title}</h4>
                    <p className="text-sm text-gray-400">{disc.replies} replies</p>
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

const discussions = [
  {
    id: '1',
    title: 'Best practices for WebSocket connections in production',
    excerpt: 'What are your experiences with scaling WebSocket connections? I\'m working on a real-time collaboration feature...',
    fullContent: 'What are your experiences with scaling WebSocket connections? I\'m working on a real-time collaboration feature and need to handle thousands of concurrent connections. I\'ve been looking at different solutions like Socket.IO, native WebSockets, and Server-Sent Events. What would you recommend for a production environment? Also, how do you handle reconnection logic and state management? Any insights on load balancing and horizontal scaling would be greatly appreciated!',
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
    fullContent: 'I\'m starting a new project and wondering if I should use TypeScript or stick with plain JavaScript. I understand TypeScript provides type safety and better IDE support, but I\'m concerned about the learning curve for my team. What are your thoughts on when TypeScript is worth the investment versus when plain JavaScript is sufficient? Has anyone made the switch mid-project?',
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
    fullContent: 'Looking for advice on managing multiple containers in a microservices architecture. We currently have about 15 microservices and are considering moving from Docker Compose to Kubernetes. What are the main benefits we should expect? What are the common pitfalls to avoid? Also interested in hearing about alternatives like Docker Swarm or Nomad. What has been your experience with these orchestration tools?',
    author: 'Mike Rodriguez',
    time: '1 day ago',
    category: 'DevOps',
    replies: 31,
    likes: 67,
    views: 445,
  },
]

const replies = [
  {
    author: 'Emma Wilson',
    time: '1 hour ago',
    content: 'Great question! I\'ve been using Socket.IO for our production app and it handles 10k+ concurrent connections smoothly. The key is proper load balancing with Redis adapter.',
    likes: 12
  },
  {
    author: 'David Kim',
    time: '45 minutes ago',
    content: 'I recommend native WebSockets with a library like ws for Node.js. More control and less overhead compared to Socket.IO. We use Nginx for load balancing.',
    likes: 8
  },
  {
    author: 'Sophia Martinez',
    time: '30 minutes ago',
    content: 'Don\'t forget to implement heartbeat/ping-pong to detect dead connections. Also, consider using a message queue like RabbitMQ for better scalability.',
    likes: 15
  }
]

const relatedTopics = [
  'WebSocket',
  'Real-time',
  'Socket.IO',
  'Node.js',
  'Scaling'
]

const similarDiscussions = [
  {
    id: '4',
    title: 'Real-time chat app architecture',
    replies: 15
  },
  {
    id: '5',
    title: 'Load balancing strategies for WebSockets',
    replies: 28
  },
  {
    id: '6',
    title: 'Redis pub/sub vs message queues',
    replies: 19
  }
]

