"use client"

import { AnimatePresence, motion } from "framer-motion"
import { NetworkCard } from "./network-card"
import { Users, Search, UserX } from "lucide-react"
import type { UserCreateData } from "@/lib/types/userTypes"
import type { ConnectionStatus } from "@/lib/types/connectionTypes"

interface NetworkListProps {
  users: UserCreateData[]
  connections: Array<{
    id: string
    status: ConnectionStatus
    isSentByMe: boolean
  }>
  currentUserId: string
  handleRequestAction: (
    action: "send" | "accept" | "reject" | "cancel" | "remove",
    targetId: string,
    user: UserCreateData,
  ) => void
  setSelectedUser: (user: UserCreateData) => void
  viewOption: "all" | "pending" | "connected"
  loadingActions: Record<string, boolean>
}

export function NetworkList({
  users,
  connections,
  currentUserId,
  handleRequestAction,
  setSelectedUser,
  viewOption,
  loadingActions,
}: NetworkListProps) {
  if (!users || users.length === 0) {
    const getEmptyStateContent = () => {
      switch (viewOption) {
        case "connected":
          return {
            icon: <Users className="h-12 w-12 text-purple-400" />,
            title: "Nenhuma conexão ainda",
            description: "Você ainda não tem conexões. Explore a aba 'Todos' para encontrar pessoas interessantes!",
          }
        case "pending":
          return {
            icon: <Search className="h-12 w-12 text-purple-400" />,
            title: "Nenhuma solicitação pendente",
            description: "Não há solicitações de conexão pendentes no momento.",
          }
        default:
          return {
            icon: <UserX className="h-12 w-12 text-purple-400" />,
            title: "Nenhum usuário encontrado",
            description: "Tente ajustar os filtros de busca ou termos de pesquisa.",
          }
      }
    }

    const emptyState = getEmptyStateContent()

    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          {emptyState.icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{emptyState.title}</h3>
        <p className="text-gray-600 max-w-md mx-auto">{emptyState.description}</p>
      </motion.div>
    )
  }

  const getConnectionStatus = (userId: string): { status: ConnectionStatus | "none"; isSentByMe: boolean } => {
    const connection = connections.find((conn) => conn.id === userId)
    return connection
      ? { status: connection.status, isSentByMe: connection.isSentByMe }
      : { status: "none", isSentByMe: false }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence>
        {users.map((user, index) => {
          const { status, isSentByMe } = getConnectionStatus(user.uid)
          return (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <NetworkCard
                user={user}
                connectionStatus={status}
                handleRequestAction={(action, targetId) => handleRequestAction(action, targetId, user)}
                onViewProfile={setSelectedUser}
                isLoading={loadingActions[user.uid]}
                isSentByMe={isSentByMe}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
