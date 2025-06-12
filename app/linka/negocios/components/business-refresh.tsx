import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCcwIcon } from 'lucide-react'
import { cn } from '@/lib/utils' // Caso tenha uma função utilitária para classes condicionais

interface BusinessRefreshButton {
  handleRefreshButtonClick: () => Promise<void> | void
}

export function BusinessRefresh({
  handleRefreshButtonClick,
}: BusinessRefreshButton) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleClick = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    await handleRefreshButtonClick()
    setIsRefreshing(false)
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="bg-white w-full sm:w-auto"
      disabled={isRefreshing}
    >
      <RefreshCcwIcon
        className={cn('mr-2 h-4 w-4 transition-transform', {
          'animate-spin': isRefreshing,
        })}
      />
      Atualizar
    </Button>
  )
}
