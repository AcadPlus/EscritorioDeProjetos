import { Card, CardContent } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden shadow-lg border border-purple-100 bg-white h-full">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-purple-100 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-purple-100 rounded-lg animate-pulse" />
            <div className="h-4 w-1/2 bg-purple-50 rounded-full animate-pulse" />
            <div className="h-3 w-2/3 bg-purple-50 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-20 bg-purple-100 rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-purple-100 rounded animate-pulse" />
        </div>
        <div className="mt-4">
          <div className="h-9 w-full bg-purple-100 rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
