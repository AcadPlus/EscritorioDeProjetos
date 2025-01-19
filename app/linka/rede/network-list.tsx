/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence } from 'framer-motion'
import { NetworkCard } from './network-card'
import { Button } from '@/components/ui/button'
import { UserBase } from '@/types/network'
import { UserCheck, Loader2, UserPlus, UserMinus } from 'lucide-react'

interface NetworkListProps {
  users: UserBase[]
  requests: Record<string, any>
  decodedToken: string | null
  handleRequestAction: (
    action: 'send' | 'accept' | 'reject',
    uid: string,
  ) => void
  handleRemoveRequest: (uid: string) => void
  setSelectedUser: (user: UserBase) => void
}

export function NetworkList({
  users,
  requests,
  decodedToken,
  handleRequestAction,
  handleRemoveRequest,
  setSelectedUser,
}: NetworkListProps) {
  if (!users || users.length === 0) {
    return <div className="text-center mt-8">Nenhum usuário encontrado.</div>
  }

  const renderStatusTag = (user: UserBase) => {
    const status = requests[user.uid] ? requests[user.uid][0] : null
    let className =
      'px-2 py-1 rounded-full text-xs font-semibold flex items-center'
    let label = ''
    let icon = null

    switch (status) {
      case 'accepted':
        className += ' bg-green-100 text-green-800 border border-green-300'
        label = 'Conectado'
        icon = <UserCheck className="w-3 h-3 mr-1" />
        break
      case 'pending':
        className += ' bg-blue-100 text-blue-800 border border-blue-300'
        label = 'Pendente'
        icon = <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        break
      default:
        className += ' bg-gray-100 text-gray-800 border border-gray-300'
        label = 'Não conectado'
        icon = <UserPlus className="w-3 h-3 mr-1" />
        break
    }

    return (
      <span className={className}>
        {icon}
        {label}
      </span>
    )
  }

  const renderActionButtons = (user: UserBase) => {
    const requestStatus = requests[user.uid]

    if (requestStatus === undefined) {
      return (
        <Button
          size="sm"
          onClick={() => handleRequestAction('send', user.uid)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Conectar
        </Button>
      )
    }

    const isRecipient =
      requestStatus[0] === 'pending' && decodedToken === requestStatus[1]
    const isRequester =
      requestStatus[0] === 'pending' && decodedToken === requestStatus[2]

    if (isRequester) {
      return (
        <Button
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={() => handleRemoveRequest(user.uid)}
        >
          <UserMinus className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      )
    }

    if (isRecipient) {
      return (
        <div className="flex space-x-2">
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => handleRequestAction('accept', user.uid)}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Aceitar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRequestAction('reject', user.uid)}
          >
            <UserMinus className="w-4 h-4 mr-2" />
            Recusar
          </Button>
        </div>
      )
    }

    if (requestStatus[0] === 'accepted') {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRemoveRequest(user.uid)}
        >
          <UserMinus className="w-4 h-4 mr-2" />
          Remover Conexão
        </Button>
      )
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {users.map((user) => (
          <NetworkCard
            key={user.uid}
            user={user}
            renderActionButtons={renderActionButtons}
            renderStatusTag={renderStatusTag}
            onViewProfile={setSelectedUser}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
