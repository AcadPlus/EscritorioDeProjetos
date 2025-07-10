'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { type ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { publicRoutes } from '@/lib/config/publicRoutes'

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') return pathname === route
    return pathname.startsWith(route)
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      toast({
        title: 'Acesso restrito',
        description: 'Você precisa estar autenticado para acessar esta página.',
        variant: 'destructive',
        duration: 5000,
      })
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router, toast])

  if (isLoading) {
    return <div>Carregando...</div> // Ou um componente de skeleton/loading
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null // Retorna null para não renderizar nada enquanto redireciona
  }

  return <>{children}</>
}
