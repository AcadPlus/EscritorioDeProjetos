'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <motion.div
      ref={ref}
      className={cn('flex flex-col h-full bg-white shadow-sm', className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
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
    className={cn('flex flex-col space-y-4 px-4 flex-1 overflow-y-auto', className)}
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

interface SidebarNavItemProps {
  className?: string
  title: string
  items: Array<{
    name: string
    icon: React.ComponentType<{ className?: string }>
    href: string
  }>
}

const SidebarNavItem = React.forwardRef<HTMLDivElement, SidebarNavItemProps>(
  ({ className, title, items, ...props }, ref) => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(true)

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-gray-700 hover:text-purple-700 hover:bg-purple-50/50 transition-all duration-200 font-medium"
            >
              {title}
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200 text-purple-600', {
                  '-rotate-180': isOpen,
                })}
              />
            </Button>
          </CollapsibleTrigger>
          <AnimatePresence>
            {isOpen && (
              <CollapsibleContent asChild>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 mt-2"
                >
                  {items.map((item, index) => {
                    const isActive = pathname === item.href
                    const isDisabled = !item.href
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          asChild={!isDisabled}
                          variant="ghost"
                          className={cn(
                            'w-full justify-start relative group transition-all duration-200 text-sm',
                            isActive && 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 font-medium',
                            !isActive && !isDisabled && 'hover:bg-purple-50/50 hover:text-purple-700',
                            isDisabled && 'opacity-50 cursor-not-allowed text-gray-400'
                          )}
                          disabled={isDisabled}
                        >
                          {isDisabled ? (
                            <div className="flex items-center">
                              <item.icon className="mr-3 h-4 w-4" />
                              <span>{item.name}</span>
                            </div>
                          ) : (
                            <Link href={item.href} className="flex items-center w-full">
                              <item.icon className={cn(
                                "mr-3 h-4 w-4 transition-colors duration-200",
                                isActive && "text-purple-600"
                              )} />
                              <span>{item.name}</span>
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-violet-500 rounded-l-full"
                                />
                              )}
                            </Link>
                          )}
                        </Button>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
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
