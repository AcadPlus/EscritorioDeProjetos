'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  BarChart,
  Network,
  UserCircle,
  LogOut,
  LogIn,
  Home,
  ChevronRight,
  Menu,
  GitPullRequestArrow,
} from 'lucide-react'

const handleLogout = () => {
  localStorage.removeItem('token') // Remove o token do localStorage
}

const linkaItems = [
  { name: 'Vitrines', icon: BarChart, href: 'dashboard' },
  { name: 'Rede', icon: Network, href: 'network' },
  { name: 'Painel de Controle', icon: GitPullRequestArrow, href: 'admin' },
]

const menuItems = [
  { name: 'Perfil do Usuário', icon: UserCircle, href: 'profile' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verifica se há um token no localStorage
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const onLogout = () => {
    handleLogout()
    setIsLoggedIn(false)
    router.push('/linka/login')
  }

  const renderMenuItems = (items) =>
    items.map((item) => (
      <Button
        key={item.name}
        variant="ghost"
        className="w-full justify-start"
        asChild
      >
        <Link href={item.href}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.name}
        </Link>
      </Button>
    ))

  const SidebarContent = (
    <ScrollArea className="h-full py-6 pl-6 pr-6 bg-white">
      <div className="flex items-center mb-6">
        <BarChart className="h-6 w-6 text-blue-500 mr-2" />
        <h1 className="text-2xl font-bold">LINKA</h1>
      </div>
      <nav className="space-y-2">
        <div className="pt-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">LINK@!</h2>
        </div>
        {renderMenuItems(linkaItems)}
        <div className="pt-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Conta</h2>
        </div>
        {renderMenuItems(menuItems)}
        <div className="pt-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Ações</h2>
        </div>
        {isLoggedIn ? (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/linka/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        )}
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/" rel="noopener noreferrer">
            <Home className="mr-2 h-4 w-4" />
            Voltar pro EP
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        </Button>
      </nav>
    </ScrollArea>
  )

  return (
    <>
      <aside className="hidden shadow-sm sticky top-0 z-10 bg-white md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {SidebarContent}
      </aside>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden  fixed top-4 right-4 z-40"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gray-200  p-0">
          <SheetHeader className="px-6 py-4">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navegue pelas diferentes seções do dashboard.
            </SheetDescription>
          </SheetHeader>
          {SidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}
