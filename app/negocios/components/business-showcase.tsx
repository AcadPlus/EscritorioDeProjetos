'use client'

import { useEffect, useState } from 'react'
import { useBusinessApi } from '@/lib/api/business'
import { BusinessSearch } from './business-search'
import { BusinessFilter } from './business-filter'
import { BusinessSort } from './business-sort'
import { BusinessStatus } from './business-status'
import { BusinessList } from './business-list'
import { BusinessRefresh } from './business-refresh'
import type { NegocioType, NegocioResponse } from '@/lib/types/businessTypes'

interface BusinessShowcaseProps {
  initialBusinesses?: NegocioResponse[] | null
}

export function BusinessShowcase({ initialBusinesses }: BusinessShowcaseProps) {
  const { useListBusinesses } = useBusinessApi()

  const [filter, setFilter] = useState<NegocioType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleBusinesses, setVisibleBusinesses] = useState<NegocioResponse[]>(
    initialBusinesses?.filter((b) => b.visivel === true) || [],
  )
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>(
    'recent',
  )
  const itemsPerPage = 9

  const {
    data: businesses,
    isLoading,
    error,
    refetch,
  } = useListBusinesses('aprovado', {
    initialData: initialBusinesses,
  })

  useEffect(() => {
    if (businesses) {
      const filtered = businesses.filter(
        (business: NegocioResponse) => business.visivel === true,
      )
      setVisibleBusinesses(filtered)
    } else if (!businesses && initialBusinesses) {
      const filtered = initialBusinesses.filter(
        (business: NegocioResponse) => business.visivel === true,
      )
      setVisibleBusinesses(filtered)
    } else if (!businesses && !initialBusinesses && !isLoading && !error) {
      setVisibleBusinesses([]);
    }
  }, [businesses, initialBusinesses, isLoading, error])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleSortChange = (value: 'recent' | 'oldest' | 'alphabetical') => {
    setSortBy(value)
    setCurrentPage(1)
  }

  if (initialBusinesses === null && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Carregando negócios...</p>
      </div>
    );
  }

  if (error && !businesses && !initialBusinesses) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>Erro ao carregar os negócios: {error.message}.</p>
        <p>Por favor, tente atualizar a página ou contate o suporte.</p>
      </div>
    );
  }

  return (
    <div className="min-h-scree">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho e Controles */}
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            {/* Título */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Vitrine de Negócios
              </h2>
              <p className="text-sm text-gray-500">
                Explore startups e empresas inovadoras do nosso ecossistema
              </p>
            </div>

            {/* Barra de Pesquisa e Filtros */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex-1 w-full lg:max-w-2xl">
                <BusinessSearch
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  handleSearch={handleSearch}
                />
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <BusinessSort handleSortChange={handleSortChange} />
                <BusinessRefresh handleRefreshButtonClick={async () => { await refetch(); }} />
              </div>
            </div>

            {/* Status e Filtros em linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Tipo
                </h3>
                <BusinessFilter filter={filter} setFilter={setFilter} />
              </div>

              <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Status dos Negócios
                </h3>
                <BusinessStatus
                  activeBusinesses={visibleBusinesses}
                  pendingBusinesses={
                    businesses?.filter((b: NegocioResponse) => !b.visivel) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Negócios */}
        <div>
          <BusinessList
            businesses={visibleBusinesses}
            filter={filter}
            searchTerm={searchTerm}
            sortBy={sortBy}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            loading={isLoading}
          />
        </div>

        {error && visibleBusinesses.length === 0 && (
          <div className="text-red-500 mt-4 text-center">
            Falha ao atualizar os negócios: {error.message}.
            {initialBusinesses === null && " Os dados iniciais do servidor também não puderam ser carregados."}
          </div>
        )}
        
        {!isLoading && !error && visibleBusinesses.length === 0 && (businesses && businesses.length > 0 || initialBusinesses && initialBusinesses.length > 0) && (
          <div className="text-center mt-8 text-gray-500">
            Nenhum negócio encontrado com os filtros atuais.
          </div>
        )}

         {!isLoading && !error && (!businesses || businesses.length === 0) && (!initialBusinesses || initialBusinesses.length === 0) && (
          <div className="text-center mt-8 text-gray-500">
            Ainda não há negócios cadastrados ou visíveis.
          </div>
        )}

      </div>
    </div>
  )
}
