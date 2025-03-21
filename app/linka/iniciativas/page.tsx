/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useInitiativesApi } from '@/lib/api/initiatives'
import { InitiativeCard } from '@/components/initiatives/InitiativeCard'
import {
  TipoIniciativa,
  PublicStatusIniciativa,
} from '@/lib/types/initiativeTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Plus, Filter, Info, Search, RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/context/AuthContext'
import { Input } from '@/components/ui/input'

const InitiativeSkeleton = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </Card>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <Card className="p-8 max-w-md w-full">
      <div className="text-center space-y-4">
        <Info className="w-12 h-12 text-muted-foreground mx-auto" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Não foi possível carregar as iniciativas
          </p>
          <p className="text-sm text-gray-500">
            Ocorreu um erro ao tentar carregar as iniciativas. Por favor, tente
            novamente.
          </p>
        </div>
        <Button
          onClick={onRetry}
          variant="default"
          className="w-full sm:w-auto"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    </Card>
  </div>
)

export default function InitiativesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [selectedType, setSelectedType] = useState<TipoIniciativa | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<PublicStatusIniciativa>(
    PublicStatusIniciativa.ATIVA,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>(
    'recent',
  )

  const { useListInitiatives } = useInitiativesApi()

  const {
    data: initiatives,
    isLoading,
    error,
    refetch,
  } = useListInitiatives(undefined, selectedType, selectedStatus, true)

  // Filtra e ordena as iniciativas
  const filteredAndSortedInitiatives = useMemo(() => {
    if (!initiatives || !Array.isArray(initiatives)) return []

    // Primeiro, filtra pelo termo de busca
    const filtered = initiatives.filter((initiative) => {
      if (!initiative || typeof initiative !== 'object') return false

      const searchLower = searchTerm.toLowerCase()
      const titulo = initiative.titulo?.toLowerCase() || ''
      const descricao = initiative.descricao?.toLowerCase() || ''
      const palavrasChave = Array.isArray(initiative.palavras_chave)
        ? initiative.palavras_chave
        : []

      return (
        titulo.includes(searchLower) ||
        descricao.includes(searchLower) ||
        palavrasChave.some((keyword) =>
          (keyword?.toLowerCase() || '').includes(searchLower),
        )
      )
    })

    // Depois, ordena conforme selecionado
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (
            new Date(a?.created_at || 0).getTime() -
            new Date(b?.created_at || 0).getTime()
          )
        case 'alphabetical':
          return (a?.titulo || '').localeCompare(b?.titulo || '', 'pt-BR')
        case 'recent':
        default:
          return (
            new Date(b?.created_at || 0).getTime() -
            new Date(a?.created_at || 0).getTime()
          )
      }
    })
  }, [initiatives, searchTerm, sortBy])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleSortChange = (value: 'recent' | 'oldest' | 'alphabetical') => {
    setSortBy(value)
  }

  const handleRetry = () => {
    refetch()
  }

  const renderFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Filtrar por Tipo
        </h3>
        <Select
          value={selectedType || 'NONE'}
          onValueChange={(value) =>
            setSelectedType(
              value === 'NONE' ? undefined : (value as TipoIniciativa),
            )
          }
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent className=" bg-white">
            <SelectItem className="hover:bg-gray-200" value="NONE">
              Todos os tipos
            </SelectItem>
            {Object.values(TipoIniciativa).map((type) => (
              <SelectItem className="hover:bg-gray-200" key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Status das Iniciativas
        </h3>
        <Select
          value={selectedStatus}
          onValueChange={(value) =>
            setSelectedStatus(value as PublicStatusIniciativa)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className=" bg-white">
            {Object.values(PublicStatusIniciativa)

              .map((status) => (
                <SelectItem
                  className="hover:bg-gray-200"
                  key={status}
                  value={status}
                >
                  {status}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <InitiativeSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (error) {
      return <ErrorState onRetry={handleRetry} />
    }

    if (
      !filteredAndSortedInitiatives ||
      filteredAndSortedInitiatives.length === 0
    ) {
      return (
        <Card className="p-8">
          <div className="text-center">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              {searchTerm
                ? `Nenhuma iniciativa encontrada para "${searchTerm}"`
                : `Nenhuma iniciativa ${selectedType ? `do tipo ${selectedType}` : ''} com status ${selectedStatus.toLowerCase()}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? 'Tente usar termos diferentes na sua busca.'
                : selectedStatus === PublicStatusIniciativa.ATIVA
                  ? 'As iniciativas precisam ser aprovadas por um administrador antes de aparecerem aqui.'
                  : 'Tente mudar os filtros para encontrar mais iniciativas.'}
            </p>
            {isAuthenticated && (
              <Button
                className="mt-4 bg-black text-white hover:bg-black/70"
                onClick={() => router.push('/linka/minhas-iniciativas')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Gerenciar Minhas Iniciativas
              </Button>
            )}
          </div>
        </Card>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedInitiatives.map((initiative) => (
          <InitiativeCard
            key={initiative.uid}
            initiative={initiative}
            onClick={() => router.push(`/linka/iniciativas/${initiative.uid}`)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Iniciativas Disponíveis
            </h2>
            <p className="text-sm text-gray-500">
              Explore as iniciativas disponíveis e encontre oportunidades para
              participar
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
                  <SelectItem value="alphabetical">Ordem alfabética</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRetry}
                className="h-10 w-10 bg-white"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filtros */}
          {renderFilters()}
        </div>
      </div>

      {/* Lista de Iniciativas */}
      {renderContent()}
    </div>
  )
}
