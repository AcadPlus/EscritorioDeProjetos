'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLaboratorioApi } from '@/lib/api/laboratorio'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { RefreshCw, Plus, Trash2, Edit, Mail, Phone, MapPin } from 'lucide-react'
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
import { LaboratorioCreationModal } from './components/laboratorio-creation-modal'

export default function MeusLaboratoriosPage() {
  const router = useRouter()
  const { useGetUserLaboratorios, useDeleteLaboratorio } = useLaboratorioApi()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>(
    'recent',
  )
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    data: laboratorios,
    isLoading,
    error,
    refetch,
  } = useGetUserLaboratorios()

  const deleteLaboratorioMutation = useDeleteLaboratorio()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleDeleteLaboratorio = async (laboratorioId: string) => {
    try {
      await deleteLaboratorioMutation.mutateAsync(laboratorioId)
      // Força a atualização da lista após a deleção
      await refetch()
    } catch (error) {
      console.error('Erro ao excluir laboratório:', error)
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

  const { ativosCount, inativosCount, manutencaoCount } = useMemo(
    () => ({
      ativosCount: laboratorios?.filter((l) => l.status === 'ATIVO').length || 0,
      inativosCount: laboratorios?.filter((l) => l.status === 'INATIVO').length || 0,
      manutencaoCount: laboratorios?.filter((l) => l.status === 'MANUTENCAO').length || 0,
    }),
    [laboratorios],
  )

  const renderStatusCounts = useMemo(
    () => (
      <div className="grid grid-cols-3 gap-8 w-full text-center">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-green-600">Ativos</div>
          <div className="text-3xl font-bold">{ativosCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-red-600">Inativos</div>
          <div className="text-3xl font-bold">{inativosCount}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-yellow-600">Manutenção</div>
          <div className="text-3xl font-bold">{manutencaoCount}</div>
        </div>
      </div>
    ),
    [ativosCount, inativosCount, manutencaoCount],
  )

  const filteredLaboratorios = useMemo(() => {
    if (!laboratorios) return []

    let filtered = [...laboratorios]

    // Aplicar busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (laboratorio) =>
          laboratorio.nome.toLowerCase().includes(searchLower) ||
          laboratorio.responsavel.toLowerCase().includes(searchLower) ||
          laboratorio.email.toLowerCase().includes(searchLower) ||
          laboratorio.unidade.toLowerCase().includes(searchLower)
      )
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        )
        break
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime(),
        )
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.nome.localeCompare(b.nome))
        break
    }

    return filtered
  }, [laboratorios, searchTerm, sortBy])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ATIVO': {
        className: 'bg-green-100 text-green-800',
        text: 'Ativo',
      },
      'INATIVO': {
        className: 'bg-red-100 text-red-800',
        text: 'Inativo',
      },
      'MANUTENCAO': {
        className: 'bg-yellow-100 text-yellow-800',
        text: 'Manutenção',
      },
    }

    const config = statusConfig[status] || statusConfig['ATIVO']

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    )
  }

  const getTipoBadge = (tipo: string) => {
    const tipoConfig = {
      'PESQUISA': {
        className: 'bg-blue-100 text-blue-800',
        text: 'Pesquisa',
      },
      'ENSINO': {
        className: 'bg-purple-100 text-purple-800',
        text: 'Ensino',
      },
      'EXTENSAO': {
        className: 'bg-green-100 text-green-800',
        text: 'Extensão',
      },
      'DESENVOLVIMENTO': {
        className: 'bg-orange-100 text-orange-800',
        text: 'Desenvolvimento',
      },
      'MULTIDISCIPLINAR': {
        className: 'bg-indigo-100 text-indigo-800',
        text: 'Multidisciplinar',
      },
    }

    const config = tipoConfig[tipo] || { className: 'bg-gray-100 text-gray-800', text: tipo }

    return (
      <Badge variant="outline" className={config.className}>
        {config.text}
      </Badge>
    )
  }

  // Função auxiliar para formatar datas com segurança
  const formatDate = (laboratorio, field: 'created_at' | 'updated_at'): string => {
    if (!laboratorio || !laboratorio[field]) return 'Data não disponível'
    try {
      return format(new Date(laboratorio[field]), "d 'de' MMMM 'às' HH:mm", {
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
              <Skeleton className="h-[350px]" />
            </motion.div>
          ))}
        </motion.div>
      )
    }

    if (!laboratorios || laboratorios.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-semibold">
            Você ainda não tem nenhum laboratório cadastrado
          </h2>
          <p className="text-muted-foreground text-center">
            Cadastre seu primeiro laboratório para começar a gerenciar
            suas atividades de pesquisa e desenvolvimento!
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black text-white hover:bg-black/70"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Laboratório
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
        {filteredLaboratorios.map((laboratorio, index) => (
          <motion.div
            key={laboratorio.uid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="flex flex-col hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() =>
                router.push(`/inspecionar-laboratorio/${laboratorio.uid}`)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {laboratorio.nome}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/inspecionar-laboratorio/${laboratorio.uid}`)
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
                                Excluir Laboratório
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este laboratório?
                                Esta ação não pode ser desfeita e pode afetar
                                projetos e pesquisadores associados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async (e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  await handleDeleteLaboratorio(laboratorio.uid)
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
                      {getTipoBadge(laboratorio.tipo)}
                      {getStatusBadge(laboratorio.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Unidade: {laboratorio.unidade}
                      {laboratorio.subunidade && ` • ${laboratorio.subunidade}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Criado em: {formatDate(laboratorio, 'created_at')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Última atualização: {formatDate(laboratorio, 'updated_at')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">Responsável</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{laboratorio.responsavel}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{laboratorio.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{laboratorio.telefone}</span>
                    </div>
                  </div>

                  {(laboratorio.campus || laboratorio.sala) && (
                    <div>
                      <h4 className="text-sm font-semibold">Localização</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {laboratorio.campus && `${laboratorio.campus}`}
                          {laboratorio.campus && laboratorio.sala && ", "}
                          {laboratorio.sala && `Sala ${laboratorio.sala}`}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold">Descrição</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {laboratorio.descricao || "Sem descrição disponível"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    {laboratorio.pesquisadores && laboratorio.pesquisadores.length > 0 && (
                      <span>
                        {laboratorio.pesquisadores.length} pesquisador{laboratorio.pesquisadores.length !== 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {laboratorio.equipamentos && laboratorio.equipamentos.length > 0 && (
                      <span>
                        {laboratorio.equipamentos.length} equipamento{laboratorio.equipamentos.length !== 1 ? 's' : ''}
                      </span>
                    )}
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
                  Meus Laboratórios
                </h2>
                <p className="text-sm text-gray-500">
                  Gerencie seus laboratórios, acompanhe o status e mantenha
                  suas informações atualizadas
                </p>
              </div>

              {/* Busca e Ordenação */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 w-full lg:max-w-2xl">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar laboratórios..."
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
                    Novo Laboratório
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
                Erro ao carregar os laboratórios: {error.message}
              </motion.div>
            ) : (
              renderContent()
            )}
          </motion.div>
        </div>
      </motion.div>

      <LaboratorioCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch()
        }}
      />
    </PrivateRoute>
  )
}
