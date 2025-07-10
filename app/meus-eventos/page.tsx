'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEventApi } from '@/lib/api/event'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { RefreshCw, Plus, Trash2, Edit, Calendar, MapPin, Users } from 'lucide-react'
import PrivateRoute from '@/components/private_route'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { EventStatus } from '@/lib/types/eventTypes'

export default function EventManagementPage() {
  const router = useRouter()
  const { useGetUserEvents, useDeleteEvent } = useEventApi()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>(
    'recent',
  )

  const {
    data: events,
    isLoading,
    error,
    refetch,
  } = useGetUserEvents()

  const deleteEventMutation = useDeleteEvent()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventMutation.mutateAsync(eventId)
      refetch()
    } catch (error) {
      console.error('Erro ao excluir evento:', error)
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

  const { activeCount, completedCount, canceledCount } = useMemo(
    () => ({
      activeCount: events?.filter((e) => e.status === EventStatus.ATIVO).length || 0,
      completedCount: events?.filter((e) => e.status === EventStatus.CONCLUIDO).length || 0,
      canceledCount: events?.filter((e) => e.status === EventStatus.CANCELADO).length || 0,
    }),
    [events],
  )

  const renderStatusCounts = useMemo(
    () => (
      <div className="grid grid-cols-3 gap-8 w-full text-center">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-green-600">Ativos</div>
          <div className="text-3xl font-bold">{activeCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-blue-600">Concluídos</div>
          <div className="text-3xl font-bold">{completedCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-red-600">Cancelados</div>
          <div className="text-3xl font-bold">{canceledCount}</div>
        </div>
      </div>
    ),
    [activeCount, completedCount, canceledCount],
  )

  const filteredEvents = useMemo(() => {
    if (!events) return []

    let filtered = [...events]

    // Aplicar busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.titulo.toLowerCase().includes(searchLower) ||
          event.descricao.toLowerCase().includes(searchLower) ||
          event.local.toLowerCase().includes(searchLower)
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
  }, [events, searchTerm, sortBy])

  const getStatusBadge = (status: EventStatus) => {
    const statusConfig = {
      [EventStatus.ATIVO]: {
        className: 'bg-green-100 text-green-800',
        text: 'Ativo',
      },
      [EventStatus.CONCLUIDO]: {
        className: 'bg-blue-100 text-blue-800',
        text: 'Concluído',
      },
      [EventStatus.CANCELADO]: {
        className: 'bg-red-100 text-red-800',
        text: 'Cancelado',
      },
    }

    const config = statusConfig[status] || statusConfig[EventStatus.ATIVO]

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    )
  }

  // Função auxiliar para formatar datas com segurança
  const formatDate = (event, field: 'data_inicio' | 'data_fim' | 'data_cadastro'): string => {
    if (!event || !event[field]) return 'Data não disponível'
    try {
      return format(new Date(event[field]), "d 'de' MMMM 'às' HH:mm", {
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

    if (!events || events.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-semibold">
            Você ainda não tem nenhum evento cadastrado
          </h2>
          <p className="text-muted-foreground text-center">
            Crie seu primeiro evento para começar!
          </p>
          <Button
            onClick={() => router.push('/meus-eventos/novo')}
            className="bg-black text-white hover:bg-black/70"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Evento
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
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.uid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="flex flex-col hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() =>
                router.push(`/eventos/${event.uid}`)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {event.titulo}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/eventos/${event.uid}`)
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
                                Excluir Evento
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este evento?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteEvent(event.uid)
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
                      {getStatusBadge(event.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Data: {formatDate(event, 'data_inicio')}
                    </p>
                    {event.data_fim && event.data_fim !== event.data_inicio && (
                      <p className="text-sm text-gray-500">
                        Término: {formatDate(event, 'data_fim')}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">Descrição</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {event.descricao}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Local</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.local}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.participantes?.length || 0} participantes
                    </span>
                  </div>
                  <div>
                    <Calendar className="h-4 w-4 inline mr-1" />
                    <span>{new Date(event.data_inicio).toLocaleDateString()}</span>
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
                  Meus Eventos
                </h2>
                <p className="text-sm text-gray-500">
                  Gerencie seus eventos, acompanhe as inscrições e mantenha
                  suas informações atualizadas
                </p>
              </div>

              {/* Busca e Ordenação */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 w-full lg:max-w-2xl">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar eventos..."
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
                    onClick={() => router.push('/meus-eventos/novo')}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Novo Evento
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
                Erro ao carregar os eventos: {error.message}
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
