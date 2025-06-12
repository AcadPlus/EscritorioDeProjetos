/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useInitiativesApi } from '@/lib/api/initiatives'
import {
  TipoIniciativa,
  PublicStatusIniciativa,
} from '@/lib/types/initiativeTypes'
import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/context/AuthContext'

// Local components
import { InitiativeSkeleton } from './components/InitiativeSkeleton'
import { ErrorState } from './components/ErrorState'
import { Filters } from './components/Filters'
import { NoResults } from './components/NoResults'
import { SearchAndSort } from './components/SearchAndSort'
import { InitiativeList } from './components/InitiativeList'

export default function InitiativesPage() {
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
        <NoResults 
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          isAuthenticated={isAuthenticated}
        />
      )
    }

    return <InitiativeList initiatives={filteredAndSortedInitiatives} />
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
          <SearchAndSort 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            handleSortChange={handleSortChange}
            handleSearch={handleSearch}
            handleRetry={handleRetry}
          />

          {/* Filtros */}
          <Filters 
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
      </div>

      {/* Lista de Iniciativas */}
      {renderContent()}
    </div>
  )
}
