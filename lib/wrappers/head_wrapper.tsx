'use client'

import { usePathname } from 'next/navigation'
import Header from '@/app/ui/header'

export default function HeaderWrapper() {
  const pathname = usePathname()
  const showHeader = !pathname?.startsWith('/linka')

  return showHeader ? <Header /> : null
}
