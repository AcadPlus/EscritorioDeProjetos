import { useRouter } from 'next/navigation'
import { InitiativeCard } from '@/components/initiatives/InitiativeCard'
import { Skeleton } from '@/components/ui/skeleton'

interface InitiativeListProps {
  initiatives: any[]
  isLoading: boolean
}

const InitiativeList = ({ initiatives, isLoading }: InitiativeListProps) => {
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
        />
      ))}
    </div>
  )
}

export default InitiativeList 