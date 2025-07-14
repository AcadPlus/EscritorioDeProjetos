/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import { useNotificationsApi } from '@/lib/api/notifications'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { useAuth } from './AuthContext'

interface NotificationsContextType {
  hasUnread: boolean
  unreadCount: number
  notifications: any[]
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any[], Error>>
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined)

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const { useGetNotifications } = useNotificationsApi()
  const { data: notifications = [], refetch } = useGetNotifications()
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Memoizar as notificações para evitar re-renderizações desnecessárias
  const memoizedNotifications = useMemo(() => {
    return isAuthenticated ? notifications : []
  }, [notifications, isAuthenticated])

  // Memoizar contadores para evitar recalcular a cada render
  const { unreadCount, hasUnread } = useMemo(() => {
    if (!isAuthenticated) {
      return { unreadCount: 0, hasUnread: false }
    }
    
    const unreadNotifications = memoizedNotifications.filter(
      (notification) => !notification.lida,
    )
    
    return {
      unreadCount: unreadNotifications.length,
      hasUnread: unreadNotifications.length > 0,
    }
  }, [memoizedNotifications, isAuthenticated])

  // Throttled refetch com intervalo maior
  const throttledRefetch = useCallback(
    async (options?: RefetchOptions) => {
      if (!isAuthenticated) return
      await refetch(options)
    },
    [refetch, isAuthenticated],
  )

  // Polling otimizado - apenas uma vez e com intervalo maior
  useEffect(() => {
    // Limpar intervalo existente
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    // Só configura polling se autenticado
    if (!isAuthenticated) return

    // Polling menos agressivo: a cada 30 segundos
    pollingIntervalRef.current = setInterval(() => {
      refetch()
    }, 30000) // Aumentado de 5000 para 30000

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [isAuthenticated]) // Removido refetch das dependências para evitar re-criação

  // Memoizar o valor do contexto
  const value = useMemo(() => ({
    hasUnread,
    unreadCount,
    notifications: memoizedNotifications,
    refetch: throttledRefetch,
  }), [hasUnread, unreadCount, memoizedNotifications, throttledRefetch])

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider',
    )
  }
  return context
}
