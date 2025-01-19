import { Button } from '@/components/ui/button'
import { RefreshCcwIcon } from 'lucide-react'

interface BusinessRefreshButton {
  handleRefreshButtonClick: () => void
}

export function BusinessRefresh({
  handleRefreshButtonClick,
}: BusinessRefreshButton) {
  return (
    <Button
      onClick={handleRefreshButtonClick}
      variant="outline"
      className="bg-white w-full sm:w-auto"
    >
      <RefreshCcwIcon className="mr-2 h-4 w-4" />
      Atualizar
    </Button>
  )
}
