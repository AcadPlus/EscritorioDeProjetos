'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toast } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setShowToast(true)
      toast({
        title: "Não autenticado",
        description: "Você precisa fazer login para acessar esta página.",
        duration: 5000,
        variant: "destructive",
      })
      router.push('/linka/negocios')
    }
  }, [isAuthenticated, router, toast])

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

