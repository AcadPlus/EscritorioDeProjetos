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

// Local components
import { StatusCounts } from './components/StatusCounts'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { EmptyBusinessState } from './components/EmptyBusinessState'
import { EmptyInitiativesState } from './components/EmptyInitiativesState'
import { InitiativeList } from './components/InitiativeList'
import { SearchAndFilterBar } from './components/SearchAndFilterBar'

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
      return <LoadingSkeleton />
    }

    if (!businesses || businesses.length === 0) {
      return <EmptyBusinessState />
    }

    if (!initiatives || initiatives.length === 0) {
      return <EmptyInitiativesState />
    }

    return <InitiativeList initiatives={filteredInitiatives} handleDeleteInitiative={handleDeleteInitiative} />
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
              <SearchAndFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                handleSortChange={handleSortChange}
                handleSearch={handleSearch}
                handleRefresh={handleRefresh}
              />

              {/* Status e Botão Adicionar */}
              <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-3 bg-white rounded-lg px-4 py-3 shadow-sm">
                  <StatusCounts
                    activeCount={activeCount}
                    pausedCount={pausedCount}
                    completedCount={completedCount}
                    pendingInvitesCount={pendingInvitesCount}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    className="w-full h-full bg-black text-white hover:bg-black/70"
                    onClick={() => {
                      if (!businesses || businesses.length === 0) {
                        router.push('/meus-negocios')
                      } else {
                        router.push('/iniciativas/nova')
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
