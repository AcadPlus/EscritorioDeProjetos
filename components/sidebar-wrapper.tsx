'use client'

import { usePathname } from 'next/navigation'
import { MainSidebar } from '@/components/sidebar'
import { useEffect, useState } from 'react'

export function SidebarWrapper() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // Lista de rotas onde a sidebar NÃO deve ser mostrada
  // Atualizado para não usar mais /linka
  const excludedRoutes = ['/login', '/cadastro'] // Assumindo que /cadastro pode existir

  // A sidebar deve ser mostrada se a rota ATUAL NÃO ESTIVER na lista de excluídas.
  // Removida a verificação pathname?.startsWith('/linka')
  const showSidebar = !excludedRoutes.includes(pathname)

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
