"use client"

import { useMemo, useEffect, useState, useCallback } from "react"
import { NetworkList } from "./network-list"
import { SkeletonCard } from "./skeleton-card"
import { useAllUsers } from "@/hooks/allUsers"
import { useConnectionRequests } from "@/lib/api/connections"
import type { UserCreateData } from "@/lib/types/userTypes"
import { ConnectionStatus, RequestType } from "@/lib/types/connectionTypes"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface AsyncNetworkListProps {
  searchQuery: string
  roleFilter: string
  setSelectedUser: (user: UserCreateData) => void
  displayMode: "all" | "connected" | "pending"
}

export function AsyncNetworkList({ searchQuery, roleFilter, setSelectedUser, displayMode }: AsyncNetworkListProps) {
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useAllUsers()
  const {
    useGetRequests,
    useCreateRequest,
    useUpdateRequest,
    useCancelRequest,
    useRemoveConnection,
    useGetUserConnections,
  } = useConnectionRequests()

  const { data: sentRequests, isLoading: isLoadingSent } = useGetRequests(RequestType.SENT)
  const { data: receivedRequests, isLoading: isLoadingReceived } = useGetRequests(RequestType.RECEIVED)
  const { data: userConnections, isLoading: isLoadingConnections } = useGetUserConnections()

  const createRequestMutation = useCreateRequest()
  const updateRequestMutation = useUpdateRequest()
  const cancelRequestMutation = useCancelRequest()
  const removeConnectionMutation = useRemoveConnection()

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const storedUserUid = localStorage.getItem("userUid")
    if (storedUserUid) {
      setCurrentUserId(storedUserUid)
    }
  }, [])

  const isLoading = isLoadingUsers || isLoadingSent || isLoadingReceived || isLoadingConnections

  const connections = useMemo(() => {
    if (!sentRequests || !receivedRequests || !userConnections) return []

    const connectionMap = new Map()

    // Primeiro, mapear as conexões aceitas (maior prioridade)
    userConnections.forEach((id) => {
      connectionMap.set(id, {
        id,
        status: ConnectionStatus.ACCEPTED,
        isSentByMe: false,
      })
    })

    // Depois, adicionar solicitações pendentes apenas se não houver conexão aceita
    sentRequests
      .filter((req) => req.status === ConnectionStatus.PENDING)
      .forEach((req) => {
        if (!connectionMap.has(req.target_id)) {
          connectionMap.set(req.target_id, {
            id: req.target_id,
            status: ConnectionStatus.PENDING,
            isSentByMe: true,
          })
        }
      })

    receivedRequests
      .filter((req) => req.status === ConnectionStatus.PENDING)
      .forEach((req) => {
        if (!connectionMap.has(req.requester_id)) {
          connectionMap.set(req.requester_id, {
            id: req.requester_id,
            status: ConnectionStatus.PENDING,
            isSentByMe: false,
          })
        }
      })

    return Array.from(connectionMap.values())
  }, [sentRequests, receivedRequests, userConnections])

  const filteredUsers = useMemo(() => {
    if (!users) return []
    return users.filter((user: { uid: string | null; nome: string; tipo_usuario: string }) => {
      const isNotCurrentUser = user.uid !== currentUserId
      const matchesSearch = user.nome.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || user.tipo_usuario === roleFilter
      return matchesSearch && matchesRole && isNotCurrentUser
    })
  }, [users, searchQuery, roleFilter, currentUserId])

  const categorizedUsers = useMemo(() => {
    const connected: UserCreateData[] = []
    const pending: UserCreateData[] = []
    const all: UserCreateData[] = []

    filteredUsers.forEach((user: UserCreateData) => {
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
      case "connected":
        return categorizedUsers.connected
      case "pending":
        return categorizedUsers.pending
      default:
        return categorizedUsers.all
    }
  }, [displayMode, categorizedUsers])

  const handleRequestAction = useCallback(
    async (action: "send" | "accept" | "reject" | "cancel" | "remove", targetId: string, user: UserCreateData) => {
      setLoadingActions((prev) => ({ ...prev, [targetId]: true }))
      try {
        if (action === "send") {
          const existingConnection = connections.find((conn) => conn.id === targetId)
          if (existingConnection) {
            console.error("Já existe uma conexão ou solicitação pendente com este usuário")
            return
          }
        }

        switch (action) {
          case "send":
            await createRequestMutation.mutateAsync(targetId)
            break
          case "accept":
          case "reject":
            await updateRequestMutation.mutateAsync({
              userId: targetId,
              status: action === "accept" ? ConnectionStatus.ACCEPTED : ConnectionStatus.REJECTED,
            })
            break
          case "cancel":
            await cancelRequestMutation.mutateAsync(targetId)
            break
          case "remove":
            await removeConnectionMutation.mutateAsync({
              userId: targetId,
              userType: user.tipo_usuario,
            })
            break
          default:
            console.error("Invalid action:", action)
        }
      } catch (error) {
        console.error(`Error performing ${action} action:`, error)
      } finally {
        setLoadingActions((prev) => ({ ...prev, [targetId]: false }))
      }
    },
    [createRequestMutation, updateRequestMutation, cancelRequestMutation, removeConnectionMutation, connections],
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.div
          className="flex items-center justify-center gap-3 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="text-gray-600 font-medium">Carregando rede de conexões...</span>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <SkeletonCard />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (usersError)
    return (
      <motion.div
        className="text-center mt-12 p-8 bg-red-50 rounded-2xl border border-red-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
        <p className="text-red-600">{usersError.message}</p>
      </motion.div>
    )

  return (
    <NetworkList
      users={displayUsers}
      connections={connections}
      currentUserId={currentUserId || ""}
      handleRequestAction={handleRequestAction}
      setSelectedUser={setSelectedUser}
      viewOption={displayMode}
      loadingActions={loadingActions}
    />
  )
}
