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
import { ChevronRight, ChevronLeft } from 'lucide-react'

type Step = 'business' | 'basic' | 'details'

export default function CriarIniciativa() {
  const router = useRouter()
  const { useCreateInitiative } = useInitiativesApi()
  const { useGetUserBusinesses } = useBusinessApi()
  const createInitiativeMutation = useCreateInitiative()
  const { data: businesses } = useGetUserBusinesses()

  const [currentStep, setCurrentStep] = useState<Step>('business')
  const [formData, setFormData] = useState<Partial<IniciativaCreate>>({
    status: StatusIniciativa.ATIVA,
    laboratorios: [],
    palavras_chave: [],
  })

  useEffect(() => {
    if (businesses && businesses.length === 0) {
      router.push('/linka/minhas-iniciativas')
    }
  }, [businesses, router])

  const steps: { id: Step; title: string }[] = [
    { id: 'business', title: 'Selecionar Negócio' },
    { id: 'basic', title: 'Informações Básicas' },
    { id: 'details', title: 'Detalhes Adicionais' },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 'details') {
      try {
        await createInitiativeMutation.mutateAsync(formData as IniciativaCreate)
        router.push('/linka/iniciativas')
      } catch (error) {
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
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'business':
        return (
          <div className="space-y-4">
            {(!businesses || businesses.length === 0) ? (
              <div className="text-center space-y-4">
                <p className="text-red-600">
                  Você precisa ter pelo menos um negócio cadastrado para criar uma iniciativa.
                </p>
                <Button
                  type="button"
                  onClick={() => router.push('/linka/meus-negocios')}
                  variant="secondary"
                >
                  Criar Negócio
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="business_id">Selecione o Negócio</Label>
                  <Select
                    value={formData.business_id}
                    onValueChange={(value) => setFormData({ ...formData, business_id: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um negócio" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses?.map((business) => (
                        <SelectItem key={business.id} value={business.id}>
                          {business.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-gray-500">
                  Escolha o negócio ao qual esta iniciativa está vinculada
                </p>
              </>
            )}
          </div>
        )

      case 'basic':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da Iniciativa</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Iniciativa</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipo: value as TipoIniciativa,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoIniciativa).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início</Label>
                <Input
                  id="data_inicio"
                  name="data_inicio"
                  type="date"
                  value={formData.data_inicio || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Término (Opcional)</Label>
                <Input
                  id="data_fim"
                  name="data_fim"
                  type="date"
                  value={formData.data_fim || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )

      case 'details':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recursos_necessarios">Recursos Necessários</Label>
              <Textarea
                id="recursos_necessarios"
                name="recursos_necessarios"
                value={formData.recursos_necessarios || ''}
                onChange={handleChange}
                placeholder="Descreva os recursos necessários para a iniciativa..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultados_esperados">Resultados Esperados</Label>
              <Textarea
                id="resultados_esperados"
                name="resultados_esperados"
                value={formData.resultados_esperados || ''}
                onChange={handleChange}
                placeholder="Descreva os resultados esperados da iniciativa..."
              />
            </div>

            <div className="space-y-2">
              <Label>Palavras-chave</Label>
              <Input
                placeholder="Digite palavras-chave separadas por vírgula"
                onChange={(e) => {
                  const palavras = e.target.value
                    .split(',')
                    .map((p) => p.trim())
                    .filter(Boolean)
                  setFormData((prev) => ({
                    ...prev,
                    palavras_chave: palavras,
                  }))
                }}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.palavras_chave?.map((palavra) => (
                  <span
                    key={palavra}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {palavra}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          palavras_chave: prev.palavras_chave?.filter(
                            (p) => p !== palavra,
                          ),
                        }))
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Iniciativa</CardTitle>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-sm ${
                    index <= currentStepIndex
                      ? 'text-primary font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={createInitiativeMutation.isPending}
              >
                {currentStep === 'details' ? (
                  createInitiativeMutation.isPending ? (
                    'Criando...'
                  ) : (
                    'Criar Iniciativa'
                  )
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
    </div>
  )
} 