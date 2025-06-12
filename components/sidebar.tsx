/* eslint-disable @typescript-eslint/no-explicit-any */
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
  HandshakeIcon,
  Building2,
  X,
  CalendarCheck,
  ChevronDown,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/context/AuthContext'
import { useNotifications } from '@/lib/context/NotificationsContext'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

interface MainSidebarProps
  extends React.ComponentPropsWithoutRef<typeof Sidebar> {
  onClose?: () => void
}

interface IconProps {
  className?: string
  [key: string]: any
}

interface SidebarNavItemProps {
  className?: string
  title: string
  items: Array<{
    name: string
    icon: React.ComponentType<IconProps>
    href: string
  }>
}

export function MainSidebar({ className, onClose }: MainSidebarProps) {
  const [isAdmin, setIsAdmin] = React.useState(false)
  const router = useRouter()
  const { hasUnread } = useNotifications()
  const { isAuthenticated, logout } = useAuth()
  const [isMounted, setIsMounted] = React.useState(false)

  const handleLogout = async () => {
    try {
      router.push('/login')
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  React.useEffect(() => {
    setIsMounted(true)
    const admin: boolean = localStorage.getItem('userIsAdmin') === 'true'
    setIsAdmin(admin)
  }, [])

  const vitrinesItems = [
    { name: 'Negócios', icon: Briefcase, href: '/negocios' },
    { name: 'Iniciativas', icon: HandshakeIcon, href: '/iniciativas' },
  ]

  const nextUpdateItems = [
    { name: 'Laboratórios', icon: Pickaxe, href: '' },
    { name: 'Competências', icon: GraduationCap, href: '' },
  ]

  const comunidadeItems = React.useMemo(
    () => [
      { name: 'Rede', icon: Network, href: '/rede' },
      {
        name: 'Notificações',
        icon: ({ className, ...props }: IconProps) => (
          <div className="relative">
            <BellIcon className={className} {...props} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
        ),
        href: '/notificacoes',
      },
      { name: 'Eventos', icon: CalendarCheck, href: '/eventos' },
    ],
    [hasUnread],
  )

  const adminItems = [
    {
      name: 'Painel de Controle',
      icon: GitPullRequestArrow,
      href: '/administrativo',
    },
    {
      name: 'Administrar Negócios',
      icon: Building2,
      href: '/administrativo/negocios',
    },
    {
      name: 'Administrar Iniciativas',
      icon: HandshakeIcon,
      href: '/administrativo/iniciativas',
    },
    {
      name: 'Administrar Eventos',
      icon: CalendarCheck,
      href: '/administrativo/eventos',
    },
  ]

  const personalItems = [
    { name: 'Meus Negócios', icon: Building2, href: '/meus-negocios' },
    { name: 'Meus Eventos', icon: CalendarCheck, href: '/meus-eventos' },
    {
      name: 'Minhas Iniciativas',
      icon: HandshakeIcon,
      href: '/minhas-iniciativas',
    },
    { name: 'Perfil do Usuário', icon: UserCircle, href: '/perfil' },
  ]

  const SidebarNavItem = React.forwardRef<HTMLDivElement, SidebarNavItemProps>(
    ({ className, title, items, ...props }, ref) => {
      const [isOpen, setIsOpen] = React.useState(true)

      return (
        <div ref={ref} className={cn('', className)} {...props}>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                {title}
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform duration-200', {
                    '-rotate-180': isOpen,
                  })}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {items.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant="ghost"
                  className="w-full justify-start relative"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    },
  )
  SidebarNavItem.displayName = 'SidebarNavItem'

  return (
    <Sidebar
      className={cn(
        'border-r h-full flex flex-col w-full md:max-w-[280px]',
        className,
      )}
    >
      <SidebarHeader className="border-b px-4 py-3 flex justify-between items-center">
        <Link href="/negocios" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">LINKA</span>
        </Link>
        {isMounted && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
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
            <Link href="/login">
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
