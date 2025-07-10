/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useInitiativesApi } from '@/lib/api/initiatives'
import { useUserApi } from '@/lib/api/users'
import { useBusinessApi } from '@/lib/api/business'
import { useAuth } from '@/lib/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Users,
  Building2,
  Tag,
  Share2,
  Heart,
  HeartOff,
} from 'lucide-react'
import {
  IniciativaBase,
  MembroIniciativa,
  StatusIniciativa,
  StatusVinculo,
  PapelIniciativa,
} from '@/lib/types/initiativeTypes'
import { UserWithType } from '@/lib/types/userTypes'
import {
  NegocioResponse,
  StatusVinculoNegocio,
} from '@/lib/types/businessTypes'
import { useUsers, User } from '@/lib/hooks/useUsers'
import { useDebounce } from '@/lib/hooks/useDebounce'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PrivateRoute from '@/components/private_route'
interface ExtendedIniciativa extends IniciativaBase {
  owner_id: string
  participantes: MembroIniciativa[]
  seguidores: string[]
  uid: string
  negocio_id: string
  palavras_chave: string[]
}

export default function InitiativePublicPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const {
    useGetInitiativeById,
    useFollowInitiative,
    useUnfollowInitiative,
    useAddInitiativeMember,
  } = useInitiativesApi()
  const { useFetchUsers } = useUserApi()
  const { useGetBusinessById } = useBusinessApi()
  const { userId } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; role: PapelIniciativa }[]
  >([])
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 500)

  const { id } = use(params)
  const { data: initiative, isLoading: isLoadingInitiative } =
    useGetInitiativeById(id) as {
      data: ExtendedIniciativa | undefined
      isLoading: boolean
    }
  const { data: users } = useFetchUsers()
  const { data: businessList } = useGetBusinessById(
    initiative?.negocio_id || '',
  ) as {
    data: NegocioResponse | NegocioResponse[]
  }
  const business = Array.isArray(businessList)
    ? businessList[0]
    : (businessList as NegocioResponse)

  const { data: availableUsers, isLoading: isLoadingUsers } =
    useUsers(debouncedSearch)

  const followMutation = useFollowInitiative()
  const unfollowMutation = useUnfollowInitiative()
  const addMember = useAddInitiativeMember()

  if (isLoadingInitiative || !users) {
    return (
      <PrivateRoute>
        <div className="container mx-auto py-8 max-w-4xl">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-4" />
          <div className="mt-8 space-y-4">
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </PrivateRoute>
    )
  }

  if (!initiative) {
    return (
      <PrivateRoute>
        <div className="container mx-auto py-8 max-w-4xl">
          <h1 className="text-2xl font-semibold">Iniciativa não encontrada</h1>
          <Button
            onClick={() => router.push('/iniciativas')}
            className="mt-4"
          >
            Voltar para Iniciativas
          </Button>
        </div>
      </PrivateRoute>
    )
  }

  const owner = users?.find((u: UserWithType) => u.uid === initiative.owner_id)

  const activeParticipants =
    initiative.participantes?.filter(
      (p) => p.status === StatusVinculo.ACEITO,
    ) || []

  const isFollowing = userId && initiative.seguidores?.includes(userId)

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowMutation.mutate(initiative.uid)
    } else {
      followMutation.mutate(initiative.uid)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: initiative.titulo,
        text: initiative.descricao,
        url: window.location.href,
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleUserSelect = (userId: string) => {
    const isSelected = selectedUsers.some((u) => u.id === userId)
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== userId))
    } else {
      setSelectedUsers([
        ...selectedUsers,
        { id: userId, role: PapelIniciativa.MEMBRO },
      ])
    }
  }

  const handleRoleChange = (userId: string, role: PapelIniciativa) => {
    setSelectedUsers(
      selectedUsers.map((u) => (u.id === userId ? { ...u, role } : u)),
    )
  }

  const handleInviteMembers = async () => {
    try {
      for (const user of selectedUsers) {
        // Verifica se o usuário é membro do negócio antes de convidar
        const isMemberOfBusiness =
          business?.membros?.[user.id]?.status === StatusVinculoNegocio.ACEITO
        if (!isMemberOfBusiness) {
          console.error(`Usuário ${user.id} não é membro do negócio`)
          continue
        }

        await addMember.mutateAsync({
          initiativeId: id,
          userId: user.id,
          papel: user.role,
        })
      }
      setSelectedUsers([])
      setIsInviteDialogOpen(false)
    } catch (error) {
      console.error('Erro ao convidar membros:', error)
    }
  }

  // Filtra apenas membros aceitos do negócio
  const filteredUsers =
    availableUsers?.filter((user: User) => {
      // Verifica se o usuário é membro aceito do negócio
      const isMemberOfBusiness =
        business?.membros?.[user.uid]?.status === StatusVinculoNegocio.ACEITO
      // Verifica se o usuário já é membro da iniciativa
      const isNotMemberOfInitiative = !initiative.membros?.[user.uid]
      // Verifica se o nome ou email corresponde à busca
      const matchesSearch = searchTerm
        ? user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        : true

      return isMemberOfBusiness && isNotMemberOfInitiative && matchesSearch
    }) || []

  const isOwner = userId === initiative.owner_id
  const isAdmin = userId === 'admin'
  const canInvite = isOwner || isAdmin

  return (
    <PrivateRoute>
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="overflow-hidden">
          {/* Cabeçalho da Iniciativa */}
          <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{initiative.titulo}</h1>
                <div className="flex flex-col space-y-2 mt-2 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Iniciado em{' '}
                      {new Date(initiative.data_inicio).toLocaleDateString()}
                    </span>
                  </div>
                  {business && (
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>
                        Iniciativa de{' '}
                        <button
                          onClick={() =>
                            router.push(
                              `/inspecionar-negocio/${business.id}`,
                            )
                          }
                          className="text-zinc-800 hover:text-zinc-600 hover:underline"
                        >
                          {business.nome}
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Badge
                variant={
                  initiative.status === StatusIniciativa.ATIVA
                    ? 'outline'
                    : 'secondary'
                }
                className="ml-4 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
              >
                {initiative.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Corpo da Iniciativa */}
          <div className="p-6">
            {/* Descrição */}
            <div className="prose max-w-none">
              <p className="text-lg">{initiative.descricao}</p>
            </div>

            {/* Tags e Informações */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 border-zinc-200"
              >
                <Tag className="h-3 w-3" />
                {initiative.tipo}
              </Badge>
              {initiative.palavras_chave?.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-zinc-50 text-zinc-800 hover:bg-zinc-100 border-zinc-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Progresso */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Progresso do Projeto
                </span>
                <span className="text-sm text-muted-foreground">
                  {calculateProgress(initiative)}%
                </span>
              </div>
              <Progress
                value={calculateProgress(initiative)}
                className="h-2 bg-zinc-200 [&>div]:bg-zinc-700"
              />
            </div>

            {/* Participantes e Seguidores */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Equipe */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Equipe</h3>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 border-zinc-200"
                  >
                    <Users className="h-3 w-3" />
                    {activeParticipants.length + 1}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {/* Líder */}
                  <Card className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={owner?.foto_url}
                          alt={owner?.nome || 'Avatar do usuário'}
                        />
                        <AvatarFallback>
                          {owner?.nome?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {owner?.nome || 'Líder do Projeto'}
                        </p>
                        <p className="text-sm text-muted-foreground">Líder</p>
                      </div>
                    </div>
                  </Card>

                  {/* Membros Ativos */}
                  {activeParticipants.map((participante: MembroIniciativa) => {
                    const member = users?.find(
                      (u: UserWithType) => u.uid === participante.uid,
                    )
                    return (
                      <Card key={participante.uid} className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {member?.nome?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member?.nome || 'Membro'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {participante.papel}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Seguidores */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Seguidores</h3>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 border-zinc-200"
                  >
                    <Heart className="h-3 w-3" />
                    {initiative.seguidores?.length || 0}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {initiative.seguidores?.map((followerId: string) => {
                    const follower = users?.find(
                      (u: UserWithType) => u.uid === followerId,
                    )
                    return (
                      <Avatar
                        key={followerId}
                        className="border-2 border-background"
                      >
                        <AvatarImage
                          src={follower?.foto_url}
                          alt={follower?.nome || 'Avatar do seguidor'}
                        />
                        <AvatarFallback>
                          {follower?.nome?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant={isFollowing ? 'outline' : 'secondary'}
                  size="sm"
                  className={`gap-2 ${
                    isFollowing
                      ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border-zinc-200'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                  onClick={handleFollowToggle}
                  disabled={
                    followMutation.isPending || unfollowMutation.isPending
                  }
                >
                  {isFollowing ? (
                    <>
                      <HeartOff className="h-4 w-4" />
                      Deixar de Seguir
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      Seguir
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 border-zinc-200"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
              {userId === initiative.owner_id && (
                <Button
                  onClick={() =>
                    router.push(`/minhas-iniciativas/${initiative.uid}`)
                  }
                  variant="secondary"
                  size="sm"
                  className="gap-2 bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  Gerenciar
                </Button>
              )}
            </div>

            {/* Seção de Membros */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Membros</h2>
                {canInvite && (
                  <Dialog
                    open={isInviteDialogOpen}
                    onOpenChange={setIsInviteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>Convidar Membros</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Convidar Membros</DialogTitle>
                        <DialogDescription>
                          Busque membros do negócio para convidar para a
                          iniciativa.
                          {availableUsers.length === 0 &&
                            !isLoadingUsers &&
                            searchTerm === '' && (
                              <div className="mt-2 text-yellow-600">
                                Não há membros disponíveis. Os usuários precisam
                                ser membros do negócio antes de serem convidados
                                para a iniciativa.
                              </div>
                            )}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Buscar usuários..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ScrollArea className="h-[300px]">
                          {filteredUsers.map((user: User) => {
                            const isSelected = selectedUsers.some(
                              (u) => u.id === user.uid,
                            )

                            return (
                              <div
                                key={user.uid}
                                className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                                onClick={() => handleUserSelect(user.uid)}
                              >
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}}
                                    className="rounded"
                                  />
                                  <span>{user.nome || user.email}</span>
                                  <Badge>
                                    {business?.membros?.[user.uid]?.papel ||
                                      'MEMBRO'}
                                  </Badge>
                                </div>
                                {isSelected && (
                                  <Select
                                    value={
                                      selectedUsers.find(
                                        (u) => u.id === user.uid,
                                      )?.role
                                    }
                                    onValueChange={(value: PapelIniciativa) =>
                                      handleRoleChange(user.uid, value)
                                    }
                                  >
                                    <SelectTrigger className="w-[140px]">
                                      <SelectValue placeholder="Selecione o papel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.values(PapelIniciativa).map(
                                        (role) => (
                                          <SelectItem key={role} value={role}>
                                            {role}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            )
                          })}
                          {filteredUsers.length === 0 &&
                            searchTerm &&
                            !isLoadingUsers && (
                              <div className="p-4 text-center text-muted-foreground">
                                Nenhum membro encontrado com este termo de
                                busca.
                              </div>
                            )}
                        </ScrollArea>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsInviteDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleInviteMembers}
                            disabled={selectedUsers.length === 0}
                          >
                            Convidar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Lista de membros */}
              {initiative.membros &&
                Object.entries(initiative.membros).map(([userId, membro]) => {
                  const user = users?.find((u) => u.uid === userId)
                  return (
                    <div
                      key={userId}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{user?.nome || 'Usuário'}</span>
                        <Badge>{membro.papel}</Badge>
                        <Badge
                          variant={
                            membro.status === StatusVinculo.ACEITO
                              ? 'default'
                              : membro.status === StatusVinculo.PENDENTE
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {membro.status}
                        </Badge>
                      </div>
                      {canInvite && userId !== initiative.owner_id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // Implementar remoção de membro
                          }}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </Card>
      </div>
    </PrivateRoute>
  )
}

function calculateProgress(initiative: ExtendedIniciativa): number {
  if (!initiative.data_fim) return 0

  const start = new Date(initiative.data_inicio)
  const end = new Date(initiative.data_fim)
  const today = new Date()

  const totalDays = Math.max(
    1,
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  )
  const daysElapsed = Math.max(
    0,
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  )

  const progress = (daysElapsed / totalDays) * 100
  return Math.min(Math.round(progress), 100)
}
