'use client'

import { usePathname } from 'next/navigation'
import { MainSidebar } from './sidebar'

export function SidebarWrapper() {
  const pathname = usePathname()

  // List of routes where the sidebar should not be shown
  const excludedRoutes = ['/linka/login', '/linka/cadastro']

  // Check if the current path starts with '/linka' and is not in the excluded routes
  const showSidebar =
    pathname?.startsWith('/linka') && !excludedRoutes.includes(pathname)

  if (!showSidebar) {
    return null
  }

  return (
    <div className="h-screen">
      <MainSidebar />
    </div>
  )
}
