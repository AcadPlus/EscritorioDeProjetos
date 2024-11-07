import BaseItemCard from './base-item-card'
import { MapPin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LaboratorioCard({ item, currentUser, userDisplayNames, onEdit, onDelete }) {
  const renderDetails = (laboratorio) => (
    <div className="space-y-2">
      <h4 className="font-semibold">Informações do Laboratório</h4>
      <p><strong>Departamento:</strong> {laboratorio.department}</p>
      <p><strong>Área de Pesquisa:</strong> {laboratorio.researchArea}</p>
      <p><strong>Equipamentos:</strong> {laboratorio.equipment.join(', ')}</p>
      <div className="flex space-x-2 mt-2">
        <Button variant="outline" size="sm" asChild>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(laboratorio.location)}`} target="_blank" rel="noopener noreferrer">
            <MapPin className="w-4 h-4 mr-2" />
            Localização
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${laboratorio.email}`}>
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