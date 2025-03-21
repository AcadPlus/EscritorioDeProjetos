'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col h-full bg-white', className)}
      {...props}
    >
      {children}
    </div>
  )
})
Sidebar.displayName = 'Sidebar'

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 py-4 px-4', className)}
    {...props}
  />
))
SidebarHeader.displayName = 'SidebarHeader'

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-4 px-4', className)}
    {...props}
  />
))
SidebarContent.displayName = 'SidebarContent'

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 px-4', className)}
    {...props}
  />
))
SidebarFooter.displayName = 'SidebarFooter'

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2', className)}
    {...props}
  />
))
SidebarNav.displayName = 'SidebarNav'

interface SidebarNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  items: {
    name: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    href: string
  }[]
}

const SidebarNavItem = React.forwardRef<HTMLDivElement, SidebarNavItemProps>(
  ({ className, title, items, ...props }, ref) => {
    const pathname = usePathname()
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
                className={cn(
                  'w-full justify-start',
                  pathname === item.href && 'bg-muted font-medium',
                )}
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

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
}
