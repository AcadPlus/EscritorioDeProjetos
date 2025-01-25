import { AnimatePresence } from 'framer-motion'
import { NetworkCard } from './network-card'
import type { UserCreateData } from '@/lib/types/userTypes'
import type { ConnectionStatus } from '@/lib/types/connectionTypes'

interface NetworkListProps {
  users: UserCreateData[]
  connections: Array<{
    id: string
    status: ConnectionStatus
    isSentByMe: boolean
  }>
  currentUserId: string
  handleRequestAction: (
    action: 'send' | 'accept' | 'reject' | 'cancel' | 'remove',
    targetId: string,
    user: UserCreateData
  ) => void
  setSelectedUser: (user: UserCreateData) => void
  viewOption: 'all' | 'pending' | 'connected'
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
    return <div className="text-center mt-8">Nenhum usuário encontrado.</div>
  }

  const getConnectionStatus = (
    userId: string,
  ): { status: ConnectionStatus | 'none'; isSentByMe: boolean } => {
    const connection = connections.find((conn) => conn.id === userId)
    return connection
      ? { status: connection.status, isSentByMe: connection.isSentByMe }
      : { status: 'none', isSentByMe: false }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {users.map((user) => {
          const { status, isSentByMe } = getConnectionStatus(user.uid)
          return (
            <NetworkCard
              key={user.uid}
              user={user}
              connectionStatus={status}
              handleRequestAction={(action, targetId) => handleRequestAction(action, targetId, user)}
              onViewProfile={setSelectedUser}
              isLoading={loadingActions[user.uid]}
              isSentByMe={isSentByMe}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

