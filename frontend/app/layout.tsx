import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeBattle Arena - Competitive Coding & Learning Platform',
  description: 'Compete in coding challenges, learn new technologies, and automate workflows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#8B5CF6',
          colorBackground: '#1a1a2e',
        }
      }}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <Providers>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

