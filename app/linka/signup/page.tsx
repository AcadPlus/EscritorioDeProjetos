'use client'

import { useState, useEffect } from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { BarChart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import useCampusOptions from '@/hooks/useCampusOptions'

export default function SignupComponent() {
  const [name, setName] = useState('')
  const [emailUsername, setEmailUsername] = useState('')
  const [emailDomain, setEmailDomain] = useState('@ufc.br')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState('ufc')
  const [role, setRole] = useState('')
  const [institution, setInstitution] = useState('')
  const [ufcCampus, setUfcCampus] = useState('')
  const [ufcId, setUfcId] = useState('')
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const campusOptions = useCampusOptions()

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (userType === 'ufc') {
      setEmail(`${emailUsername}${emailDomain}`)
    } else {
      setEmail(emailUsername)
    }
  }, [userType, emailUsername, emailDomain])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!email.trim()) newErrors.email = 'Email é obrigatório'
    if (password.length < 8)
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres'
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'As senhas não coincidem'
    if (!role && userType === 'ufc') newErrors.role = 'Função é obrigatória'
    if (!ufcCampus && userType === 'ufc')
      newErrors.ufcCampus = 'Campus é obrigatório'
    if (!ufcId && userType === 'ufc')
      newErrors.ufcId = 'Matrícula/SIAPE é obrigatório'
    if (!institution && userType === 'external')
      newErrors.institution = 'Instituição é obrigatória'
    if (!jobTitle && userType === 'external')
      newErrors.jobTitle = 'Cargo/Função é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const userData = {
        name,
        email,
        password,
        userType,
        role: userType === 'ufc' ? role : jobTitle,
        campus: userType === 'ufc' ? ufcCampus : institution,
        ufcId: userType === 'ufc' ? ufcId : undefined,
        company: userType === 'external' ? company : undefined,
      }

      await axios.post('/api/auth/signup', userData)

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Você será redirecionado para a página de login.',
      })

      setTimeout(() => {
        router.push('login')
      }, 2000)
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: 'Erro no cadastro',
        description:
          'Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
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
                {userType === 'ufc' ? (
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
                ) : (
                  <Input
                    id="email"
                    type="email"
                    value={emailUsername}
                    onChange={(e) => setEmailUsername(e.target.value)}
                    required
                    className={errors.email ? 'border-red-500' : ''}
                  />
                )}
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
                <Label>Tipo de Usuário</Label>
                <RadioGroup
                  defaultValue="ufc"
                  onValueChange={setUserType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ufc" id="ufc" />
                    <Label htmlFor="ufc">UFC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="external" id="external" />
                    <Label htmlFor="external">Externo</Label>
                  </div>
                </RadioGroup>
              </div>
              {userType === 'ufc' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role">Função na UFC</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger
                        className={errors.role ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Selecione sua função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professor">Professor</SelectItem>
                        <SelectItem value="estudante_graduacao">
                          Estudante de Graduação
                        </SelectItem>
                        <SelectItem value="estudante_pos">
                          Estudante de Pós-Graduação
                        </SelectItem>
                        <SelectItem value="pesquisador">Pesquisador</SelectItem>
                        <SelectItem value="tecnico">
                          Técnico Administrativo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-red-500 text-sm">{errors.role}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ufcCampus">Campus UFC</Label>
                    <Select value={ufcCampus} onValueChange={setUfcCampus}>
                      <SelectTrigger
                        className={errors.ufcCampus ? 'border-red-500' : ''}
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
                    {errors.ufcCampus && (
                      <p className="text-red-500 text-sm">{errors.ufcCampus}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ufcId">Matrícula/SIAPE</Label>
                    <Input
                      id="ufcId"
                      value={ufcId}
                      onChange={(e) => setUfcId(e.target.value)}
                      required
                      className={errors.ufcId ? 'border-red-500' : ''}
                    />
                    {errors.ufcId && (
                      <p className="text-red-500 text-sm">{errors.ufcId}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Instituição</Label>
                    <Input
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      required
                      className={errors.institution ? 'border-red-500' : ''}
                    />
                    {errors.institution && (
                      <p className="text-red-500 text-sm">
                        {errors.institution}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa (se aplicável)</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Cargo/Função</Label>
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      className={errors.jobTitle ? 'border-red-500' : ''}
                    />
                    {errors.jobTitle && (
                      <p className="text-red-500 text-sm">{errors.jobTitle}</p>
                    )}
                  </div>
                </>
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
    </div>
  )
}
