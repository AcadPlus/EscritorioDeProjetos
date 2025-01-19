/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserType } from '@/lib/types/userTypes'

interface AdditionalInfoStepProps {
  userType: UserType
  formData: any
  onInputChange: (name: string, value: string) => void
  onSocialMediaChange?: (network: string, value: string) => void
}

export function AdditionalInfoStep({
  userType,
  formData,
  onInputChange,
  onSocialMediaChange,
}: AdditionalInfoStepProps) {
  if (userType === UserType.PESQUISADOR) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lattes">Lattes</Label>
          <Input
            id="lattes"
            value={formData.lattes || ''}
            onChange={(e) => onInputChange('lattes', e.target.value)}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="palavras_chave">
            Palavras-chave (separadas por vírgula)
          </Label>
          <Input
            id="palavras_chave"
            value={formData.palavras_chave?.join(', ') || ''}
            onChange={(e) =>
              onInputChange(
                'palavras_chave',
                e.target.value.split(',').map((word) => word.trim()),
              )
            }
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campus">Campus</Label>
          <Input
            id="campus"
            value={formData.campus || ''}
            onChange={(e) => onInputChange('campus', e.target.value)}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn (opcional)</Label>
          <Input
            id="linkedin"
            value={formData.redes_sociais?.linkedin || ''}
            onChange={(e) => onSocialMediaChange?.('linkedin', e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter (opcional)</Label>
          <Input
            id="twitter"
            value={formData.redes_sociais?.twitter || ''}
            onChange={(e) => onSocialMediaChange?.('twitter', e.target.value)}
            className="h-11"
          />
        </div>
      </div>
    )
  }

  if (userType === UserType.ESTUDANTE) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="curso">Curso</Label>
          <Input
            id="curso"
            value={formData.curso || ''}
            onChange={(e) => onInputChange('curso', e.target.value)}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campus">Campus</Label>
          <Input
            id="campus"
            value={formData.campus || ''}
            onChange={(e) => onInputChange('campus', e.target.value)}
            className="h-11"
            required
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="empresa">Empresa (opcional)</Label>
        <Input
          id="empresa"
          value={formData.empresa || ''}
          onChange={(e) => onInputChange('empresa', e.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cargo">Cargo (opcional)</Label>
        <Input
          id="cargo"
          value={formData.cargo || ''}
          onChange={(e) => onInputChange('cargo', e.target.value)}
          className="h-11"
        />
      </div>
    </div>
  )
}
