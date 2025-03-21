/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import type { SelectableUserType } from '@/lib/types/userTypes'
import { StepByStepRegister } from '@/components/StepByStepRegister'
import { LoginForm } from './components/LoginForm'

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/linka/negocios')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (
    email: string,
    password: string,
    userType: SelectableUserType,
  ) => {
    setError('')
    setSuccessMessage('')

    try {
      await login(email, password, userType)
      router.push('/linka/negocios')
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Erro ao fazer login')
      }
    }
  }

  const handleRegisterSuccess = () => {
    setIsRegistering(false)
    setSuccessMessage('Cadastro realizado com sucesso. Por favor, faça login.')
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full md:max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-2 mb-8">
              <ArrowLeft className="h-5 w-5 text-[#808080]" />
              <p className="text-sm text-[#808080] ml-2">Voltar ao EP</p>
            </Link>
          </div>
          <CardTitle>{isRegistering ? 'Cadastro' : 'Login'}</CardTitle>
        </CardHeader>
        <CardContent>
          {isRegistering ? (
            <StepByStepRegister onRegisterSuccess={handleRegisterSuccess} />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              error={error}
              successMessage={successMessage}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-[#808080]">
            {isRegistering ? (
              <>
                Já tem uma conta?{' '}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => {
                    setIsRegistering(false)
                    setError('')
                    setSuccessMessage('')
                  }}
                  style={{ color: '#000' }}
                >
                  Faça login
                </Button>
              </>
            ) : (
              <>
                Não tem uma conta?{' '}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => {
                    setIsRegistering(true)
                    setError('')
                    setSuccessMessage('')
                  }}
                  style={{ color: '#000' }}
                >
                  Cadastre-se
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
