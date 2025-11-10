'use client'

import Link from 'next/link'
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid'

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Learning Paths</h1>
          <p className="text-gray-400 max-w-2xl">
            Master new technologies with structured courses and hands-on projects
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {learningPaths.map((path, idx) => (
            <Link key={path.id} href={`/learn/${path.id}`}>
              <div
                className="p-6 bg-dark-card rounded-xl border border-gray-800 hover:border-arena-primary transition-all h-full flex flex-col"
              >
                <div className="text-5xl mb-4">{path.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{path.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{path.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-arena-primary font-semibold">
                      {path.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-arena-primary to-arena-secondary h-2 rounded-full"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{path.lessonsCompleted} of {path.totalLessons} lessons</span>
                    {path.completed && (
                      <CheckCircleIcon className="w-5 h-5 text-arena-success" />
                    )}
                    {path.locked && (
                      <LockClosedIcon className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const learningPaths = [
  {
    id: '1',
    title: 'JavaScript Mastery',
    icon: '📦',
    description: 'Master modern JavaScript from basics to advanced patterns',
    progress: 65,
    lessonsCompleted: 13,
    totalLessons: 20,
    completed: false,
    locked: false,
  },
  {
    id: '2',
    title: 'TypeScript Advanced',
    icon: '📘',
    description: 'Deep dive into TypeScript types, generics, and advanced features',
    progress: 30,
    lessonsCompleted: 6,
    totalLessons: 20,
    completed: false,
    locked: false,
  },
  {
    id: '3',
    title: 'System Design',
    icon: '🏗️',
    description: 'Build scalable distributed systems and architectures',
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 15,
    completed: false,
    locked: true,
  },
  {
    id: '4',
    title: 'Algorithm & Data Structures',
    icon: '🧮',
    description: 'Master fundamental algorithms and data structures',
    progress: 100,
    lessonsCompleted: 30,
    totalLessons: 30,
    completed: true,
    locked: false,
  },
  {
    id: '5',
    title: 'Next.js Deep Dive',
    icon: '⚡',
    description: 'Build modern web applications with Next.js',
    progress: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
    completed: false,
    locked: false,
  },
  {
    id: '6',
    title: 'Cloud Architecture',
    icon: '☁️',
    description: 'Learn AWS, GCP, and Azure cloud services',
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 25,
    completed: false,
    locked: true,
  },
]

