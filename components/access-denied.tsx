'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AccessDenied() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="mb-6 text-gray-600">
          Você precisa estar autenticado para acessar esta página. Por favor,
          faça login para continuar.
        </p>
        <Button
          className="bg-black text-white hover:bg-gray-800 w-full"
          onClick={() => router.push('/login')}
        >
          Entendi, fazer login
        </Button>
      </div>
    </div>
  )
} 