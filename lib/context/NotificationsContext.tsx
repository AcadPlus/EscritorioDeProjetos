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

// Função para throttle - limita a frequência de chamadas
const throttle = (func: (...args: any[]) => any, delay: number) => {
  let lastCall = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func(...args)
    }
  }
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const { useGetNotifications } = useNotificationsApi()
  const { data: notifications = [], refetch } = useGetNotifications()
  const [unreadCount, setUnreadCount] = useState(0)
  const [hasUnread, setHasUnread] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastRefetchTime = useRef<number>(0)

  // Throttled refetch function - no máximo uma chamada a cada 10 segundos
  const throttledRefetch = useCallback(
    throttle(async (options?: RefetchOptions) => {
      if (!isAuthenticated) {
        return
      }
      await refetch(options)
    }, 10000),
    [refetch, isAuthenticated],
  )

  // Efeito para atualizar contadores de notificações não lidas
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0)
      setHasUnread(false)
      return
    }
    const unreadNotifications = notifications.filter(
      (notification) => !notification.lida,
    )
    setUnreadCount(unreadNotifications.length)
    setHasUnread(unreadNotifications.length > 0)
  }, [notifications, isAuthenticated])

  // Efeito separado para configurar o polling apenas uma vez
  useEffect(() => {
    // Limpar qualquer intervalo existente antes de criar um novo
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    // Só configura o polling se o usuário estiver autenticado
    if (!isAuthenticated) return

    // Configurar polling a cada 60 segundos (aumentado de 30 para 60)
    pollingIntervalRef.current = setInterval(() => {
      const now = Date.now()
      // Verifica se passaram pelo menos 10 segundos desde a última chamada
      if (now - lastRefetchTime.current >= 10000) {
        lastRefetchTime.current = now
        refetch()
      }
    }, 5000)

    // Limpar o intervalo quando o componente for desmontado
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [refetch, isAuthenticated]) // Adicionado isAuthenticated como dependência

  const value = {
    hasUnread,
    unreadCount,
    notifications: isAuthenticated ? notifications : [],
    refetch: throttledRefetch, // Usando a versão throttled
  }

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
