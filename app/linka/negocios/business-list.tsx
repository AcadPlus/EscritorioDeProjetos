import { useMemo } from 'react'
import { BusinessCard } from '@/components/business-card'
import { BusinessCardSkeleton } from './business-card-skeleton'
import { Pagination } from '@/components/ui/pagination'
import { NegocioResponse, NegocioType } from '@/lib/types/businessTypes'

interface BusinessListProps {
  businesses: NegocioResponse[]
  filter: NegocioType | 'all'
  searchTerm: string
  sortBy: 'recent' | 'oldest' | 'alphabetical'
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  loading: boolean
}

export function BusinessList({
  businesses,
  filter,
  searchTerm,
  sortBy,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  loading,
}: BusinessListProps) {
  const filteredAndSortedBusinesses = useMemo(() => {
    const result = businesses.filter((business) => {
      const matchesFilter = filter === 'all' || business.tipo_negocio === filter
      const matchesSearch =
        business.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.palavras_chave.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      return matchesFilter && matchesSearch
    })

    switch (sortBy) {
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.data_cadastro).getTime() -
            new Date(b.data_cadastro).getTime(),
        )
        break
      case 'alphabetical':
        result.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        break
      default: // 'recent'
        result.sort(
          (a, b) =>
            new Date(b.data_cadastro).getTime() -
            new Date(a.data_cadastro).getTime(),
        )
    }

    return result
  }, [businesses, filter, searchTerm, sortBy])

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filteredAndSortedBusinesses.slice(indexOfFirstItem, indexOfLastItem)
  }, [filteredAndSortedBusinesses, currentPage, itemsPerPage])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <BusinessCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentItems.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>

      {filteredAndSortedBusinesses.length > itemsPerPage && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalCount={filteredAndSortedBusinesses.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  )
}
