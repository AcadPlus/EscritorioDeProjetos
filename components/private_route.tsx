'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: 'Não autenticado',
        description: 'Você precisa fazer login para acessar esta página.',
        duration: 5000,
        variant: 'destructive',
      })
    }
  }, [isAuthenticated, isLoading, toast])

  const handleLogin = () => {
    router.push('/linka/login')
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">
            Você precisa estar autenticado para acessar esta página.
          </p>
          <Button
            className="bg-black text-white hover:bg-[#808080]"
            onClick={handleLogin}
          >
            Entendi, fazer login
          </Button>
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

export default PrivateRoute
