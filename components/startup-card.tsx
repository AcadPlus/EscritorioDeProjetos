import BaseItemCard from './base-item-card'
import { ExternalLink, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StartupCard({
  item,
  currentUser,
  userDisplayNames,
  onEdit,
  onDelete,
}) {
  const renderDetails = (startup) => (
    <div className="space-y-2">
      <h4 className="font-semibold">Informações da Startup</h4>
      <p>
        <strong>Fundação:</strong> {startup.foundationYear}
      </p>
      <p>
        <strong>Setor:</strong> {startup.sector}
      </p>
      <p>
        <strong>Estágio:</strong> {startup.stage}
      </p>
      <div className="flex space-x-2 mt-2">
        <Button variant="outline" size="sm" asChild>
          <a href={startup.website} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Website
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${startup.email}`}>
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
