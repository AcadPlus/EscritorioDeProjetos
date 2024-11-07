'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import useCampusOptions from '@/hooks/useCampusOptions'
import allUsers from '@/hooks/allUsers'
import SidebarWrapper from '@/lib/sidebar_wrapper'
import { useRequests } from '@/hooks/useRequests'
import {
  Search,
  UserPlus,
  UserMinus,
  UserCheck,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
} from 'lucide-react'

interface IUser {
  uid: string
  displayName: string
  photoURL: string
  role: string
  campus: string
  email: string
  phone: string
  course: string
  createdAt: string
  lastLogin: string
}

const UserCard = ({
  user,
  showActions = true,
  renderActionButtons,
  renderStatusTag,
  onViewProfile,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              alt={user.displayName}
              src={user.photoURL || '/default-avatar.jpg'}
            />
            <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold mb-1">{user.displayName}</h3>
            <p className="text-sm text-gray-500 mb-1">{user.role}</p>
            <p className="text-sm text-gray-500">{user.campus}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {renderStatusTag(user)}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProfile(user)}
          >
            Ver Perfil
          </Button>
        </div>
        {showActions && <div className="mt-4">{renderActionButtons(user)}</div>}
      </CardContent>
    </Card>
  </motion.div>
)

const ProfileModal = ({ user, isOpen, onClose }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Perfil do Usuário</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user.displayName}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>
        <div className="grid gap-2">
          {[
            { icon: Mail, value: user.email },
            { icon: Phone, value: user.phone },
            { icon: MapPin, value: user.campus },
            { icon: Briefcase, value: user.role },
            { icon: GraduationCap, value: user.course },
            {
              icon: Calendar,
              value: `Membro desde: ${new Date(user.createdAt).toLocaleDateString()}`,
            },
          ].map(({ icon: Icon, value }, index) => (
            <div key={index} className="flex items-center">
              <Icon className="w-4 h-4 mr-2 text-gray-500" />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </DialogContent>
  </Dialog>
)

export default function Network() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const campusOptions = useCampusOptions()
  const users = allUsers()
  const { requests, handleRequestAction, handleRemoveRequest, decodedToken } =
    useRequests()

  const renderStatusTag = (user) => {
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

  const renderActionButtons = (user) => {
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

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.uid !== decodedToken &&
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (roleFilter === 'all' || user.role === roleFilter) &&
        (institutionFilter === 'all' || user.campus === institutionFilter),
    )
  }, [users, decodedToken, searchQuery, roleFilter, institutionFilter])

  const connectedUsers = useMemo(
    () =>
      filteredUsers.filter(
        (user) => requests[user.uid] && requests[user.uid][0] === 'accepted',
      ),
    [filteredUsers, requests],
  )

  const pendingUsers = useMemo(
    () =>
      filteredUsers.filter(
        (user) => requests[user.uid] && requests[user.uid][0] === 'pending',
      ),
    [filteredUsers, requests],
  )

  return (
    <main className="bg-gray-100 min-h-screen">
      <SidebarWrapper />
      <div className="md:ml-64 p-8">
        <h2 className="text-3xl font-bold mb-8">Rede</h2>
        <Tabs defaultValue="all">
          <TabsList className="gap-2">
            <TabsTrigger className="bg-white" value="all">
              Todos
            </TabsTrigger>
            <TabsTrigger className="bg-white" value="connected">
              Conectados
            </TabsTrigger>
            <TabsTrigger className="bg-white" value="pending">
              Pendentes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="flex flex-wrap gap-4 mb-6 mt-6">
              <div className="flex-1 min-w-[200px]">
                <Input
                  type="search"
                  placeholder="Buscar usuários..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white"
                  icon={<Search className="w-4 h-4 text-gray-500" />}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={institutionFilter}
                onValueChange={setInstitutionFilter}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Instituição" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Todos</SelectItem>
                  {campusOptions.map((campus, index) => (
                    <SelectItem key={index} value={campus}>
                      {campus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.uid}
                    user={user}
                    renderActionButtons={renderActionButtons}
                    renderStatusTag={renderStatusTag}
                    onViewProfile={setSelectedUser}
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
          <TabsContent value="connected">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {connectedUsers.map((user) => (
                  <UserCard
                    key={user.uid}
                    user={user}
                    renderActionButtons={renderActionButtons}
                    renderStatusTag={renderStatusTag}
                    onViewProfile={setSelectedUser}
                  />
                ))}
              </AnimatePresence>
            </div>
            {connectedUsers.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p>Você ainda não tem conexões.</p>
                <p>
                  Explore a aba "Todos" para encontrar pessoas para se conectar!
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="pending">
            <h3 className="text-xl mt-6 font-semibold mb-4">
              Solicitações Recebidas
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <AnimatePresence>
                {pendingUsers
                  .filter((user) => requests[user.uid][1] === decodedToken)
                  .map((user) => (
                    <UserCard
                      key={user.uid}
                      user={user}
                      renderActionButtons={renderActionButtons}
                      renderStatusTag={renderStatusTag}
                      onViewProfile={setSelectedUser}
                    />
                  ))}
              </AnimatePresence>
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Solicitações Enviadas
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {pendingUsers
                  .filter((user) => requests[user.uid][2] === decodedToken)
                  .map((user) => (
                    <UserCard
                      key={user.uid}
                      user={user}
                      showActions={false}
                      renderActionButtons={renderActionButtons}
                      renderStatusTag={renderStatusTag}
                      onViewProfile={setSelectedUser}
                    />
                  ))}
              </AnimatePresence>
            </div>
            {pendingUsers.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p>Não há solicitações pendentes no momento.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </main>
  )
}
