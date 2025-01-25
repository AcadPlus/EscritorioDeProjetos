'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
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
import { RefreshCw, Plus } from 'lucide-react'
import { BusinessManagementList } from './components/business-management-list'
import { BusinessCreationModal } from './components/business-creation-modal'
import PrivateRoute from '@/components/private_route'

export default function BusinessManagementPage() {
  const { useGetBusinessesByAdmin } = useBusinessApi()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>(
    'recent',
  )
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)

  const {
    data: businessesData,
    isLoading,
    error,
    refetch,
  } = useGetBusinessesByAdmin()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback(
    (value: 'recent' | 'oldest' | 'alphabetical') => {
      setSortBy(value)
      setCurrentPage(1)
    },
    [],
  )

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const handleOpenCreationModal = useCallback(() => {
    setIsCreationModalOpen(true)
  }, [])

  const handleCloseCreationModal = useCallback(() => {
    setIsCreationModalOpen(false)
  }, [])

  const { approvedCount, pendingCount, rejectedCount } = useMemo(
    () => ({
      approvedCount: businessesData?.aprovados.length || 0,
      pendingCount: businessesData?.pendentes.length || 0,
      rejectedCount: businessesData?.recusados.length || 0,
    }),
    [businessesData],
  )

  const renderStatusCounts = useMemo(
    () => (
      <div className="grid grid-cols-3 gap-8 w-full text-center">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-green-600">Aprovados</div>
          <div className="text-3xl font-bold">{approvedCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-yellow-600">Pendentes</div>
          <div className="text-3xl font-bold">{pendingCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-red-600">Recusados</div>
          <div className="text-3xl font-bold">{rejectedCount}</div>
        </div>
      </div>
    ),
    [approvedCount, pendingCount, rejectedCount],
  )

  return (
    <PrivateRoute>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Meus Negócios</h1>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
              <form
                onSubmit={handleSearch}
                className="flex w-full max-w-md items-center space-x-2"
              >
                <Input
                  type="text"
                  placeholder="Buscar negócios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white"
                />
                <Button className="bg-white" type="submit">
                  Buscar
                </Button>
              </form>
              <div className="flex items-center space-x-2">
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
                  className="bg-white"
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-3 flex items-center justify-between p-6 bg-white/50 backdrop-blur-sm rounded-lg border shadow-sm">
              {renderStatusCounts}
            </div>
            <div className="flex items-center justify-center">
              <Button
                className="w-full h-full text-lg bg-white"
                onClick={handleOpenCreationModal}
              >
                <Plus className="mr-2 h-5 w-5" />
                Adicionar Negócio
              </Button>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-base text-red-600">
              Erro ao carregar os negócios: {error.message}
            </div>
          ) : (
            <BusinessManagementList
              businessesData={businessesData}
              statusFilter={'all'}
              searchTerm={searchTerm}
              sortBy={sortBy}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={9}
              loading={isLoading}
              onRefresh={handleRefresh}
            />
          )}
        </div>
        <BusinessCreationModal
          isOpen={isCreationModalOpen}
          onClose={handleCloseCreationModal}
        />
      </div>
    </PrivateRoute>
  )
}
