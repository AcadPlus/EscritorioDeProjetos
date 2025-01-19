import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function BusinessCardSkeleton() {
  return (
    <Card className="w-full h-[300px]">
      <CardHeader className="pb-2">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </CardContent>
    </Card>
  )
}
