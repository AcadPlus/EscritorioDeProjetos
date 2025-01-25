'use client'

import type {
  NegocioResponse,
  BusinessStatus,
  BusinessesByAdminResponse,
} from '@/lib/types/businessTypes'
import { useBusinessApi } from '@/lib/api/business'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Mail, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { BusinessEditModal } from './business-edit-modal'

interface BusinessManagementListProps {
  businessesData: BusinessesByAdminResponse | undefined
  statusFilter: BusinessStatus | 'all'
  searchTerm: string
  sortBy: 'recent' | 'oldest' | 'alphabetical'
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  loading: boolean
}

export function BusinessManagementList({
  businessesData,
  statusFilter,
  searchTerm,
  sortBy,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  loading,
}: BusinessManagementListProps) {
  const { useUpdateBusiness, useDeleteBusiness } = useBusinessApi()
  const updateBusinessMutation = useUpdateBusiness()
  const deleteBusinessMutation = useDeleteBusiness()
  const [deleteBusinessId, setDeleteBusinessId] = useState<string | null>(null)
  const [editBusiness, setEditBusiness] = useState<NegocioResponse | null>(null)

  const filteredBusinesses = (() => {
    if (!businessesData) return []
    switch (statusFilter) {
      case 'aprovado':
        return businessesData.aprovados
      case 'pendente':
        return businessesData.pendentes
      case 'recusado':
        return businessesData.recusados
      default:
        return businessesData.all
    }
  })().filter(
    (business) =>
      business.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (sortBy === 'recent') {
      return (
        new Date(b.data_cadastro).getTime() -
        new Date(a.data_cadastro).getTime()
      )
    } else if (sortBy === 'oldest') {
      return (
        new Date(a.data_cadastro).getTime() -
        new Date(b.data_cadastro).getTime()
      )
    } else {
      return a.nome.localeCompare(b.nome)
    }
  })

  const totalPages = Math.ceil(sortedBusinesses.length / itemsPerPage)
  const paginatedBusinesses = sortedBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleVisibilityChange = async (business: NegocioResponse) => {
    if (business.status !== 'aprovado') return
    try {
      await updateBusinessMutation.mutateAsync({
        businessId: business.id,
        updateData: { visivel: !business.visivel },
      })
    } catch (error) {
      console.error('Error updating business visibility:', error)
    }
  }

  const handleDelete = async (businessId: string) => {
    try {
      await deleteBusinessMutation.mutateAsync(businessId)
      setDeleteBusinessId(null)
    } catch (error) {
      console.error('Error deleting business:', error)
    }
  }

  const handleEdit = (business: NegocioResponse) => {
    setEditBusiness(business)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
      case 'pendente':
        return 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20'
      case 'recusado':
        return 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBusinesses.map((business) => (
          <Card
            key={business.id}
            className="backdrop-blur-sm bg-white/50 border shadow-lg  flex flex-col"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-bold">
                  {business.nome}
                </CardTitle>
                <Badge
                  className={cn('font-medium', getStatusColor(business.status))}
                >
                  {business.status}
                </Badge>
                {business.status === 'aprovado' && !business.visivel && (
                  <Badge variant="outline" className="ml-2">
                    Não visível
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{business.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{business.telefone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 mt-auto">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Visível</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch
                            checked={business.visivel}
                            onCheckedChange={() =>
                              handleVisibilityChange(business)
                            }
                            disabled={business.status !== 'aprovado'}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {business.status === 'aprovado'
                          ? 'Alterar visibilidade do negócio'
                          : 'Apenas negócios aprovados podem alterar a visibilidade'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleEdit(business)}
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Dialog
                    open={deleteBusinessId === business.id}
                    onOpenChange={(open) => !open && setDeleteBusinessId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteBusinessId(business.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription className="space-y-3 pt-3">
                          <p>
                            Você tem certeza que deseja excluir este negócio?
                            Esta ação não pode ser desfeita.
                          </p>
                          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                            <p className="text-amber-700 text-sm">
                              Atenção: Se você excluir este negócio, precisará
                              passar por todo o processo de submissão novamente
                              caso queira readicioná-lo à plataforma.
                            </p>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          className="bg-black text-white"
                          onClick={() => setDeleteBusinessId(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            deleteBusinessId && handleDelete(deleteBusinessId)
                          }
                        >
                          Sim, excluir negócio
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

{editBusiness && (
        <BusinessEditModal
          isOpen={!!editBusiness}
          onClose={() => setEditBusiness(null)}
          business={editBusiness}
        />
      )}
    </div>
  )
}
