import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Search, X, UserX, UserCheck, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  NegocioResponse,
  MembroNegocio,
  PapelNegocio,
  StatusVinculoNegocio,
} from '@/lib/types/businessTypes'

interface UserType {
  uid: string
  nome: string
  foto_url?: string
}

interface MembersSectionProps {
  business: NegocioResponse
  isOwner: boolean
  users: UserType[]
  showInviteDialog: boolean
  setShowInviteDialog: (show: boolean) => void
  selectedUsers: string[]
  setSelectedUsers: (users: string[]) => void
  userRoles: Record<string, PapelNegocio>
  setUserRoles: (roles: Record<string, PapelNegocio>) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredUsers: UserType[]
  onInviteUsers: () => void
  onRemoveMember: (userId: string) => void
}

// Função para obter a cor do status
const getStatusInfo = (status: StatusVinculoNegocio) => {
  switch (status) {
    case StatusVinculoNegocio.ACEITO:
      return {
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: <UserCheck className="h-3 w-3" />,
      }
    case StatusVinculoNegocio.RECUSADO:
      return {
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <UserX className="h-3 w-3" />,
      }
    case StatusVinculoNegocio.PENDENTE:
    default:
      return {
        color: 'text-amber-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: <Clock className="h-3 w-3" />,
      }
  }
}

// Função para obter a cor do papel
const getRoleInfo = (papel: PapelNegocio) => {
  switch (papel) {
    case PapelNegocio.ADMIN:
      return {
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
      }
    case PapelNegocio.COORDENADOR:
      return {
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      }
    case PapelNegocio.PESQUISADOR:
      return {
        color: 'text-teal-700',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
      }
    case PapelNegocio.DESENVOLVEDOR:
      return {
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
      }
    case PapelNegocio.MEMBRO:
    default:
      return {
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      }
  }
}

export const MembersSection: React.FC<MembersSectionProps> = ({
  business,
  isOwner,
  showInviteDialog,
  setShowInviteDialog,
  selectedUsers,
  setSelectedUsers,
  userRoles,
  setUserRoles,
  searchTerm,
  setSearchTerm,
  filteredUsers,
  onInviteUsers,
  onRemoveMember,
  users,
}) => {
  // Garantir que membros seja um objeto
  const membros = business.membros || {}
  const memberCount = Object.keys(membros).length
  
  // Encontrar o dono do negócio
  const owner = users.find((user) => user.uid === business.uid_admin)

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-6 pb-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Membros</h2>
              <Badge variant="outline" className="bg-gray-100">
                {memberCount}
              </Badge>
            </div>
            {isOwner && (
              <Button
                onClick={() => setShowInviteDialog(true)}
                size="sm"
                className="gap-1"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar</span>
              </Button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Dono do negócio */}
          <motion.div
            className="flex items-center justify-between p-4 bg-primary/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage
                  src={owner?.foto_url}
                  alt={owner?.nome || 'Avatar do dono'}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(owner?.nome?.[0] || business.uid_admin[0])?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {owner?.nome || business.uid_admin}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 text-xs py-0 px-2"
                  >
                    Proprietário
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Outros membros */}
          {Object.entries(membros).map(
            ([userId, membro]: [string, MembroNegocio]) => {
              // Pular o dono se ele estiver na lista de membros
              if (userId === business.uid_admin) return null
              
              const statusInfo = getStatusInfo(
                membro.status || StatusVinculoNegocio.PENDENTE
              )
              const roleInfo = getRoleInfo(membro.papel)
              // Encontrar o usuário correspondente pelo UID
              const user = users.find((u) => u.uid === userId)
              
              return (
                <motion.div
                  key={userId}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage
                        src={user?.foto_url}
                        alt={user?.nome || 'Avatar do usuário'}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(user?.nome?.[0] || userId[0])?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.nome || userId}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`${roleInfo.bgColor} ${roleInfo.color} border-${roleInfo.borderColor} text-xs py-0 px-2`}
                        >
                          {membro.papel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${statusInfo.bgColor} ${statusInfo.color} border-${statusInfo.borderColor} text-xs py-0 px-2 flex items-center gap-1`}
                        >
                          {statusInfo.icon}
                          <span>
                            {membro.status || StatusVinculoNegocio.PENDENTE}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isOwner && userId !== business.uid_admin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onRemoveMember(userId)}
                    >
                      <UserX className="h-4 w-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  )}
                </motion.div>
              )
            }
          )}
          {memberCount === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-2">Nenhum membro encontrado</p>
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInviteDialog(true)}
                  className="mt-2"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar membros
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convidar Membros</DialogTitle>
            <DialogDescription>
              Selecione os usuários que você deseja convidar para o negócio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: UserType) => (
                  <div
                    key={user.uid}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.uid)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.uid])
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.uid)
                          )
                        }
                      }}
                      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.nome}</p>
                      <p className="text-xs text-gray-500">{user.uid}</p>
                    </div>
                    <Select
                      value={userRoles[user.uid] || PapelNegocio.MEMBRO}
                      onValueChange={(value: PapelNegocio) => {
                        setUserRoles({
                          ...userRoles,
                          [user.uid]: value,
                        })
                      }}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PapelNegocio.MEMBRO}>
                          Membro
                        </SelectItem>
                        <SelectItem value={PapelNegocio.ADMIN}>
                          Administrador
                        </SelectItem>
                        <SelectItem value={PapelNegocio.COORDENADOR}>
                          Coordenador
                        </SelectItem>
                        <SelectItem value={PapelNegocio.PESQUISADOR}>
                          Pesquisador
                        </SelectItem>
                        <SelectItem value={PapelNegocio.DESENVOLVEDOR}>
                          Desenvolvedor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? `Nenhum usuário encontrado para "${searchTerm}"`
                      : 'Nenhum usuário disponível para adicionar'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setShowInviteDialog(false)}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={onInviteUsers}
              disabled={selectedUsers.length === 0}
              className="gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Convidar {selectedUsers.length > 0 && `(${selectedUsers.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 