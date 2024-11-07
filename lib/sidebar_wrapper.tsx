'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/app/ui/sidebar'

export default function SidebarWrapper() {
  const pathname = usePathname()
  const showSidebar = pathname?.startsWith('/linka')

  return showSidebar ? <Sidebar/> : null
}
