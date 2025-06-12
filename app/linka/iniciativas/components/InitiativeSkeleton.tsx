import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export const InitiativeSkeleton = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </Card>
) 