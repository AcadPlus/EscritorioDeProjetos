"use client"

import React, { useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  type PesquisadorCreate,
  type EstudanteCreate,
  type ExternoCreate,
  type UserCreateData,
  PublicUserType,
} from "@/lib/types/userTypes"
import { ConnectionStatus } from "@/lib/types/connectionTypes"
import {
  UserCheck,
  Loader2,
  UserPlus,
  UserMinus,
  UserX,
  Crown,
  GraduationCap,
  Briefcase,
  MapPin,
  Building2,
  Eye,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type NetworkCardProps = {
  user: UserCreateData & { uid: string }
  connectionStatus: ConnectionStatus | "none"
  handleRequestAction: (
    action: "send" | "accept" | "reject" | "cancel" | "remove",
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

  // Memoizar callbacks para evitar re-renderizações
  const handleViewProfile = useCallback(() => {
    router.push(`/perfil?id=${user.uid}&type=${user.tipo_usuario}`)
  }, [router, user.uid, user.tipo_usuario])

  const handleActionClick = useCallback((action: "send" | "accept" | "reject" | "cancel" | "remove") => {
    handleRequestAction(action, user.uid, user)
  }, [handleRequestAction, user.uid, user])

  // Memoizar dados do usuário
  const userInfo = useMemo(() => {
    const getUserRole = () => {
      switch (user.tipo_usuario) {
        case PublicUserType.ESTUDANTE:
          return "Estudante"
        case PublicUserType.PESQUISADOR:
          return "Pesquisador"
        case PublicUserType.EXTERNO:
          return "Externo"
        default:
          return "Usuário"
      }
    }

    const getUserIcon = () => {
      switch (user.tipo_usuario) {
        case PublicUserType.ESTUDANTE:
          return <GraduationCap className="h-3 w-3" />
        case PublicUserType.PESQUISADOR:
          return <Crown className="h-3 w-3" />
        case PublicUserType.EXTERNO:
          return <Briefcase className="h-3 w-3" />
        default:
          return <UserCheck className="h-3 w-3" />
      }
    }

    // Cores simplificadas - evitar gradientes complexos
    const getUserBadgeColor = () => {
      switch (user.tipo_usuario) {
        case PublicUserType.ESTUDANTE:
          return "bg-blue-500"
        case PublicUserType.PESQUISADOR:
          return "bg-yellow-500"
        case PublicUserType.EXTERNO:
          return "bg-green-500"
        default:
          return "bg-purple-500"
      }
    }

    const getAffiliation = () => {
      if (user.tipo_usuario === PublicUserType.ESTUDANTE || user.tipo_usuario === PublicUserType.PESQUISADOR) {
        return (user as EstudanteCreate | PesquisadorCreate).campus
      } else if (user.tipo_usuario === PublicUserType.EXTERNO) {
        return (user as ExternoCreate).empresa || "N/A"
      }
      return "N/A"
    }

    return {
      role: getUserRole(),
      icon: getUserIcon(),
      badgeColor: getUserBadgeColor(),
      affiliation: getAffiliation()
    }
  }, [user])

  // Memoizar tag de status
  const statusTag = useMemo(() => {
    let className = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border"
    let label = ""
    let icon: React.ReactNode = null

    switch (connectionStatus) {
      case ConnectionStatus.ACCEPTED:
        className += " bg-green-50 text-green-700 border-green-200"
        label = "Conectado"
        icon = <UserCheck className="w-3 h-3" />
        break
      case ConnectionStatus.PENDING:
        className += " bg-amber-50 text-amber-700 border-amber-200"
        label = isSentByMe ? "Enviada" : "Recebida"
        icon = <Clock className="w-3 h-3" />
        break
      default:
        className += " bg-gray-50 text-gray-600 border-gray-200"
        label = "Disponível"
        icon = <UserPlus className="w-3 h-3" />
        break
    }

    return (
      <span className={className}>
        {icon}
        {label}
      </span>
    )
  }, [connectionStatus, isSentByMe])

  // Memoizar botão de ação
  const actionButton = useMemo(() => {
    if (connectionStatus === "none") {
      return (
        <Button
          size="sm"
          onClick={() => handleActionClick("send")}
          className="text-white w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
          {isLoading ? "Enviando..." : "Conectar"}
        </Button>
      )
    }

    if (connectionStatus === ConnectionStatus.PENDING) {
      if (isSentByMe) {
        return (
          <Button
            size="sm"
            variant="outline"
            className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
            onClick={() => handleActionClick("cancel")}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserX className="w-4 h-4 mr-2" />}
            {isLoading ? "Cancelando..." : "Cancelar"}
          </Button>
        )
      } else {
        return (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              size="sm"
              onClick={() => handleActionClick("accept")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserCheck className="w-4 h-4 mr-2" />}
              {isLoading ? "Aceitando..." : "Aceitar"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleActionClick("reject")}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserX className="w-4 h-4 mr-2" />}
              {isLoading ? "Rejeitando..." : "Rejeitar"}
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
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => handleActionClick("remove")}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserMinus className="w-4 h-4 mr-2" />}
          {isLoading ? "Removendo..." : "Remover"}
        </Button>
      )
    }
  }, [connectionStatus, isSentByMe, isLoading, handleActionClick])

  return (
    <Card className="border border-purple-100 bg-white hover:shadow-md transition-shadow duration-200 h-full">
      <CardContent className="p-4">
        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-purple-100 border border-purple-200">
              {user.foto_url ? (
                <Image
                  src={user.foto_url}
                  alt={`Foto de ${user.nome}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <Avatar className="h-full w-full">
                  <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                    {user.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 truncate">{user.nome}</h3>
            </div>
            <Badge className={`${userInfo.badgeColor} text-white border-0 text-xs font-medium mb-2 flex items-center gap-1 w-fit`}>
              {userInfo.icon}
              {userInfo.role}
            </Badge>
            <div className="flex items-center text-sm text-gray-500 flex-wrap gap-3">
              <div className="flex items-center">
                {user.tipo_usuario === "EXTERNO" ? (
                  <Building2 className="h-4 w-4 mr-1.5 text-gray-400" />
                ) : (
                  <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                )}
                <span className="truncate">{userInfo.affiliation}</span>
              </div>
              {user.cidade && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span className="truncate">{user.cidade}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {statusTag}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewProfile}
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Perfil
            </Button>
            <div className="flex-1">{actionButton}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
