"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface BusinessRefreshButton {
  handleRefreshButtonClick: () => Promise<void> | void
}

export function BusinessRefresh({ handleRefreshButtonClick }: BusinessRefreshButton) {
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
      className="bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 w-full sm:w-auto"
      disabled={isRefreshing}
    >
      <RefreshCcw
        className={cn("h-4 w-4 transition-transform", {
          "animate-spin": isRefreshing,
        })}
      />
      
    </Button>
  )
}
