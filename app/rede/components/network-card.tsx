'use client'

import React, { useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AvatarFallback, Avatar } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import {
  type PesquisadorCreate,
  type EstudanteCreate,
  type ExternoCreate,
  type UserCreateData,
  UserType,
} from '@/lib/types/userTypes'
import { ConnectionStatus } from '@/lib/types/connectionTypes'
import { UserCheck, Loader2, UserPlus, UserMinus, UserX } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface NetworkCardProps {
  user: UserCreateData
  connectionStatus: ConnectionStatus | 'none'
  handleRequestAction: (
    action: 'send' | 'accept' | 'reject' | 'cancel' | 'remove',
    targetId: string,
    user: UserCreateData,
  ) => void
  onViewProfile: (user: UserCreateData) => void
  isLoading: boolean
  isSentByMe: boolean
}

export const NetworkCard = React.memo(function NetworkCard({
  user,
  connectionStatus,
  handleRequestAction,
  onViewProfile,
  isLoading,
  isSentByMe,
}: NetworkCardProps) {
  const router = useRouter()

  useEffect(() => {
    if (!onViewProfile) {
      console.warn(
        'onViewProfile function is not provided to NetworkCard component',
      )
    }
  }, [onViewProfile])

  const getUserRole = useMemo(() => {
    switch (user.tipo_usuario) {
      case UserType.ESTUDANTE:
        return 'Estudante'
      case UserType.PESQUISADOR:
        return 'Pesquisador'
      case UserType.EXTERNO:
        return 'Externo'
      default:
        return 'Usuário'
    }
  }, [user.tipo_usuario])

  const getAffiliation = useMemo(() => {
    if (
      user.tipo_usuario === UserType.ESTUDANTE ||
      user.tipo_usuario === UserType.PESQUISADOR
    ) {
      return (user as EstudanteCreate | PesquisadorCreate).campus
    } else if (user.tipo_usuario === UserType.EXTERNO) {
      return (user as ExternoCreate).empresa || 'N/A'
    }
    return 'N/A'
  }, [user])

  const renderStatusTag = () => {
    let className =
      'px-2 py-1 rounded-full text-xs font-semibold flex items-center'
    let label = ''
    let icon = null

    switch (connectionStatus) {
      case ConnectionStatus.ACCEPTED:
        className += ' bg-green-100 text-green-800 border border-green-300'
        label = 'Conectado'
        icon = <UserCheck className="w-3 h-3 mr-1" />
        break
      case ConnectionStatus.PENDING:
        className += ' bg-blue-100 text-blue-800 border border-blue-300'
        label = isSentByMe ? 'Solicitação Enviada' : 'Solicitação Recebida'
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

  const renderActionButton = () => {
    if (connectionStatus === 'none') {
      return (
        <Button
          size="sm"
          onClick={() => handleRequestAction('send', user.uid, user)}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Enviando...' : 'Conectar'}
        </Button>
      )
    }

    if (connectionStatus === ConnectionStatus.PENDING) {
      if (isSentByMe) {
        return (
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => handleRequestAction('cancel', user.uid, user)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserMinus className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Cancelando...' : 'Cancelar Solicitação'}
          </Button>
        )
      } else {
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleRequestAction('accept', user.uid, user)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Aceitando...' : 'Aceitar'}
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => handleRequestAction('reject', user.uid, user)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserX className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Rejeitando...' : 'Rejeitar'}
            </Button>
          </div>
        )
      }
    }

    if (connectionStatus === ConnectionStatus.ACCEPTED) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRequestAction('remove', user.uid, user)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserMinus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Removendo...' : 'Remover Conexão'}
        </Button>
      )
    }
  }

  const handleViewProfile = () => {
    router.push(`/perfil?id=${user.uid}&type=${user.tipo_usuario}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              {user.foto_url ? (
                <Image
                  src={user.foto_url}
                  alt={`Foto de ${user.nome}`}
                  fill
                  sizes="(max-width: 64px) 100vw, 64px"
                  className="object-cover"
                />
              ) : (
                <Avatar className="h-full w-full">
                  <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{user.nome}</h3>
              <p className="text-sm text-gray-500 mb-1">{getUserRole}</p>
              <p className="text-sm text-gray-500">{getAffiliation}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {renderStatusTag()}
            <Button size="sm" variant="outline" onClick={handleViewProfile}>
              Ver Perfil
            </Button>
          </div>
          <div className="mt-4">{renderActionButton()}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
})
