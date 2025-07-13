'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetTitle, SheetPortal } from '@/components/ui/sheet'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { MainSidebar } from '@/components/sidebar'
import { SidebarWrapper } from '@/components/sidebar-wrapper'
import PrivateRoute from '@/components/private_route'
import { Providers } from '@/components/providers'
import { NotificationsProvider } from '@/lib/context/NotificationsContext'
import { cn } from '@/lib/utils'

interface PlatformLayoutClientProps {
  children: React.ReactNode
}

// Componente customizado do SheetOverlay com animações
const CustomSheetOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
  />
)

// Componente customizado do SheetContent sem o X automático
const CustomSheetContent = ({ 
  children, 
  className, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>) => (
  <SheetPortal>
    <CustomSheetOverlay />
    <SheetPrimitive.Content
      className={cn(
        'fixed inset-y-0 left-0 z-50 h-full w-[280px] bg-white border-r border-purple-100 shadow-xl transition-transform duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        className
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
)

export default function PlatformLayoutClient({
  children,
}: PlatformLayoutClientProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const isLandingPage = pathname === '/'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fechar sidebar quando mudar de rota
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  if (isLandingPage) {
    return (
      <Providers>
        <NotificationsProvider>{children}</NotificationsProvider>
      </Providers>
    )
  }

  return (
    <Providers>
      <NotificationsProvider>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar Desktop */}
          {isMounted && <SidebarWrapper />}
          
          {/* Mobile Menu Button */}
          {isMounted && (
            <AnimatePresence>
              <motion.div 
                className="block md:hidden fixed top-4 left-4 z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/95 backdrop-blur-sm shadow-lg border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 hover:shadow-purple-500/25"
                    >
                      <motion.div
                        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isOpen ? (
                          <X className="h-4 w-4 text-purple-600" />
                        ) : (
                          <Menu className="h-4 w-4 text-purple-600" />
                        )}
                      </motion.div>
                      <span className="sr-only">
                        {isOpen ? 'Fechar menu' : 'Abrir menu'}
                      </span>
                    </Button>
                  </SheetTrigger>
                  <CustomSheetContent>
                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      <MainSidebar onClose={() => setIsOpen(false)} />
                    </motion.div>
                  </CustomSheetContent>
                </Sheet>
              </motion.div>
            </AnimatePresence>
          )}
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="md:pl-0 pl-0" // Removido padding left para mobile
            >
              <PrivateRoute>{children}</PrivateRoute>
            </motion.div>
          </main>
        </div>
      </NotificationsProvider>
    </Providers>
  )
} 