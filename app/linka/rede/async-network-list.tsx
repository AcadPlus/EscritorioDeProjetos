/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useMemo, useEffect, useState, useCallback } from 'react'
import { NetworkList } from './network-list'
import { SkeletonCard } from './skeleton-card'
import { useAllUsers } from '@/hooks/allUsers'
import { useConnectionRequests } from '@/lib/api/connections'
import { type UserCreateData, UserType } from '@/lib/types/userTypes'
import { ConnectionStatus, RequestType } from '@/lib/types/connectionTypes'

interface AsyncNetworkListProps {
  searchQuery: string
  roleFilter: string
  setSelectedUser: (user: UserCreateData) => void
  displayMode: 'all' | 'connected' | 'pending'
}

export function AsyncNetworkList({
  searchQuery,
  roleFilter,
  setSelectedUser,
  displayMode,
}: AsyncNetworkListProps) {
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useAllUsers()
  const {
    useGetRequests,
    useCreateRequest,
    useUpdateRequest,
    useCancelRequest,
    useRemoveConnection,
    useGetUserConnections,
  } = useConnectionRequests()

  const { data: sentRequests, isLoading: isLoadingSent } = useGetRequests(
    RequestType.SENT,
  )
  const { data: receivedRequests, isLoading: isLoadingReceived } =
    useGetRequests(RequestType.RECEIVED)
  const { data: userConnections, isLoading: isLoadingConnections } =
    useGetUserConnections()

  const createRequestMutation = useCreateRequest()
  const updateRequestMutation = useUpdateRequest()
  const cancelRequestMutation = useCancelRequest()
  const removeConnectionMutation = useRemoveConnection()

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {},
  )

  useEffect(() => {
    const storedUserUid = localStorage.getItem('userUid')
    if (storedUserUid) {
      setCurrentUserId(storedUserUid)
    }
  }, [])

  const isLoading =
    isLoadingUsers || isLoadingSent || isLoadingReceived || isLoadingConnections

  const connections = useMemo(() => {
    if (!sentRequests || !receivedRequests || !userConnections) return []

    return [
      ...sentRequests.map((req) => ({
        id: req.target_id,
        status: req.status,
        isSentByMe: true,
      })),
      ...receivedRequests.map((req) => ({
        id: req.requester_id,
        status: req.status,
        isSentByMe: false,
      })),
      ...userConnections.map((id) => ({
        id,
        status: ConnectionStatus.ACCEPTED,
        isSentByMe: false,
      })),
    ]
  }, [sentRequests, receivedRequests, userConnections])

  const filteredUsers = useMemo(() => {
    return users
      ? users.filter((user) => {
          const isNotCurrentUser = user.uid !== currentUserId
          const matchesSearch = user.nome
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
          const matchesRole =
            roleFilter === 'all' || user.tipo_usuario === roleFilter
          return matchesSearch && matchesRole && isNotCurrentUser
        })
      : []
  }, [users, searchQuery, roleFilter, currentUserId])

  const categorizedUsers = useMemo(() => {
    const connected: UserCreateData[] = []
    const pending: UserCreateData[] = []
    const all: UserCreateData[] = []

    filteredUsers.forEach((user) => {
      const connection = connections.find((conn) => conn.id === user.uid)
      if (connection) {
        if (connection.status === ConnectionStatus.ACCEPTED) {
          connected.push(user)
        } else if (connection.status === ConnectionStatus.PENDING) {
          pending.push(user)
        }
      }
      all.push(user)
    })

    return { connected, pending, all }
  }, [filteredUsers, connections])

  const displayUsers = useMemo(() => {
    switch (displayMode) {
      case 'connected':
        return categorizedUsers.connected
      case 'pending':
        return categorizedUsers.pending
      default:
        return categorizedUsers.all
    }
  }, [displayMode, categorizedUsers])

  const handleRequestAction = useCallback(
    async (
      action: 'send' | 'accept' | 'reject' | 'cancel' | 'remove',
      targetId: string,
      user: UserCreateData,
    ) => {
      setLoadingActions((prev) => ({ ...prev, [targetId]: true }))
      try {
        switch (action) {
          case 'send':
            await createRequestMutation.mutateAsync(targetId)
            break
          case 'accept':
          case 'reject':
            await updateRequestMutation.mutateAsync({
              userId: targetId,
              status:
                action === 'accept'
                  ? ConnectionStatus.ACCEPTED
                  : ConnectionStatus.REJECTED,
            })
            break
          case 'cancel':
            await cancelRequestMutation.mutateAsync(targetId)
            break
          case 'remove':
            await removeConnectionMutation.mutateAsync({
              userId: targetId,
              userType: user.tipo_usuario,
            })
            break
          default:
            console.error('Invalid action:', action)
        }
      } catch (error) {
        console.error(`Error performing ${action} action:`, error)
      } finally {
        setLoadingActions((prev) => ({ ...prev, [targetId]: false }))
      }
    },
    [
      createRequestMutation,
      updateRequestMutation,
      cancelRequestMutation,
      removeConnectionMutation,
    ],
  )

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (usersError)
    return (
      <div className="text-center mt-8 text-red-500">
        Erro ao carregar dados: {usersError.message}
      </div>
    )

  return (
    <NetworkList
      users={displayUsers}
      connections={connections}
      currentUserId={currentUserId || ''}
      handleRequestAction={handleRequestAction}
      setSelectedUser={setSelectedUser}
      viewOption={displayMode}
      loadingActions={loadingActions}
    />
  )
}
