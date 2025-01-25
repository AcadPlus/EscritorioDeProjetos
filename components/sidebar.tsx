'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Network,
  UserCircle,
  Briefcase,
  LogOut,
  LogIn,
  Home,
  ChevronRight,
  GitPullRequestArrow,
  GraduationCap,
  Pickaxe,
  BellIcon,
  BriefcaseBusinessIcon,
  Handshake,
  HandshakeIcon,
  Building2,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/context/AuthContext'

interface MainSidebarProps
  extends React.ComponentPropsWithoutRef<typeof Sidebar> {}

export function MainSidebar({ className }: MainSidebarProps) {
  const [isAdmin, setIsAdmin] = React.useState(false)
  const router = useRouter()

  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    try {
      router.push('/linka/login')
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  React.useEffect(() => {
    const admin = localStorage.getItem('admin')
    setIsAdmin(!!admin)
  }, [])

  const vitrinesItems = [
    { name: 'Negócios', icon: Briefcase, href: '/linka/negocios' },
  ]

  const nextUpdateItems = [
    {
      name: 'Laboratórios',
      icon: Pickaxe,
      href: '',
    },
    {
      name: 'Competências',
      icon: GraduationCap,
      href: '',
    },
    {
      name: 'Notificações',
      icon: BellIcon,
      href: '',
    },
  ]
  const comunidadeItems = [{ name: 'Rede', icon: Network, href: '/linka/rede' }]
  const adminItems = [
    {
      name: 'Painel de Controle',
      icon: GitPullRequestArrow,
      href: '/linka/administrativo',
    },
  ]
  const personalItems = [
    { name: 'Meus Negócios', icon: Building2, href: '/linka/meus-negocios' },
    { name: 'Iniciativas', icon: HandshakeIcon, href: '/linka/perfil' },
    { name: 'Perfil do Usuário', icon: UserCircle, href: '/linka/perfil' },
  ]

  return (
    <Sidebar
      className={cn(
        'border-r h-full flex flex-col w-full max-w-[250px] md:w-64',
        className,
      )}
    >
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">LINKA</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow overflow-y-auto overflow-x-hidden">
        <SidebarNav className="space-y-2 w-full">
          <SidebarNavItem title="Vitrines" items={vitrinesItems} />
          <SidebarNavItem title="Comunidade" items={comunidadeItems} />
          <SidebarNavItem title="Pessoal" items={personalItems} />
          <SidebarNavItem title="Em breve" items={nextUpdateItems} />
          {isAdmin && (
            <SidebarNavItem title="Administrativo" items={adminItems} />
          )}
        </SidebarNav>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        {isAuthenticated ? (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/linka/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login e Cadastro
            </Link>
          </Button>
        )}
        <Button variant="outline" className="mt-2 w-full justify-start" asChild>
          <Link href="/" rel="noopener noreferrer">
            <Home className="mr-2 h-4 w-4" />
            Retornar ao EP
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
