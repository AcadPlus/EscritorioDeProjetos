'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IniciativaCreate,
  TipoIniciativa,
  StatusIniciativa,
} from '@/lib/types/initiativeTypes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useInitiativesApi } from '@/lib/api/initiatives'
import { useBusinessApi } from '@/lib/api/business'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  FileText, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  Calendar,
  Hash,
  X,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type Step = 'business' | 'basic' | 'details'

interface StepConfig {
  id: Step
  title: string
  description: string
  icon: React.ReactNode
}

export default function CriarIniciativa() {
  const router = useRouter()
  const { useCreateInitiative } = useInitiativesApi()
  const { useGetUserBusinesses } = useBusinessApi()
  const createInitiativeMutation = useCreateInitiative()
  const { data: businesses, isLoading: businessesLoading } = useGetUserBusinesses()

  const [currentStep, setCurrentStep] = useState<Step>('business')
  const [formData, setFormData] = useState<Partial<IniciativaCreate>>({
    status: StatusIniciativa.ATIVA,
    laboratorios: [],
    palavras_chave: [],
    visivel: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [keywordInput, setKeywordInput] = useState('')

  const steps: StepConfig[] = [
    { 
      id: 'business', 
      title: 'Selecionar Negócio',
      description: 'Escolha o negócio vinculado à iniciativa',
      icon: <Building2 className="h-5 w-5" />
    },
    { 
      id: 'basic', 
      title: 'Informações Básicas',
      description: 'Defina título, descrição e tipo',
      icon: <FileText className="h-5 w-5" />
    },
    { 
      id: 'details', 
      title: 'Detalhes Finais',
      description: 'Complete com recursos e resultados esperados',
      icon: <Settings className="h-5 w-5" />
    },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  useEffect(() => {
    if (!businessesLoading && businesses && businesses.length === 0) {
      toast.error('Você precisa ter pelo menos um negócio cadastrado')
      router.push('/minhas-iniciativas')
    }
  }, [businesses, businessesLoading, router])

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (step) {
      case 'business':
        if (!formData.business_id) {
          newErrors.business_id = 'Selecione um negócio'
        }
        break
      case 'basic':
        if (!formData.titulo?.trim()) {
          newErrors.titulo = 'Título é obrigatório'
        }
        if (!formData.descricao?.trim()) {
          newErrors.descricao = 'Descrição é obrigatória'
        }
        if (!formData.tipo) {
          newErrors.tipo = 'Tipo é obrigatório'
        }
        if (!formData.data_inicio) {
          newErrors.data_inicio = 'Data de início é obrigatória'
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep === 'details') {
      try {
        await createInitiativeMutation.mutateAsync(formData as IniciativaCreate)
        toast.success('Iniciativa criada com sucesso!')
        router.push('/minhas-iniciativas')
      } catch (error) {
        toast.error('Erro ao criar iniciativa')
        console.error(error)
      }
    } else {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const handleBack = () => {
    setCurrentStep(steps[currentStepIndex - 1].id)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.palavras_chave?.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        palavras_chave: [...(prev.palavras_chave || []), keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      palavras_chave: prev.palavras_chave?.filter(k => k !== keyword)
    }))
  }

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  const getTipoLabel = (tipo: TipoIniciativa) => {
    const labels = {
      [TipoIniciativa.PESQUISA]: 'Pesquisa',
      [TipoIniciativa.INOVACAO]: 'Inovação',
      [TipoIniciativa.EMPREENDEDORISMO]: 'Empreendedorismo',
      [TipoIniciativa.EXTENSAO]: 'Extensão',
      [TipoIniciativa.OUTROS]: 'Outros'
    }
    return labels[tipo] || tipo
  }

  const getTipoIcon = (tipo: TipoIniciativa) => {
    switch (tipo) {
      case TipoIniciativa.PESQUISA:
        return '🔬'
      case TipoIniciativa.INOVACAO:
        return '💡'
      case TipoIniciativa.EMPREENDEDORISMO:
        return '🚀'
      case TipoIniciativa.EXTENSAO:
        return '🤝'
      default:
        return '📋'
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'business':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Selecione o Negócio</h3>
                <p className="text-gray-600">Escolha o negócio ao qual esta iniciativa estará vinculada</p>
              </div>
            </div>

            {(!businesses || businesses.length === 0) ? (
              <div className="text-center space-y-4 p-8 bg-red-50 rounded-xl border border-red-200">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <div>
                  <p className="text-red-700 font-medium">Nenhum negócio encontrado</p>
                  <p className="text-red-600 text-sm">Você precisa ter pelo menos um negócio cadastrado para criar uma iniciativa.</p>
                </div>
                <Button
                  type="button"
                  onClick={() => router.push('/meus-negocios')}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300"
                >
                  Criar Negócio
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_id" className="text-sm font-medium text-gray-700">
                    Negócio *
                  </Label>
                  <Select
                    value={formData.business_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, business_id: value })
                      if (errors.business_id) {
                        setErrors((prev) => ({ ...prev, business_id: '' }))
                      }
                    }}
                  >
                    <SelectTrigger className={`w-full bg-white border-2 ${errors.business_id ? 'border-red-300 focus:border-red-400' : 'border-purple-200 focus:border-purple-400'} focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 h-12`}>
                      <SelectValue placeholder="Selecione um negócio" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-purple-200 rounded-xl shadow-lg">
                      {businesses?.map((business) => (
                        <SelectItem key={business.id} value={business.id} className="hover:bg-purple-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-purple-600" />
                            </div>
                            <span>{business.nome}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.business_id && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.business_id}
                    </p>
                  )}
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Dica</p>
                      <p className="text-sm text-purple-700">
                        A iniciativa será vinculada ao negócio selecionado e aparecerá no perfil do negócio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )

      case 'basic':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Informações Básicas</h3>
                <p className="text-gray-600">Defina as informações principais da sua iniciativa</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-sm font-medium text-gray-700">
                  Título da Iniciativa *
                </Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo || ''}
                  onChange={handleChange}
                  placeholder="Ex: Desenvolvimento de aplicativo mobile"
                  className={`w-full bg-white border-2 ${errors.titulo ? 'border-red-300 focus:border-red-400' : 'border-purple-200 focus:border-purple-400'} focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 h-12`}
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.titulo}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
                  Descrição *
                </Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao || ''}
                  onChange={handleChange}
                  placeholder="Descreva detalhadamente sua iniciativa, seus objetivos e como ela será executada..."
                  className={`w-full bg-white border-2 ${errors.descricao ? 'border-red-300 focus:border-red-400' : 'border-purple-200 focus:border-purple-400'} focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 min-h-[120px] resize-none`}
                />
                {errors.descricao && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.descricao}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">
                  Tipo de Iniciativa *
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      tipo: value as TipoIniciativa,
                    }))
                    if (errors.tipo) {
                      setErrors((prev) => ({ ...prev, tipo: '' }))
                    }
                  }}
                >
                  <SelectTrigger className={`w-full bg-white border-2 ${errors.tipo ? 'border-red-300 focus:border-red-400' : 'border-purple-200 focus:border-purple-400'} focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 h-12`}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-200 rounded-xl shadow-lg">
                    {Object.values(TipoIniciativa).map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="hover:bg-purple-50">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getTipoIcon(tipo)}</span>
                          <span>{getTipoLabel(tipo)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.tipo}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_inicio" className="text-sm font-medium text-gray-700">
                    Data de Início *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <Input
                      id="data_inicio"
                      name="data_inicio"
                      type="date"
                      value={formData.data_inicio || ''}
                      onChange={handleChange}
                      className={`w-full pl-10 bg-white border-2 ${errors.data_inicio ? 'border-red-300 focus:border-red-400' : 'border-purple-200 focus:border-purple-400'} focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 h-12`}
                    />
                  </div>
                  {errors.data_inicio && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.data_inicio}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_fim" className="text-sm font-medium text-gray-700">
                    Data de Término (Opcional)
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <Input
                      id="data_fim"
                      name="data_fim"
                      type="date"
                      value={formData.data_fim || ''}
                      onChange={handleChange}
                      className="w-full pl-10 bg-white border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 h-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'details':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto">
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Detalhes Finais</h3>
                <p className="text-gray-600">Complete com informações adicionais sobre recursos e resultados</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recursos_necessarios" className="text-sm font-medium text-gray-700">
                  Recursos Necessários
                </Label>
                <Textarea
                  id="recursos_necessarios"
                  name="recursos_necessarios"
                  value={formData.recursos_necessarios || ''}
                  onChange={handleChange}
                  placeholder="Descreva os recursos necessários: financeiros, humanos, tecnológicos, etc."
                  className="w-full bg-white border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultados_esperados" className="text-sm font-medium text-gray-700">
                  Resultados Esperados
                </Label>
                <Textarea
                  id="resultados_esperados"
                  name="resultados_esperados"
                  value={formData.resultados_esperados || ''}
                  onChange={handleChange}
                  placeholder="Descreva os resultados esperados e o impacto da iniciativa..."
                  className="w-full bg-white border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Palavras-chave
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <Input
                      placeholder="Digite uma palavra-chave e pressione Enter"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={handleKeywordKeyPress}
                      className="w-full pl-10 bg-white border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200 h-12"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addKeyword}
                    disabled={!keywordInput.trim()}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300 px-6"
                  >
                    Adicionar
                  </Button>
                </div>
                
                {formData.palavras_chave && formData.palavras_chave.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.palavras_chave.map((palavra, index) => (
                      <Badge
                        key={index}
                        className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 transition-colors duration-200 px-3 py-1"
                      >
                        {palavra}
                        <button
                          type="button"
                          onClick={() => removeKeyword(palavra)}
                          className="ml-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Quase pronto!</p>
                    <p className="text-sm text-green-700">
                      Revise as informações e clique em "Criar Iniciativa" para finalizar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
    }
  }

  if (businessesLoading) {
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
              <Sparkles className="h-12 w-12 text-purple-600" />
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse" />
          </div>
          <motion.div
            className="text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <p className="text-gray-800 text-lg font-medium">Carregando...</p>
            <p className="text-gray-500 text-sm mt-1">Preparando formulário</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header decorativo */}
      <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Nova Iniciativa</span>
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Criar Iniciativa
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-2xl mx-auto shadow-xl border border-purple-100 bg-white relative overflow-hidden">
            {/* Decoração de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-violet-100/20 rounded-full -mr-16 -mt-16" />
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {steps[currentStepIndex].title}
                </CardTitle>
                <div className="text-sm text-gray-500 font-medium">
                  {currentStepIndex + 1} de {steps.length}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Progresso</span>
                  <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 bg-gray-200" 
                />
                
                <div className="flex justify-between mt-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 ${
                        index <= currentStepIndex
                          ? 'text-purple-600 font-medium'
                          : 'text-gray-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < currentStepIndex
                          ? 'bg-purple-600 text-white'
                          : index === currentStepIndex
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {index < currentStepIndex ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <span className="text-xs hidden sm:block">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStepIndex === 0}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={createInitiativeMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300 text-white"
                  >
                    {createInitiativeMutation.isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-4 h-4 mr-2"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Criando...
                      </>
                    ) : currentStep === 'details' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Criar Iniciativa
                      </>
                    ) : (
                      <>
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 