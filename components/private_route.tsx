'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'

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
        title: "Não autenticado",
        description: "Você precisa fazer login para acessar esta página.",
        duration: 5000,
        variant: "destructive",
      })
      router.push('/linka/negocios')
    }
  }, [isAuthenticated, isLoading, router, toast])

  if (isLoading) {
    return <div>Carregando...</div> // You can replace this with a loading spinner or skeleton
  }

  if (!isAuthenticated) {
    return <Toaster />
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

export default PrivateRoute

