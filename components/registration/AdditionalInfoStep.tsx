import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserType, UserCreateData, PesquisadorCreate, EstudanteCreate, ExternoCreate } from '@/lib/types/userTypes'

interface AdditionalInfoStepProps {
  userType: UserType
  formData: UserCreateData
  onInputChange: (name: string, value: string | string[]) => void
  onSocialMediaChange: (network: string, value: string) => void
}

export function AdditionalInfoStep({
  userType,
  formData,
  onInputChange,
  onSocialMediaChange,
}: AdditionalInfoStepProps) {
  if (userType === UserType.PESQUISADOR) {
    const pesquisadorData = formData as PesquisadorCreate;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lattes">Lattes</Label>
          <Input
            id="lattes"
            value={pesquisadorData.lattes}
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
            value={pesquisadorData.palavras_chave.join(', ')}
            onChange={(e) => onInputChange('palavras_chave', e.target.value.split(',').map(word => word.trim()))}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campus">Campus</Label>
          <Input
            id="campus"
            value={pesquisadorData.campus}
            onChange={(e) => onInputChange('campus', e.target.value)}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn (opcional)</Label>
          <Input
            id="linkedin"
            value={pesquisadorData.redes_sociais?.linkedin || ''}
            onChange={(e) => onSocialMediaChange('linkedin', e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter (opcional)</Label>
          <Input
            id="twitter"
            value={pesquisadorData.redes_sociais?.twitter || ''}
            onChange={(e) => onSocialMediaChange('twitter', e.target.value)}
            className="h-11"
          />
        </div>
      </div>
    )
  }

  if (userType === UserType.ESTUDANTE) {
    const estudanteData = formData as EstudanteCreate;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="curso">Curso</Label>
          <Input
            id="curso"
            value={estudanteData.curso}
            onChange={(e) => onInputChange('curso', e.target.value)}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campus">Campus</Label>
          <Input
            id="campus"
            value={estudanteData.campus}
            onChange={(e) => onInputChange('campus', e.target.value)}
            className="h-11"
            required
          />
        </div>
      </div>
    )
  }

  const externoData = formData as ExternoCreate;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="empresa">Empresa (opcional)</Label>
        <Input
          id="empresa"
          value={externoData.empresa || ''}
          onChange={(e) => onInputChange('empresa', e.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cargo">Cargo (opcional)</Label>
        <Input
          id="cargo"
          value={externoData.cargo || ''}
          onChange={(e) => onInputChange('cargo', e.target.value)}
          className="h-11"
        />
      </div>
    </div>
  )
}

