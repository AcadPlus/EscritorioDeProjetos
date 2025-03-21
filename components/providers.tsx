'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthProvider } from '@/lib/context/AuthContext'
import { RouteGuard } from './RouteGuard'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouteGuard>{children}</RouteGuard>
      </AuthProvider>
    </QueryClientProvider>
  )
}
