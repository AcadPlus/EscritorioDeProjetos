import { useRouter } from 'next/navigation'
import { InitiativeCard } from '@/components/initiatives/InitiativeCard'

interface InitiativeListProps {
  initiatives: any[]
}

export const InitiativeList = ({ initiatives }: InitiativeListProps) => {
  const router = useRouter()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {initiatives.map((initiative) => (
        <InitiativeCard
          key={initiative.uid}
          initiative={initiative}
          onClick={() => router.push(`/linka/iniciativas/${initiative.uid}`)}
        />
      ))}
    </div>
  )
} 