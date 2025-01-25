import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { UserType } from '@/lib/types/userTypes'
import { DynamicEmailInput } from '@/components/dynamic-email-input'
import { UserTypeSelector } from '@/app/linka/login/components/UseTypeSelector'

interface LoginFormProps {
  onSubmit: (email: string, password: string, userType: UserType) => void
  error: string
  successMessage: string
}

export function LoginForm({ onSubmit, error, successMessage }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>(UserType.ESTUDANTE)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password, userType)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <UserTypeSelector userType={userType} onUserTypeChange={setUserType} />

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

      <Button
        className="w-full text-white"
        type="submit"
        style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
      >
        Entrar
      </Button>
      {error && <p className="text-[#FF0000]">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-sm">{successMessage}</p>
      )}
    </form>
  )
}
