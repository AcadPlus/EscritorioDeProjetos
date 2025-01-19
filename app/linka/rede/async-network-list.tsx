'use client'

import { useMemo, useEffect, useState } from 'react'
import { NetworkList } from './network-list'
import { SkeletonCard } from './skeleton-card'
import { useAllUsers } from '@/hooks/allUsers'
import { useRequests } from '@/hooks/useRequests'
import { UserCreateData, UserType, PesquisadorCreate, EstudanteCreate, ExternoCreate } from '@/lib/types/userTypes'

interface AsyncNetworkListProps {
  searchQuery: string
  roleFilter: string
  institutionFilter: string
  setSelectedUser: (user: UserCreateData) => void
  displayMode: 'all' | 'connected' | 'pending'
}

export function AsyncNetworkList({
  searchQuery,
  roleFilter,
  institutionFilter,
  setSelectedUser,
  displayMode,
}: AsyncNetworkListProps) {
  const { users, isLoading, error } = useAllUsers()
  const { requests, handleRequestAction, handleRemoveRequest, decodedToken } =
    useRequests()
  const [authUserUid, setAuthUserUid] = useState<string | null>(null)

  useEffect(() => {
    const storedUserUid = localStorage.getItem('userUid')
    if (storedUserUid) {
      setAuthUserUid(storedUserUid)
    }
  }, [])

  const getInstitution = (user: UserCreateData): string => {
    switch (user.tipo_usuario) {
      case UserType.PESQUISADOR:
      case UserType.ESTUDANTE:
        return (user as PesquisadorCreate | EstudanteCreate).campus
      case UserType.EXTERNO:
        return (user as ExternoCreate).empresa || ''
      default:
        return ''
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.email !== decodedToken &&
        user.nome.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (roleFilter === 'all' || user.tipo_usuario === roleFilter) &&
        (institutionFilter === 'all' ||
          getInstitution(user) === institutionFilter) &&
        (!authUserUid || (user as any).uid_admin !== authUserUid)
    )
  }, [users, decodedToken, searchQuery, roleFilter, institutionFilter, authUserUid])

  const connectedUsers = useMemo(
    () =>
      filteredUsers.filter(
        (user) => requests[user.email] && requests[user.email][0] === 'accepted',
      ),
    [filteredUsers, requests],
  )

  const pendingUsers = useMemo(
    () =>
      filteredUsers.filter(
        (user) => requests[user.email] && requests[user.email][0] === 'pending',
      ),
    [filteredUsers, requests],
  )

  const displayUsers = useMemo(() => {
    switch (displayMode) {
      case 'connected':
        return connectedUsers
      case 'pending':
        return pendingUsers
      default:
        return filteredUsers
    }
  }, [displayMode, connectedUsers, pendingUsers, filteredUsers])

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (error)
    return (
      <div className="text-center mt-8 text-red-500">
        Erro ao carregar usuários: {error.message}
      </div>
    )

  return (
    <NetworkList
      users={displayUsers}
      requests={requests}
      decodedToken={decodedToken}
      handleRequestAction={handleRequestAction}
      handleRemoveRequest={handleRemoveRequest}
      setSelectedUser={setSelectedUser}
    />
  )
}

