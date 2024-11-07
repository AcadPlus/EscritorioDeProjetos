import BaseItemCard from './base-item-card'
import { GraduationCap, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CompetenciaCard({ item, currentUser, userDisplayNames, onEdit, onDelete }) {
  const renderDetails = (competencia) => (
    <div className="space-y-2">
      <h4 className="font-semibold">Informações da Competência</h4>
      <p><strong>Área:</strong> {competencia.area}</p>
      <p><strong>Nível:</strong> {competencia.level}</p>
      <p><strong>Experiência:</strong> {competencia.experience} anos</p>
      <div className="flex space-x-2 mt-2">
        <Button variant="outline" size="sm" asChild>
          <a href={competencia.curriculum} target="_blank" rel="noopener noreferrer">
            <GraduationCap className="w-4 h-4 mr-2" />
            Currículo
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${competencia.email}`}>
            <Mail className="w-4 h-4 mr-2" />
            Contato
          </a>
        </Button>
      </div>
    </div>
  )

  return (
    <BaseItemCard
      item={item}
      currentUser={currentUser}
      userDisplayNames={userDisplayNames}
      onEdit={onEdit}
      onDelete={onDelete}
      renderDetails={renderDetails}
    />
  )
}