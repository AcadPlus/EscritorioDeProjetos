'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MainSidebar } from '@/components/sidebar'
import { SidebarWrapper } from '@/components/sidebar-wrapper'
import PrivateRoute from '@/components/private_route'
import { Providers } from '@/components/providers' // Mantido aqui para envolver a lógica de PrivateRoute
import { NotificationsProvider } from '@/lib/context/NotificationsContext' // Mantido aqui

interface PlatformLayoutClientProps {
  children: React.ReactNode
}

export default function PlatformLayoutClient({ children }: PlatformLayoutClientProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Rotas públicas atualizadas (sem /linka)
  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/' || 
    pathname?.startsWith('/negocios') || 
    pathname?.startsWith('/iniciativas')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const layoutContent = (
    <div className="flex min-h-screen bg-gray-100">
      {isMounted && <SidebarWrapper />}
      {isMounted && (
        <div className="block md:hidden fixed top-5 right-4 z-50">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-sm"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 border-r">
              <MainSidebar onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  )

  // Providers e NotificationsProvider envolvem a lógica de PrivateRoute e o conteúdo
  return (
    <Providers>
      <NotificationsProvider>
        {isPublicRoute ? layoutContent : <PrivateRoute>{layoutContent}</PrivateRoute>}
      </NotificationsProvider>
    </Providers>
  )
} 