'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useInitiativesApi } from '@/lib/api/initiatives'
import { useBusinessApi } from '@/lib/api/business'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { RefreshCw, Plus, Trash2, Edit, Users } from 'lucide-react'
import PrivateRoute from '@/components/private_route'
import { Skeleton } from '@/components/ui/skeleton'
import {
  StatusIniciativa,
  StatusVinculo,
  TipoIniciativa,
  Participante,
  IniciativaBase,
} from '@/lib/types/initiativeTypes'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'

export default function InitiativesManagementPage() {
  const router = useRouter()
  const { useGetUserInitiatives, useDeleteInitiative } = useInitiativesApi()
  const { useGetUserBusinesses } = useBusinessApi()
  const { data: businesses } = useGetUserBusinesses()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>(
    'recent',
  )

  const {
    data: initiatives,
    isLoading,
    error,
    refetch,
  } = useGetUserInitiatives()

  const deleteInitiativeMutation = useDeleteInitiative()

  const handleDeleteInitiative = async (initiativeId: string) => {
    try {
      await deleteInitiativeMutation.mutateAsync(initiativeId)
      refetch()
    } catch (error) {
      console.error('Erro ao excluir iniciativa:', error)
    }
  }

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }, [])

  const handleSortChange = useCallback(
    (value: 'recent' | 'oldest' | 'alphabetical') => {
      setSortBy(value)
    },
    [],
  )

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const { activeCount, pausedCount, completedCount, pendingInvitesCount } =
    useMemo(
      () => ({
        activeCount:
          initiatives?.filter((i) => i.status === StatusIniciativa.ATIVA)
            .length || 0,
        pausedCount:
          initiatives?.filter((i) => i.status === StatusIniciativa.PAUSADA)
            .length || 0,
        completedCount:
          initiatives?.filter((i) => i.status === StatusIniciativa.CONCLUIDA)
            .length || 0,
        pendingInvitesCount:
          initiatives?.reduce((count, initiative) => {
            const pendingParticipants =
              initiative.participantes?.filter(
                (p: Participante) =>
                  p.status_vinculo === StatusVinculo.PENDENTE,
              ).length || 0
            return count + pendingParticipants
          }, 0) || 0,
      }),
      [initiatives],
    )

  const renderStatusCounts = useMemo(
    () => (
      <div className="grid grid-cols-4 gap-8 w-full text-center">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-green-600">Ativas</div>
          <div className="text-3xl font-bold">{activeCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-yellow-600">Pausadas</div>
          <div className="text-3xl font-bold">{pausedCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-blue-600">Concluídas</div>
          <div className="text-3xl font-bold">{completedCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-purple-600">
            Convites Pendentes
          </div>
          <div className="text-3xl font-bold">{pendingInvitesCount}</div>
        </div>
      </div>
    ),
    [activeCount, pausedCount, completedCount, pendingInvitesCount],
  )

  const filteredInitiatives = useMemo(() => {
    if (!initiatives) return []

    let filtered = [...initiatives]

    // Aplicar busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (initiative) =>
          initiative.titulo.toLowerCase().includes(searchLower) ||
          initiative.descricao.toLowerCase().includes(searchLower) ||
          initiative.palavras_chave.some((tag) =>
            tag.toLowerCase().includes(searchLower),
          ),
      )
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.data_inicio).getTime() -
            new Date(a.data_inicio).getTime(),
        )
        break
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.data_inicio).getTime() -
            new Date(b.data_inicio).getTime(),
        )
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.titulo.localeCompare(b.titulo))
        break
    }

    return filtered
  }, [initiatives, searchTerm, sortBy])

  const getStatusBadge = (status: StatusIniciativa) => {
    const statusConfig = {
      [StatusIniciativa.PENDENTE]: {
        className: 'bg-yellow-100 text-yellow-800',
        text: 'Pendente de Aprovação',
      },
      [StatusIniciativa.ATIVA]: {
        className: 'bg-green-100 text-green-800',
        text: 'Ativa',
      },
      [StatusIniciativa.RECUSADA]: {
        className: 'bg-red-100 text-red-800',
        text: 'Recusada',
      },
      [StatusIniciativa.PAUSADA]: {
        className: 'bg-orange-100 text-orange-800',
        text: 'Pausada',
      },
      [StatusIniciativa.CONCLUIDA]: {
        className: 'bg-blue-100 text-blue-800',
        text: 'Concluída',
      },
      [StatusIniciativa.CANCELADA]: {
        className: 'bg-gray-100 text-gray-800',
        text: 'Cancelada',
      },
    }

    const config =
      statusConfig[status] || statusConfig[StatusIniciativa.PENDENTE]

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    )
  }

  const getTipoIniciativaBadge = (tipo: TipoIniciativa) => {
    const tipoConfig = {
      [TipoIniciativa.PESQUISA]: {
        className: 'bg-blue-100 text-blue-800',
        text: 'Pesquisa',
      },
      [TipoIniciativa.INOVACAO]: {
        className: 'bg-purple-100 text-purple-800',
        text: 'Inovação',
      },
      [TipoIniciativa.EMPREENDEDORISMO]: {
        className: 'bg-green-100 text-green-800',
        text: 'Empreendedorismo',
      },
      [TipoIniciativa.EXTENSAO]: {
        className: 'bg-orange-100 text-orange-800',
        text: 'Extensão',
      },
      [TipoIniciativa.OUTROS]: {
        className: 'bg-gray-100 text-gray-800',
        text: 'Outros',
      },
    }

    const config = tipoConfig[tipo] || tipoConfig[TipoIniciativa.OUTROS]

    return (
      <Badge variant="outline" className={config.className}>
        {config.text}
      </Badge>
    )
  }

  // Função auxiliar para formatar datas com segurança
  const formatDate = (initiative: IniciativaBase | undefined, field: 'data_cadastro' | 'data_ultima_atualizacao'): string => {
    if (!initiative || !initiative[field]) return 'Data não disponível'
    try {
      return format(new Date(initiative[field]), "d 'de' MMMM 'às' HH:mm", {
        locale: ptBR,
      })
    } catch (e) {
      return 'Data inválida'
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-[300px]" />
            </motion.div>
          ))}
        </motion.div>
      )
    }

    if (!businesses || businesses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-semibold">
            Você ainda não tem nenhum negócio cadastrado
          </h2>
          <p className="text-muted-foreground text-center">
            Para criar uma iniciativa, primeiro você precisa cadastrar um
            negócio.
            <br />
            Cadastre seu primeiro negócio para começar!
          </p>
          <Button
            onClick={() => router.push('/linka/meus-negocios')}
            className="bg-black text-white hover:bg-black/70"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Negócio
          </Button>
        </div>
      )
    }

    if (!initiatives || initiatives.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-semibold">
            Você ainda não tem iniciativas
          </h2>
          <p className="text-muted-foreground">
            Crie sua primeira iniciativa ou participe de uma existente!
          </p>
          <Button
            onClick={() => router.push('/linka/iniciativas/nova')}
            className="bg-black text-white hover:bg-black/70"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Iniciativa
          </Button>
        </div>
      )
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredInitiatives.map((initiative: IniciativaBase, index: number) => (
          <motion.div
            key={initiative.uid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="flex flex-col hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() =>
                router.push(`/linka/minhas-iniciativas/${initiative.uid}`)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {initiative.titulo}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/linka/iniciativas/${initiative.uid}`)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir Iniciativa
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta iniciativa?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteInitiative(initiative.uid)
                                }
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(initiative.status)}
                      {getTipoIniciativaBadge(initiative.tipo)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Criado em: {formatDate(initiative, 'data_cadastro')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Última atualização: {formatDate(initiative, 'data_ultima_atualizacao')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">Descrição</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {initiative.descricao}
                    </p>
                  </div>
                  {initiative.recursos_necessarios && (
                    <div>
                      <h4 className="text-sm font-semibold">
                        Recursos Necessários
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {initiative.recursos_necessarios}
                      </p>
                    </div>
                  )}
                  {initiative.resultados_esperados && (
                    <div>
                      <h4 className="text-sm font-semibold">
                        Resultados Esperados
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {initiative.resultados_esperados}
                      </p>
                    </div>
                  )}
                  {initiative.laboratorios &&
                    initiative.laboratorios.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold">Laboratórios</h4>
                        <div className="flex flex-wrap gap-1">
                          {initiative.laboratorios.map((lab: string) => (
                            <Badge
                              key={lab}
                              variant="secondary"
                              className="text-xs"
                            >
                              {lab}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  {initiative.palavras_chave &&
                    initiative.palavras_chave.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold">Palavras-chave</h4>
                        <div className="flex flex-wrap gap-1">
                          {initiative.palavras_chave.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {initiative.participantes?.length || 0} participantes
                    </span>
                  </div>
                  <div>
                    <span>{initiative.seguidores?.length || 0} seguidores</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <PrivateRoute>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Minhas Iniciativas
                </h2>
                <p className="text-sm text-gray-500">
                  Gerencie suas iniciativas, acompanhe o progresso e mantenha
                  suas informações atualizadas
                </p>
              </div>

              {/* Busca e Ordenação */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 w-full lg:max-w-2xl">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar iniciativas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-4 pr-4 py-2 bg-white"
                    />
                  </form>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px] bg-white">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="recent">Mais recentes</SelectItem>
                      <SelectItem value="oldest">Mais antigos</SelectItem>
                      <SelectItem value="alphabetical">
                        Ordem alfabética
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    className="h-10 w-10 bg-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Status e Botão Adicionar */}
              <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-3 bg-white rounded-lg px-4 py-3 shadow-sm">
                  {renderStatusCounts}
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    className="w-full h-full bg-black text-white hover:bg-black/70"
                    onClick={() => {
                      if (!businesses || businesses.length === 0) {
                        router.push('/linka/meus-negocios')
                      } else {
                        router.push('/linka/iniciativas/nova')
                      }
                    }}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Nova Iniciativa
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-red-200 bg-red-50 p-6 text-base text-red-600"
              >
                Erro ao carregar as iniciativas: {error.message}
              </motion.div>
            ) : (
              renderContent()
            )}
          </motion.div>
        </div>
      </motion.div>
    </PrivateRoute>
  )
}
