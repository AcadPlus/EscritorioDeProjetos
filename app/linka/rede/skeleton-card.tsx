import { Card, CardContent } from '@/components/ui/card'

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-4">
          <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
