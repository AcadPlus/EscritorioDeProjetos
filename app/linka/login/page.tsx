/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api/auth'
import { UserType, UserTypeDomain } from '@/lib/types/userTypes'
import { StepByStepRegister } from '@/components/StepByStepRegister'
import { DynamicEmailInput } from '@/components/dynamic-email-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [userType, setUserType] = useState<UserType>(UserType.ESTUDANTE)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('acessToken')
    if (token !== null) {
      router.push('linka/negocios')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await login(email, password, userType)
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      router.push('/linka/negocios')
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Erro ao fazer login')
      } else {
        setError('Erro ao fazer login. Tente novamente.')
      }
    }
  }

  const handleRegisterSuccess = () => {
    setIsRegistering(false)
    setError('Cadastro realizado com sucesso. Por favor, faça login.')
  }

  const handleUserTypeChange = (value: UserType) => {
    setUserType(value as UserType)
    // Adjust email when changing user type
    if (value === UserType.EXTERNO) {
      setEmail(email.split('@')[0]) // Remove domain for external users
    } else {
      const username = email.split('@')[0]
      setEmail(username + UserTypeDomain[value as UserType])
    }
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <RadioGroup
                value={userType}
                onValueChange={handleUserTypeChange}
                className="flex flex-col sm:flex-row gap-4 mb-4"
              >
                {Object.values(UserType).map((type) => (
                  <div
                    key={type}
                    className={`flex-1 flex items-center space-x-2 rounded-lg border p-2 cursor-pointer hover:border-black ${
                      userType === type ? 'bg-gray-100 border-black' : ''
                    }`}
                  >
                    <RadioGroupItem
                      value={type}
                      id={type}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border ${userType === type ? 'bg-black border-black' : 'border-gray-300'}`}
                    />
                    <Label htmlFor={type} className="cursor-pointer flex-grow">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <DynamicEmailInput
                email={email}
                userType={userType}
                onEmailChange={setEmail}
                label="Email"
                required
              />

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#808080]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#808080]" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {error && <p className="text-[#FF0000]">{error}</p>}
          {!isRegistering && (
            <Button
              className="w-full text-white"
              onClick={handleSubmit}
              style={{ backgroundColor: '#000' }}
            >
              Entrar
            </Button>
          )}
          <div className="text-sm text-[#808080]">
            {isRegistering ? (
              <>
                Já tem uma conta?{' '}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setIsRegistering(false)}
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
                  onClick={() => setIsRegistering(true)}
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
