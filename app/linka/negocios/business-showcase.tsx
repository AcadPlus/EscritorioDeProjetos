'use client'

import { useState, useEffect } from 'react'
import { useBusinessApi } from '@/lib/api/business'
import { BusinessSearch } from './business-search'
import { BusinessFilter } from './business-filter'
import { BusinessSort } from './business-sort'
import { BusinessCreation } from './business-create'
import { BusinessStatus } from './business-status'
import { BusinessList } from './business-list'
import { BusinessRefresh } from './business-refresh'
import { NegocioResponse, NegocioType } from '@/lib/types/businessTypes'

export function BusinessShowcase() {
  const { listBusinesses } = useBusinessApi()

  const [businesses, setBusinesses] = useState<NegocioResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<NegocioType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>('recent')
  const itemsPerPage = 9

  const fetchBusinesses = async () => {
    try {
      const data = await listBusinesses()
      setBusinesses(data)
    } catch (err) {
      setError('Failed to load businesses. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleSortChange = (value: 'recent' | 'oldest' | 'alphabetical') => {
    setSortBy(value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Vitrine de Negócios</h2>
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <BusinessSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
            />
            <BusinessSort handleSortChange={handleSortChange} />
            <BusinessRefresh handleRefreshButtonClick={fetchBusinesses} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <BusinessFilter filter={filter} setFilter={setFilter} />
          <BusinessStatus activeBusinesses={businesses} />
          <BusinessCreation onRequestCreate={() => {}} />
        </div>
      </div>
      <div className="mt-8">
        <BusinessList
          businesses={businesses}
          filter={filter}
          searchTerm={searchTerm}
          sortBy={sortBy}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          loading={loading}
        />
      </div>
    </div>
  )
}
