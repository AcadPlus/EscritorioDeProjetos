'use client'

import { usePathname } from 'next/navigation'
import { MainSidebar } from '@/components/sidebar'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Briefcase, Network, Bell, UserCircle, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'

export function SidebarWrapper() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Lista de rotas onde a sidebar NÃO deve ser mostrada
  const excludedRoutes = ['/login', '/cadastro']

  // A sidebar deve ser mostrada se a rota ATUAL NÃO ESTIVER na lista de excluídas
  const showSidebar = !excludedRoutes.includes(pathname)

  useEffect(() => {
    setIsMounted(true)
    // Carregar estado do localStorage
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Salvar estado no localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
    }
  }, [isCollapsed, isMounted])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = async () => {
    try {
      router.push('/login')
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Principais rotas para a sidebar colapsada
  const mainRoutes = [
    { 
      icon: Briefcase, 
      href: '/negocios', 
      title: 'Negócios',
      isActive: pathname === '/negocios'
    },
    { 
      icon: Network, 
      href: '/rede', 
      title: 'Rede',
      isActive: pathname === '/rede'
    },
    { 
      icon: Bell, 
      href: '/notificacoes', 
      title: 'Notificações',
      isActive: pathname === '/notificacoes'
    },
    { 
      icon: UserCircle, 
      href: '/perfil', 
      title: 'Perfil',
      isActive: pathname === '/perfil'
    }
  ]

  if (!showSidebar || !isMounted) {
    return null
  }

  return (
    <>
      <div className="hidden md:flex md:sticky md:top-0 md:h-screen relative">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <MainSidebar />
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 60, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white border-r border-purple-100 shadow-sm flex flex-col items-center py-4 overflow-hidden"
            >
              {/* Logo colapsado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Link href="/negocios">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform">
                    L
                  </span>
                </Link>
              </motion.div>

              {/* Ícones principais */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-2"
              >
                {mainRoutes.map((route, index) => (
                  <motion.div
                    key={route.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className={`h-10 w-10 relative transition-all duration-200 ${
                        route.isActive 
                          ? 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700' 
                          : 'hover:bg-purple-50 hover:text-purple-700'
                      }`}
                      title={route.title}
                    >
                      <Link href={route.href}>
                        <route.icon className="h-5 w-5" />
                        {route.isActive && (
                          <motion.div
                            layoutId="collapsedActiveIndicator"
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-violet-500 rounded-l-full"
                          />
                        )}
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Botão de logout colapsado */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-auto"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-10 w-10 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botão de toggle - agora fora do container relativo */}
      <motion.div
        className="hidden md:block fixed left-[calc(280px-20px)] top-12 z-[9999] transition-all duration-300"
        style={{
          left: isCollapsed ? 'calc(60px - 20px)' : 'calc(280px - 20px)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="h-10 w-10 rounded-full bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-300 shadow-xl hover:shadow-purple-500/25 transition-all duration-200"
          title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-purple-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-purple-600" />
          )}
        </Button>
      </motion.div>
    </>
  )
}
