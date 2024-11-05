'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginScreen() {
  const [accountType, setAccountType] = useState('internal')
  const [emailDomain, setEmailDomain] = useState('@ufc.br')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    if (isLoggedIn) router.push('dashboard')
  }, [isLoggedIn, router])

  const handleSubmit = async (e: React.FormEvent) => {
    const email =
      accountType === 'internal' ? `${username}${emailDomain}` : username
    e.preventDefault()

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token) // Armazene o token
      router.push('/linka/dashboard') // Redireciona o usuário
    } else {
      setError(data.message || 'Erro ao realizar login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full md:max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-2 mb-8">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500 ml-2">Voltar ao EP</p>
            </Link>
          </div>

          <CardTitle>Login</CardTitle>
          <CardDescription>Acesse sua conta do Linka</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <RadioGroup
              defaultValue="internal"
              onValueChange={(value) => setAccountType(value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="internal" />
                <Label htmlFor="internal">Conta UFC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="external" id="external" />
                <Label htmlFor="external">Conta Externa</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {accountType === 'internal' ? (
                <div className="flex">
                  <Input
                    id="email"
                    type="text"
                    placeholder="Nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-r-none"
                    required
                  />
                  <Select value={emailDomain} onValueChange={setEmailDomain}>
                    <SelectTrigger className="w-[140px] rounded-l-none">
                      <SelectValue placeholder="Selecione o domínio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="@ufc.br">@ufc.br</SelectItem>
                      <SelectItem value="@alu.ufc.br">@alu.ufc.br</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}
            </div>

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
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {error ? <p className="text-red-600">{error}</p> : null}
          <Button className="w-full bg-black text-white" onClick={handleSubmit}>
            Entrar
          </Button>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
          <div className="text-sm text-gray-500">
            Não tem uma conta?{' '}
            <Link
              href="/linka/signup"
              className="text-blue-500 hover:underline"
            >
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
