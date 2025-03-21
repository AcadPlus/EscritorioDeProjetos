'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && pathname) {
      if (isAuthenticated && pathname === '/linka/login') {
        router.push('/linka/negocios')
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return <>{children}</>
}
