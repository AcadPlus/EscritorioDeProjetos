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
    useMemo(() => {
      if (!initiatives) {
        return {
          activeCount: 0,
          pausedCount: 0,
          completedCount: 0,
          pendingInvitesCount: 0,
        }
      }

      const activeCount = initiatives.filter(
        (initiative) => initiative.status === StatusIniciativa.ATIVA,
      ).length
      const pausedCount = initiatives.filter(
        (initiative) => initiative.status === StatusIniciativa.PAUSADA,
      ).length
      const completedCount = initiatives.filter(
        (initiative) => initiative.status === StatusIniciativa.CONCLUIDA,
      ).length

      const pendingInvitesCount = initiatives.reduce((count, initiative) => {
        const pendingParticipants = initiative.participantes?.filter(
          (participant: Participante) =>
            participant.status_vinculo === StatusVinculo.PENDENTE,
        )
        return count + (pendingParticipants?.length || 0)
      }, 0)

      return {
        activeCount,
        pausedCount,
        completedCount,
        pendingInvitesCount,
      }
    }, [initiatives])

  const filteredInitiatives = useMemo(() => {
    if (!initiatives) return []

    let filtered = initiatives

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (initiative) =>
          initiative.titulo?.toLowerCase().includes(searchLower) ||
          initiative.descricao?.toLowerCase().includes(searchLower) ||
          initiative.palavras_chave?.some((keyword) =>
            keyword.toLowerCase().includes(searchLower),
          ),
      )
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (
            new Date(a.data_cadastro || 0).getTime() -
            new Date(b.data_cadastro || 0).getTime()
          )
        case 'alphabetical':
          return (a.titulo || '').localeCompare(b.titulo || '', 'pt-BR')
        case 'recent':
        default:
          return (
            new Date(b.data_cadastro || 0).getTime() -
            new Date(a.data_cadastro || 0).getTime()
          )
      }
    })
  }, [initiatives, searchTerm, sortBy])

  const getStatusBadge = (status: StatusIniciativa) => {
    switch (status) {
      case StatusIniciativa.ATIVA:
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Ativa
          </Badge>
        )
      case StatusIniciativa.PAUSADA:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pausada
          </Badge>
        )
      case StatusIniciativa.CONCLUIDA:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Concluída
          </Badge>
        )
      case StatusIniciativa.CANCELADA:
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancelada
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Desconhecido
          </Badge>
        )
    }
  }

  const getTipoIniciativaBadge = (tipo: TipoIniciativa) => {
    switch (tipo) {
      case TipoIniciativa.PESQUISA:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Pesquisa
          </Badge>
        )
      case TipoIniciativa.INOVACAO:
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Inovação
          </Badge>
        )
      case TipoIniciativa.EMPREENDEDORISMO:
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Empreendedorismo
          </Badge>
        )
      case TipoIniciativa.EXTENSAO:
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Extensão
          </Badge>
        )
      case TipoIniciativa.OUTROS:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Outros
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {tipo}
          </Badge>
        )
    }
  }

  const formatDate = (initiative: IniciativaBase | undefined, field: 'data_cadastro' | 'data_ultima_atualizacao'): string => {
    if (!initiative || !initiative[field]) return 'Data não disponível'
    
    try {
      return format(new Date(initiative[field]), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
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
        className="min-h-screen bg-white"
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
                <div className="md:col-span-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-purple-100">
                  <StatusCounts
                    activeCount={activeCount}
                    pausedCount={pausedCount}
                    completedCount={completedCount}
                    pendingInvitesCount={pendingInvitesCount}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    className="w-full h-full bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300 text-white"
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
