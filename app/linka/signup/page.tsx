'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { BarChart, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import useCampusOptions from '@/hooks/useCampusOptions'

export default function SignupComponent() {
  const [name, setName] = useState('')
  const [emailUsername, setEmailUsername] = useState('')
  const [emailDomain, setEmailDomain] = useState('@ufc.br')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('')
  const [campus, setCampus] = useState('')
  const [siape, setSiape] = useState('')
  const [matricula, setMatricula] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')

  const campusOptions = useCampusOptions()

  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!emailUsername.trim()) newErrors.email = 'Email é obrigatório'
    if (password.length < 8)
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres'
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'As senhas não coincidem'
    if (!role) newErrors.role = 'Função é obrigatória'
    if (!campus) newErrors.campus = 'Campus é obrigatório'
    if (emailDomain === '@ufc.br' && !siape)
      newErrors.siape = 'SIAPE é obrigatório'
    if (emailDomain === '@alu.ufc.br' && !matricula)
      newErrors.matricula = 'Matrícula é obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await axios.post('/api/auth/signup', {
        name,
        email: emailUsername,
        password,
        emailDomain,
        role,
        campus,
        siape: emailDomain === '@ufc.br' ? siape : undefined,
        matricula: emailDomain === '@alu.ufc.br' ? matricula : undefined,
      })

      if (response.status === 200) {
        setShowConfirmationModal(true)
        await sendVerificationCode(emailUsername + emailDomain)
      } else {
        toast({
          title: 'Erro',
          description: response.data.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao cadastrar o usuário.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendVerificationCode = async (email: string) => {
    try {
      await axios.post('/api/sendCode', { email })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar o código de verificação.',
        variant: 'destructive',
      })
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true)

    try {
      const response = await axios.post('/api/verifyCode', {
        email: emailUsername + emailDomain,
        code: verificationCode,
      })

      if (response.status === 200) {
        toast({
          title: 'Sucesso',
          description: 'Código verificado com sucesso!',
          variant: 'default',
        })
        router.push('login')
      } else {
        toast({
          title: 'Erro',
          description: response.data.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao verificar o código.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      await axios.post('/api/sendCode', { email: emailUsername + emailDomain })
      toast({
        title: 'Sucesso',
        description: 'Código de verificação reenviado.',
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao reenviar o código de verificação.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <BarChart className="h-6 w-6 text-blue-500 mr-2" />
            <CardTitle className="text-2xl font-bold">LINKA</CardTitle>
          </div>
          <CardDescription>
            Crie sua conta para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <Input
                    id="email"
                    value={emailUsername}
                    onChange={(e) => setEmailUsername(e.target.value)}
                    className={`rounded-r-none ${errors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  <Select value={emailDomain} onValueChange={setEmailDomain}>
                    <SelectTrigger
                      className={`w-[140px] rounded-l-none ${errors.email ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Selecione o domínio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="@ufc.br">@ufc.br</SelectItem>
                      <SelectItem value="@alu.ufc.br">@alu.ufc.br</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função na UFC</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger
                    className={errors.role ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Selecione sua função" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailDomain === '@ufc.br' ? (
                      <>
                        <SelectItem value="professor">Professor</SelectItem>
                        <SelectItem value="pesquisador">Pesquisador</SelectItem>
                        <SelectItem value="tecnico">
                          Técnico Administrativo
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="estudante_graduacao">
                          Estudante de Graduação
                        </SelectItem>
                        <SelectItem value="estudante_pos">
                          Estudante de Pós-Graduação
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus">Campus UFC</Label>
                <Select value={campus} onValueChange={setCampus}>
                  <SelectTrigger
                    className={errors.campus ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Selecione seu campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campusOptions.map((campus, index) => (
                      <SelectItem key={index} value={campus}>
                        {campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.campus && (
                  <p className="text-red-500 text-sm">{errors.campus}</p>
                )}
              </div>
              {emailDomain === '@ufc.br' ? (
                <div className="space-y-2">
                  <Label htmlFor="siape">SIAPE</Label>
                  <Input
                    id="siape"
                    value={siape}
                    onChange={(e) => setSiape(e.target.value)}
                    required
                    className={errors.siape ? 'border-red-500' : ''}
                  />
                  {errors.siape && (
                    <p className="text-red-500 text-sm">{errors.siape}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required
                    className={errors.matricula ? 'border-red-500' : ''}
                  />
                  {errors.matricula && (
                    <p className="text-red-500 text-sm">{errors.matricula}</p>
                  )}
                </div>
              )}
            </div>
            <Button
              className="w-full bg-black text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="bg-black text-white mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500 text-center w-full">
            Já tem uma conta?{' '}
            <Link href="login" className="text-blue-500 hover:underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>

      <Dialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmação de Email</DialogTitle>
            <DialogDescription>
              Enviamos um email para {emailUsername + emailDomain} para
              confirmar a validade do seu endereço de email. Por favor, insira o
              código de verificação abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <Mail className="h-12 w-12 text-green-500" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Input
                className="col-span-4"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Código de verificação"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={handleVerifyCode} disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Verificar'}
            </Button>
            <Button variant="outline" onClick={handleResendCode}>
              Reenviar código
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
