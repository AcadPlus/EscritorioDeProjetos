/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useInitiativesApi } from '@/lib/api/initiatives'
import {
  TipoIniciativa,
  PublicStatusIniciativa,
  StatusIniciativa,
  NivelMaturidade,
} from '@/lib/types/initiativeTypes'
import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { motion } from 'framer-motion'
import { Sparkles, HandHeart, TrendingUp, Users, Heart, Star } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Local components
import { InitiativeSkeleton } from './components/InitiativeSkeleton'
import { ErrorState } from './components/ErrorState'
import { Filters } from './components/Filters'
import { NoResults } from './components/NoResults'
import { SearchAndSort } from './components/SearchAndSort'
import InitiativeList from './components/InitiativeList'

export default function InitiativesPage() {
  const { isAuthenticated, user } = useAuth()
  const [selectedType, setSelectedType] = useState<TipoIniciativa | undefined>()
  const [selectedMaturity, setSelectedMaturity] = useState<NivelMaturidade | undefined>()
  const [showCollaborating, setShowCollaborating] = useState(false)
  const [showInternational, setShowInternational] = useState(false)
  const [showWithIP, setShowWithIP] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>('recent')

  const { 
    useListInitiatives, 
    useFavoriteInitiative, 
    useUnfavoriteInitiative,
    useGetUserFavoriteInitiatives
  } = useInitiativesApi()

  // Buscar todas as iniciativas de uma vez, sem filtros na API
  const {
    data: initiatives,
    isLoading,
    error,
    refetch,
  } = useListInitiatives(undefined, undefined, undefined, true)

  // Buscar favoritos do usuário
  const { data: favoriteInitiatives } = useGetUserFavoriteInitiatives(isAuthenticated)

  // Mutations para favoritos
  const favoriteMutation = useFavoriteInitiative()
  const unfavoriteMutation = useUnfavoriteInitiative()

  // Função para verificar se uma iniciativa é favorita
  const isInitiativeFavorited = (initiativeId: string) => {
    return favoriteInitiatives?.some(fav => fav.uid === initiativeId) || false
  }

  // Filtra e ordena as iniciativas no front-end
  const filteredAndSortedInitiatives = useMemo(() => {
    if (!initiatives || !Array.isArray(initiatives)) return []

    // Primeiro, aplica filtros
    let filtered = initiatives.filter((initiative) => {
      if (!initiative || typeof initiative !== 'object') return false
      
      // Filtro por tipo se selecionado
      if (selectedType && initiative.tipo !== selectedType) return false
      
      // Filtro por maturidade se selecionado
      if (selectedMaturity && initiative.nivel_maturidade !== selectedMaturity) return false
      
      // Filtro por aceita colaboradores
      if (showCollaborating && !initiative.aceita_colaboradores) return false
      
      // Filtro por colaboração internacional
      if (showInternational && !initiative.colaboracao_internacional) return false
      
      // Filtro por propriedade intelectual
      if (showWithIP && !initiative.tem_propriedade_intelectual) return false
      
      return true
    })

    // Depois, filtra pelo termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((initiative) => {
        const titulo = initiative.titulo?.toLowerCase() || ''
        const descricao = initiative.descricao?.toLowerCase() || ''
        const palavrasChave = Array.isArray(initiative.palavras_chave)
          ? initiative.palavras_chave
          : []
        const areasConhecimento = Array.isArray(initiative.areas_conhecimento)
          ? initiative.areas_conhecimento
          : []
        const tecnologias = Array.isArray(initiative.tecnologias_utilizadas)
          ? initiative.tecnologias_utilizadas
          : []

        return (
          titulo.includes(searchLower) ||
          descricao.includes(searchLower) ||
          palavrasChave.some((keyword) =>
            (keyword?.toLowerCase() || '').includes(searchLower),
          ) ||
          areasConhecimento.some((area) =>
            (area?.toLowerCase() || '').includes(searchLower),
          ) ||
          tecnologias.some((tech) =>
            (tech?.toLowerCase() || '').includes(searchLower),
          )
        )
      })
    }

    // Por fim, ordena conforme selecionado
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
  }, [
    initiatives, 
    selectedType, 
    selectedMaturity, 
    showCollaborating, 
    showInternational, 
    showWithIP, 
    searchTerm, 
    sortBy
  ])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleSortChange = (value: 'recent' | 'oldest' | 'alphabetical') => {
    setSortBy(value)
  }

  const handleRetry = () => {
    refetch()
  }

  const handleFavorite = (initiativeId: string) => {
    favoriteMutation.mutate(initiativeId)
  }

  const handleUnfavorite = (initiativeId: string) => {
    unfavoriteMutation.mutate(initiativeId)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <HandHeart className="h-12 w-12 text-purple-600" />
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse" />
          </div>
          <motion.div
            className="text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <p className="text-gray-800 text-lg font-medium">Carregando iniciativas...</p>
            <p className="text-gray-500 text-sm mt-1">Preparando vitrine tecnológica</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error && !initiatives) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandHeart className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar iniciativas</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500">Por favor, tente atualizar a página ou contate o suporte.</p>
        </motion.div>
      </div>
    )
  }

  const renderContent = () => {
    if (
      !filteredAndSortedInitiatives ||
      filteredAndSortedInitiatives.length === 0
    ) {
      return (
        <NoResults 
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedStatus={PublicStatusIniciativa.ATIVA}
          isAuthenticated={isAuthenticated}
        />
      )
    }

    return (
      <InitiativeList 
        initiatives={filteredAndSortedInitiatives} 
        isLoading={isLoading}
        onFavorite={handleFavorite}
        onUnfavorite={handleUnfavorite}
        isInitiativeFavorited={isInitiativeFavorited}
        currentUserId={user?.uid}
      />
    )
  }

  const renderTabContent = (statusFilter?: StatusIniciativa) => {
    let filteredInitiatives = filteredAndSortedInitiatives

    // Aplicar filtro por status da tab se especificado
    if (statusFilter && initiatives) {
      // Reaplica todos os filtros, mas com o status específico da tab
      filteredInitiatives = initiatives.filter((initiative) => {
        if (!initiative || typeof initiative !== 'object') return false
        
        // Filtro por tipo se selecionado
        if (selectedType && initiative.tipo !== selectedType) return false
        
        // Filtro por maturidade se selecionado
        if (selectedMaturity && initiative.nivel_maturidade !== selectedMaturity) return false
        
        // Filtro por aceita colaboradores
        if (showCollaborating && !initiative.aceita_colaboradores) return false
        
        // Filtro por colaboração internacional
        if (showInternational && !initiative.colaboracao_internacional) return false
        
        // Filtro por propriedade intelectual
        if (showWithIP && !initiative.tem_propriedade_intelectual) return false
        
        // Filtro por status específico da tab
        if (initiative.status !== statusFilter) return false
        
        // Filtro por busca
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase()
          const titulo = initiative.titulo?.toLowerCase() || ''
          const descricao = initiative.descricao?.toLowerCase() || ''
          const palavrasChave = Array.isArray(initiative.palavras_chave)
            ? initiative.palavras_chave
            : []
          const areasConhecimento = Array.isArray(initiative.areas_conhecimento)
            ? initiative.areas_conhecimento
            : []
          const tecnologias = Array.isArray(initiative.tecnologias_utilizadas)
            ? initiative.tecnologias_utilizadas
            : []

          return (
            titulo.includes(searchLower) ||
            descricao.includes(searchLower) ||
            palavrasChave.some((keyword) =>
              (keyword?.toLowerCase() || '').includes(searchLower),
            ) ||
            areasConhecimento.some((area) =>
              (area?.toLowerCase() || '').includes(searchLower),
            ) ||
            tecnologias.some((tech) =>
              (tech?.toLowerCase() || '').includes(searchLower),
            )
          )
        }
        
        return true
      }).sort((a, b) => {
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
    }

    if (filteredInitiatives.length === 0) {
      return (
        <NoResults 
          searchTerm={searchTerm}
          selectedType={selectedType}
          selectedStatus={PublicStatusIniciativa.ATIVA}
          isAuthenticated={isAuthenticated}
        />
      )
    }

    return (
      <InitiativeList 
        initiatives={filteredInitiatives} 
        isLoading={false}
        onFavorite={handleFavorite}
        onUnfavorite={handleUnfavorite}
        isInitiativeFavorited={isInitiativeFavorited}
        currentUserId={user?.uid}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Vitrine Tecnológica UFC</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Vitrine de Iniciativas
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Descubra projetos inovadores de laboratórios, empresas, startups e pesquisadores da UFC
            </motion.p>
            
            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-200" />
                <span className="text-2xl font-bold">{initiatives?.length || 0}</span>
                <span className="text-purple-200">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-200" />
                <span className="text-2xl font-bold">
                  {initiatives?.filter(i => i.status === StatusIniciativa.ATIVA).length || 0}
                </span>
                <span className="text-purple-200">Ativas</span>
              </div>
              <div className="flex items-center gap-2">
                <HandHeart className="h-5 w-5 text-purple-200" />
                <span className="text-2xl font-bold">
                  {initiatives?.filter(i => i.status === StatusIniciativa.CONCLUIDA).length || 0}
                </span>
                <span className="text-purple-200">Concluídas</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-200" />
                <span className="text-2xl font-bold">
                  {initiatives?.filter(i => i.aceita_colaboradores).length || 0}
                </span>
                <span className="text-purple-200">Colaborativas</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchAndSort 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            handleSortChange={handleSortChange}
            handleSearch={handleSearch}
            handleRetry={handleRetry}
          />
        </motion.div>

        <Tabs
          defaultValue="all"
          className="w-full"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
            <TabsList className="bg-white border border-purple-100 p-1 rounded-2xl shadow-lg flex-wrap h-auto justify-start">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-4 sm:px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger
                value="ativa"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-4 sm:px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2"
              >
                Ativas
              </TabsTrigger>
              <TabsTrigger
                value="concluida"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-4 sm:px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2"
              >
                Concluídas
              </TabsTrigger>
              <TabsTrigger
                value="pausada"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-4 sm:px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2"
              >
                Pausadas
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Filters 
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedStatus={PublicStatusIniciativa.ATIVA}
              setSelectedStatus={() => {}}
              selectedMaturity={selectedMaturity}
              setSelectedMaturity={setSelectedMaturity}
              showCollaborating={showCollaborating}
              setShowCollaborating={setShowCollaborating}
              showInternational={showInternational}
              setShowInternational={setShowInternational}
              showWithIP={showWithIP}
              setShowWithIP={setShowWithIP}
            />
          </motion.div>

          <TabsContent value="all">
            {renderContent()}
          </TabsContent>
          <TabsContent value="ativa">
            {renderTabContent(StatusIniciativa.ATIVA)}
          </TabsContent>
          <TabsContent value="concluida">
            {renderTabContent(StatusIniciativa.CONCLUIDA)}
          </TabsContent>
          <TabsContent value="pausada">
            {renderTabContent(StatusIniciativa.PAUSADA)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
