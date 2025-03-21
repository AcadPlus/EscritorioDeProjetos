'use client'

import { usePathname } from 'next/navigation'
import { MainSidebar } from '@/components/sidebar'
import { useEffect, useState } from 'react'

export function SidebarWrapper() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // List of routes where the sidebar should not be shown
  const excludedRoutes = ['/linka/login', '/linka/cadastro']

  // Check if the current path starts with '/linka' and is not in the excluded routes
  const showSidebar =
    pathname?.startsWith('/linka') && !excludedRoutes.includes(pathname)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!showSidebar || !isMounted) {
    return null
  }

  return (
    <div className="hidden md:block md:sticky md:top-0 md:h-screen">
      <MainSidebar />
    </div>
  )
}
