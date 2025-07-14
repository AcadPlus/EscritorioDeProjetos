'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { RefreshCw, Plus, Trash2, Edit, Mail, Phone } from 'lucide-react'
import PrivateRoute from '@/components/private_route'
import { Skeleton } from '@/components/ui/skeleton'
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
import { cn } from '@/lib/utils'
import { BusinessCreationModal } from './components/business-creation-modal'

export default function BusinessManagementPage() {
  const router = useRouter()
  const { useGetUserBusinesses, useDeleteBusiness } = useBusinessApi()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>(
    'recent',
  )
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    data: businesses,
    isLoading,
    error,
    refetch,
  } = useGetUserBusinesses()

  const deleteBusinessMutation = useDeleteBusiness()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      await deleteBusinessMutation.mutateAsync(businessId)
      // Força a atualização da lista após a deleção
      await refetch()
    } catch (error) {
      console.error('Erro ao excluir negócio:', error)
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

  const { approvedCount, pendingCount, rejectedCount } = useMemo(
    () => ({
      approvedCount: businesses?.filter((b) => b.status === 'aprovado').length || 0,
      pendingCount: businesses?.filter((b) => b.status === 'pendente').length || 0,
      rejectedCount: businesses?.filter((b) => b.status === 'recusado').length || 0,
    }),
    [businesses],
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

  const filteredBusinesses = useMemo(() => {
    if (!businesses) return []

    let filtered = [...businesses]

    // Aplicar busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (business) =>
          business.nome.toLowerCase().includes(searchLower) ||
          business.email.toLowerCase().includes(searchLower) ||
          business.telefone.toLowerCase().includes(searchLower)
      )
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.data_cadastro).getTime() -
            new Date(a.data_cadastro).getTime(),
        )
        break
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.data_cadastro).getTime() -
            new Date(b.data_cadastro).getTime(),
        )
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.nome.localeCompare(b.nome))
        break
    }

    return filtered
  }, [businesses, searchTerm, sortBy])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'aprovado': {
        className: 'bg-green-100 text-green-800',
        text: 'Aprovado',
      },
      'pendente': {
        className: 'bg-yellow-100 text-yellow-800',
        text: 'Pendente',
      },
      'recusado': {
        className: 'bg-red-100 text-red-800',
        text: 'Recusado',
      },
    }

    const config = statusConfig[status] || statusConfig['pendente']

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    )
  }

  // Função auxiliar para formatar datas com segurança
  const formatDate = (business, field: 'data_cadastro' | 'data_atualizacao'): string => {
    if (!business || !business[field]) return 'Data não disponível'
    try {
      return format(new Date(business[field]), "d 'de' MMMM 'às' HH:mm", {
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

    if (!businesses || businesses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-semibold">
            Você ainda não tem nenhum negócio cadastrado
          </h2>
          <p className="text-muted-foreground text-center">
            Cadastre seu primeiro negócio para começar a criar iniciativas!
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black text-white hover:bg-black/70"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Negócio
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
        {filteredBusinesses.map((business, index) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="flex flex-col hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() =>
                router.push(`/inspecionar-negocio/${business.id}`)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {business.nome}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/inspecionar-negocio/${business.id}`)
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
                                Excluir Negócio
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este negócio?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async (e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  await handleDeleteBusiness(business.id)
                                }}
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
                      {getStatusBadge(business.status)}
                      {business.visivel ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Visível
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          Não visível
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Criado em: {formatDate(business, 'data_cadastro')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Última atualização: {formatDate(business, 'data_atualizacao')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">Contato</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{business.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{business.telefone}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Descrição</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {business.descricao || "Sem descrição disponível"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>
                      {business.cnpj ? "CNPJ: " + business.cnpj : "Sem CNPJ cadastrado"}
                    </span>
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
                  Meus Negócios
                </h2>
                <p className="text-sm text-gray-500">
                  Gerencie seus negócios, acompanhe o status e mantenha
                  suas informações atualizadas
                </p>
              </div>

              {/* Busca e Ordenação */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 w-full lg:max-w-2xl">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar negócios..."
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
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Novo Negócio
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
                Erro ao carregar os negócios: {error.message}
              </motion.div>
            ) : (
              renderContent()
            )}
          </motion.div>
        </div>
      </motion.div>
      
      <BusinessCreationModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => {
          refetch()
        }}
      />
    </PrivateRoute>
  )
}
