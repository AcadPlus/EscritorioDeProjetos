import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Info, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TipoIniciativa, PublicStatusIniciativa } from '@/lib/types/initiativeTypes'

interface NoResultsProps {
  searchTerm: string
  selectedType?: TipoIniciativa
  selectedStatus: PublicStatusIniciativa
  isAuthenticated: boolean
}

export const NoResults = ({
  searchTerm,
  selectedType,
  selectedStatus,
  isAuthenticated
}: NoResultsProps) => {
  const router = useRouter()
  
  return (
    <Card className="p-8">
      <div className="text-center">
        <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground mb-2">
          {searchTerm
            ? `Nenhuma iniciativa encontrada para "${searchTerm}"`
            : `Nenhuma iniciativa ${selectedType ? `do tipo ${selectedType}` : ''} com status ${selectedStatus.toLowerCase()}`}
        </p>
        <p className="text-sm text-muted-foreground">
          {searchTerm
            ? 'Tente usar termos diferentes na sua busca.'
            : selectedStatus === PublicStatusIniciativa.ATIVA
              ? 'As iniciativas precisam ser aprovadas por um administrador antes de aparecerem aqui.'
              : 'Tente mudar os filtros para encontrar mais iniciativas.'}
        </p>
        {isAuthenticated && (
          <Button
            className="mt-4 bg-black text-white hover:bg-black/70"
            onClick={() => router.push('/minhas-iniciativas')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Gerenciar Minhas Iniciativas
          </Button>
        )}
      </div>
    </Card>
  )
} 