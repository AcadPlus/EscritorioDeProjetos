'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/app/ui/footer'

export default function FooterWrapper() {
  const pathname = usePathname()
  const showFooter = !pathname?.startsWith('/linka')

  return showFooter ? <Footer /> : null
}
