import { useRouter } from 'next/navigation'
import { InitiativeCard } from '@/components/initiatives/InitiativeCard'
import { IniciativaBase } from '@/lib/types/initiativeTypes'
import { Skeleton } from '@/components/ui/skeleton'

interface InitiativeListProps {
  initiatives: IniciativaBase[]
  isLoading: boolean
  onFavorite?: (initiativeId: string) => void
  onUnfavorite?: (initiativeId: string) => void
  isInitiativeFavorited?: (initiativeId: string) => boolean
  currentUserId?: string
}

const InitiativeList = ({ 
  initiatives, 
  isLoading,
  onFavorite,
  onUnfavorite,
  isInitiativeFavorited,
  currentUserId
}: InitiativeListProps) => {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {initiatives.map((initiative) => (
        <InitiativeCard
          key={initiative.uid}
          initiative={initiative}
          onClick={() => router.push(`/iniciativas/${initiative.uid}`)}
          onFavorite={onFavorite ? () => onFavorite(initiative.uid) : undefined}
          onUnfavorite={onUnfavorite ? () => onUnfavorite(initiative.uid) : undefined}
          isFavorited={isInitiativeFavorited ? isInitiativeFavorited(initiative.uid) : false}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}

export default InitiativeList 