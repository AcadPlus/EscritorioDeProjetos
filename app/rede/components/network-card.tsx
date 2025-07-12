"use client"

import React, { useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
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

  useEffect(() => {
    if (!onViewProfile) {
      console.warn("onViewProfile function is not provided to NetworkCard component")
    }
  }, [onViewProfile])

  const getUserRole = useMemo(() => {
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
  }, [user.tipo_usuario])

  const getUserIcon = useMemo(() => {
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
  }, [user.tipo_usuario])

  const getUserBadgeColor = useMemo(() => {
    switch (user.tipo_usuario) {
      case PublicUserType.ESTUDANTE:
        return "bg-gradient-to-r from-blue-500 to-indigo-500"
      case PublicUserType.PESQUISADOR:
        return "bg-gradient-to-r from-yellow-500 to-orange-500"
      case PublicUserType.EXTERNO:
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-r from-purple-500 to-violet-500"
    }
  }, [user.tipo_usuario])

  const getAffiliation = useMemo(() => {
    if (user.tipo_usuario === PublicUserType.ESTUDANTE || user.tipo_usuario === PublicUserType.PESQUISADOR) {
      return (user as EstudanteCreate | PesquisadorCreate).campus
    } else if (user.tipo_usuario === PublicUserType.EXTERNO) {
      return (user as ExternoCreate).empresa || "N/A"
    }
    return "N/A"
  }, [user])

  const renderStatusTag = () => {
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
  }

  const renderActionButton = () => {
    if (connectionStatus === "none") {
      return (
        <Button
          size="sm"
          onClick={() => handleRequestAction("send", user.uid, user)}
          className="text-white w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300"
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
            className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
            onClick={() => handleRequestAction("cancel", user.uid, user)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserMinus className="w-4 h-4 mr-2" />}
            {isLoading ? "Cancelando..." : "Cancelar"}
          </Button>
        )
      } else {
        return (
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleRequestAction("accept", user.uid, user)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 w-4" />}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => handleRequestAction("reject", user.uid, user)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
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
          className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
          onClick={() => handleRequestAction("remove", user.uid, user)}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserMinus className="w-4 h-4 mr-2" />}
          {isLoading ? "Removendo..." : "Remover"}
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
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden shadow-lg border border-purple-100 bg-white hover:shadow-purple-500/10 transition-all duration-300 h-full">
        <CardContent className="p-6">
          {/* User Info */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-white shadow-lg">
                {user.foto_url ? (
                  <Image
                    src={user.foto_url || "/placeholder.svg"}
                    alt={`Foto de ${user.nome}`}
                    fill
                    sizes="(max-width: 64px) 100vw, 64px"
                    className="object-cover"
                  />
                ) : (
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-lg">
                      {user.nome.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{user.nome}</h3>
              <Badge
                className={`${getUserBadgeColor} text-white border-0 text-xs font-medium mb-2 flex items-center gap-1 w-fit`}
              >
                {getUserIcon}
                {getUserRole}
              </Badge>
              {getAffiliation && getAffiliation !== "N/A" && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {user.tipo_usuario === PublicUserType.EXTERNO ? (
                    <Building2 className="h-3 w-3" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  <span className="truncate">{getAffiliation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status and View Profile */}
          <div className="flex items-center justify-between mb-4">
            {renderStatusTag()}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleViewProfile}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Button */}
          <div className="mt-4">{renderActionButton()}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
})
