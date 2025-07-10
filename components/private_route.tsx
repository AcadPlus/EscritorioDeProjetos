'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { publicRoutes } from '@/lib/config/publicRoutes'
import { AccessDenied } from '@/components/access-denied'

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') return pathname === route
    return pathname.startsWith(route)
  })

  if (isLoading) {
    return <div>Carregando...</div> // Ou um componente de skeleton/loading
  }

  if (!isAuthenticated && !isPublicRoute) {
    return <AccessDenied />
  }

  return <>{children}</>
}
