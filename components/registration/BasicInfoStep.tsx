import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '../phone-input'
import { UserType, UserTypeDomain } from '@/lib/types/userTypes'

interface BasicInfoStepProps {
  nome: string
  email: string
  telefone: string
  userType: UserType
  errors: { [key: string]: string }
  onInputChange: (name: string, value: string) => void
}

export function BasicInfoStep({
  nome,
  email,
  telefone,
  userType,
  errors,
  onInputChange,
}: BasicInfoStepProps) {
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userType === UserType.EXTERNO) {
      // For external users, allow full email input
      onInputChange('email', e.target.value)
    } else {
      // For internal users, restrict domain
      const username = e.target.value.split('@')[0]
      const domain = UserTypeDomain[userType]
      onInputChange('email', username + domain)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => onInputChange('nome', e.target.value)}
          className="h-11"
          required
        />
        {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={userType === UserType.EXTERNO ? email : email.split('@')[0]}
            onChange={handleEmailChange}
            className={`h-11 ${userType !== UserType.EXTERNO ? 'pr-24' : ''}`}
            required
            placeholder={
              userType === UserType.EXTERNO
                ? 'seu.email@exemplo.com'
                : 'seu.email'
            }
          />
          {userType !== UserType.EXTERNO && (
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 bg-gray-100 border-l">
              {UserTypeDomain[userType]}
            </div>
          )}
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <PhoneInput
        value={telefone}
        onChange={(value) => onInputChange('telefone', value)}
        error={errors.telefone}
        required
      />
    </div>
  )
}
