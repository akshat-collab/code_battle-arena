'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show navigation on auth pages
  const hideNav = pathname === '/login' || pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')

  return (
    <>
      {!hideNav && <Navigation />}
      {children}
    </>
  )
}

