import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle, User, GraduationCap, Crown, Briefcase } from 'lucide-react'
import { UserType } from '@/lib/types/userTypes'
import { motion } from 'framer-motion'

interface LoginFormProps {
  onSubmit: (email: string, password: string, userType: UserType) => void
  error: string
  successMessage: string
}

export function LoginForm({ onSubmit, error, successMessage }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [detectedUserType, setDetectedUserType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Função para detectar o tipo de usuário baseado no email
  const detectUserType = (email: string): UserType => {
    if (email.endsWith('@alu.ufc.br')) {
      return UserType.ESTUDANTE
    } else if (email.endsWith('@ufc.br')) {
      return UserType.PESQUISADOR
    } else {
      return UserType.EXTERNO
    }
  }

  // Função para obter o ícone do tipo de usuário
  const getUserTypeIcon = (type: UserType) => {
    switch (type) {
      case UserType.ESTUDANTE:
        return <GraduationCap className="h-4 w-4" />
      case UserType.PESQUISADOR:
        return <Crown className="h-4 w-4" />
      case UserType.EXTERNO:
        return <Briefcase className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  // Função para obter o label do tipo de usuário
  const getUserTypeLabel = (type: UserType) => {
    switch (type) {
      case UserType.ESTUDANTE:
        return 'Estudante'
      case UserType.PESQUISADOR:
        return 'Pesquisador'
      case UserType.EXTERNO:
        return 'Externo'
      default:
        return 'Usuário'
    }
  }

  // Detectar tipo de usuário quando o email muda
  useEffect(() => {
    if (email.includes('@')) {
      const userType = detectUserType(email)
      setDetectedUserType(userType)
    } else {
      setDetectedUserType(null)
    }
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!detectedUserType) return
    
    setIsLoading(true)
    try {
      await onSubmit(email, password, detectedUserType)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Label htmlFor="email" className="text-gray-700 font-medium">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
            placeholder="Digite seu email"
            required
          />
          
          {/* Indicador de tipo de usuário detectado */}
          {detectedUserType && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute right-3 top-1 transform -translate-y-1/2"
            >
              <div className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-purple-100 to-violet-100 rounded-full">
                {getUserTypeIcon(detectedUserType)}
                <span className="text-xs font-medium text-purple-700">
                  {getUserTypeLabel(detectedUserType)}
                </span>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Explicação sobre detecção automática */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs text-gray-500 mt-2"
        >
          <p>
          <strong>Detecção automática:</strong> Estudante • Pesquisador • Externo
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Label htmlFor="password" className="text-gray-700 font-medium">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
            placeholder="Digite sua senha"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300 text-white font-medium py-3"
          type="submit"
          disabled={isLoading || !detectedUserType}
        >
          {isLoading ? (
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </motion.div>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Entrar
              {detectedUserType && (
                <span className="opacity-75">
                  como {getUserTypeLabel(detectedUserType)}
                </span>
              )}
            </>
          )}
        </Button>
      </motion.div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}
      
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
        >
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{successMessage}</p>
        </motion.div>
      )}
    </motion.form>
  )
}
