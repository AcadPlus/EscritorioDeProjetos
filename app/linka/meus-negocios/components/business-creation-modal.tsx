/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useBusinessApi } from '@/lib/api/business'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NegocioType, AreaAtuacao, EstagioNegocio, type NegocioCreate } from '@/lib/types/businessTypes'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info, Building, Briefcase, CheckCircle, FileText } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PhoneInput } from '@/components/phone-input'
import { Badge } from '@/components/ui/badge'

const Campus = {
  PICI: 'PICI',
  RUSSAS: 'RUSSAS',
  CRATEUS: 'CRATEÚS',
  QUIXADA: 'QUIXADÁ',
  BENFICA: 'BENFICA',
  PORANGABUCU: 'PORANGABUÇU',
  SOBRAL: 'SOBRAL',
  ITAPAJE: 'ITAPAJÉ',
} as const

const businessSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z
    .string()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres (incluindo +55)'),
  area_atuacao: z.nativeEnum(AreaAtuacao),
  estagio: z.nativeEnum(EstagioNegocio),
  palavras_chave: z
    .array(z.string())
    .min(1, 'Pelo menos uma palavra-chave é obrigatória'),
  descricao_problema: z
    .string()
    .min(10, 'A descrição do problema deve ter pelo menos 10 caracteres'),
  solucao_proposta: z
    .string()
    .min(10, 'A descrição da solução proposta deve ter pelo menos 10 caracteres'),
  midias_sociais: z
    .object({
      website: z.string().optional().nullable(),
      linkedin: z.string().optional().nullable(),
      instagram: z.string().optional().nullable(),
      facebook: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  cnpj: z
    .string()
    .regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos')
    .optional(),
  cnae: z
    .string()
    .regex(/^\d{7}$/, 'CNAE deve ter 7 dígitos')
    .optional(),
  razao_social: z.string().optional(),
  area_de_atuacao: z.string().optional(),
  demanda: z.string().optional(),
})

type BusinessFormData = z.infer<typeof businessSchema>

export function BusinessCreationModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [step, setStep] = useState(0)
  const { useCreateBusiness } = useBusinessApi()
  const createBusinessMutation = useCreateBusiness()
  const [newTag, setNewTag] = useState('')

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      telefone: '+55',
      area_atuacao: AreaAtuacao.TECNOLOGIA,
      estagio: EstagioNegocio.IDEACAO,
      palavras_chave: [],
      descricao_problema: '',
      solucao_proposta: '',
      midias_sociais: {
        website: '',
        linkedin: '',
        instagram: '',
        facebook: '',
      },
    },
  })

  const onSubmit = async (data: BusinessFormData) => {
    try {
      const businessData = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        area_atuacao: data.area_atuacao,
        estagio: data.estagio,
        descricao_problema: data.descricao_problema,
        solucao_proposta: data.solucao_proposta,
        palavras_chave: data.palavras_chave,
        
        cnpj: data.cnpj,
        cnae: data.cnae,
        razao_social: data.razao_social,
        midias_sociais: data.midias_sociais,
      }
      
      await createBusinessMutation.mutateAsync(businessData as any)
      onClose()
      form.reset()
      setStep(0)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Erro ao criar negócio:', error)
    }
  }

  const nextStep = () => {
    const currentStepFields = getFieldsForStep(step)
    const isStepValid = currentStepFields.every(
      (field) => !form.formState.errors[field],
    )

    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, 4))
    } else {
      // Trigger validation for the current step fields
      form.trigger(currentStepFields as any)
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const getFieldsForStep = (stepNumber: number): (keyof BusinessFormData)[] => {
    switch (stepNumber) {
      case 0:
        return ['nome', 'email', 'telefone']
      case 1:
        return ['area_atuacao', 'estagio']
      case 2:
        return ['descricao_problema', 'solucao_proposta', 'palavras_chave']
      case 3:
        return ['cnpj', 'cnae', 'razao_social']
      case 4:
        return ['midias_sociais']
      default:
        return []
    }
  }

  const steps = [
    { title: 'Informações Básicas', icon: <Info className="w-5 h-5" /> },
    { title: 'Categorização', icon: <Building className="w-5 h-5" /> },
    { title: 'Descrição', icon: <FileText className="w-5 h-5" /> },
    { title: 'Documentação', icon: <Briefcase className="w-5 h-5" /> },
    { title: 'Redes Sociais', icon: <CheckCircle className="w-5 h-5" /> },
  ]

  const getAreaAtuacaoLabel = (value: AreaAtuacao): string => {
    const labels = {
      [AreaAtuacao.TECNOLOGIA]: 'Tecnologia',
      [AreaAtuacao.SAUDE]: 'Saúde',
      [AreaAtuacao.EDUCACAO]: 'Educação',
      [AreaAtuacao.SUSTENTABILIDADE]: 'Sustentabilidade',
      [AreaAtuacao.INDUSTRIA]: 'Indústria',
      [AreaAtuacao.SERVICOS]: 'Serviços',
      [AreaAtuacao.VAREJO]: 'Varejo',
      [AreaAtuacao.FINANCAS]: 'Finanças',
      [AreaAtuacao.OUTRO]: 'Outro',
    }
    return labels[value] || value
  }

  const getEstagioLabel = (value: EstagioNegocio): string => {
    const labels = {
      [EstagioNegocio.IDEACAO]: 'Ideação',
      [EstagioNegocio.VALIDACAO]: 'Validação',
      [EstagioNegocio.MVP]: 'MVP',
      [EstagioNegocio.OPERACAO]: 'Operação',
      [EstagioNegocio.CRESCIMENTO]: 'Crescimento',
      [EstagioNegocio.ESCALA]: 'Escala',
    }
    return labels[value] || value
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      const currentTags = form.getValues('palavras_chave')
      if (!currentTags.includes(newTag.trim())) {
        form.setValue('palavras_chave', [...currentTags, newTag.trim()])
      }
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('palavras_chave')
    form.setValue(
      'palavras_chave',
      currentTags.filter((tag) => tag !== tagToRemove)
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Negócio</DialogTitle>
          <DialogDescription>
            Preencha os dados do seu negócio em {steps.length} etapas simples.
          </DialogDescription>
        </DialogHeader>
        <Progress
          value={(step / (steps.length - 1)) * 100}
          className="w-full"
        />
        <div className="flex justify-between mb-4 overflow-x-auto py-2 px-1">
          {steps.map((s, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`flex flex-col items-center ${
                      index === step ? 'text-black' : 'text-[#aaa]'
                    }`}
                  >
                    {s.icon}
                    <span className="text-xs mt-1 whitespace-nowrap">
                      {s.title}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{s.title}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 0 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Negócio *</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do seu negócio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@seunegocio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.telefone?.message}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="area_atuacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área de Atuação *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value as AreaAtuacao)}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a área de atuação" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AreaAtuacao).map((value) => (
                              <SelectItem key={value} value={value}>
                                {getAreaAtuacaoLabel(value as AreaAtuacao)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estagio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estágio do Negócio *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value as EstagioNegocio)}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estágio do negócio" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(EstagioNegocio).map((value) => (
                              <SelectItem key={value} value={value}>
                                {getEstagioLabel(value as EstagioNegocio)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        O estágio atual de desenvolvimento do seu negócio
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="descricao_problema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Problema *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o problema que seu negócio resolve..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="solucao_proposta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solução Proposta *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva a solução que seu negócio oferece..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="palavras_chave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palavras-chave</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              placeholder="Digite uma palavra-chave e pressione Enter"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={handleAddTag}
                            />
                            <span className="ml-2 text-sm text-muted-foreground">
                              {field.value.length}/5
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-muted/50">
                            {field.value.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                {tag} ×
                              </Badge>
                            ))}
                            {field.value.length === 0 && (
                              <span className="text-sm text-muted-foreground">
                                Adicione palavras-chave para melhorar a visibilidade do seu negócio
                              </span>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Adicione até 5 palavras-chave que descrevam seu negócio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Se já possuir, digite apenas os números
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnae"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNAE</FormLabel>
                      <FormControl>
                        <Input placeholder="0000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Se já possuir, digite apenas os números
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="razao_social"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social</FormLabel>
                      <FormControl>
                        <Input placeholder="Razão social da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="midias_sociais.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.seunegocio.com" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="midias_sociais.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.linkedin.com/company/seunegocio" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="midias_sociais.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.instagram.com/seunegocio" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="midias_sociais.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.facebook.com/seunegocio" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter>
              {step > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createBusinessMutation.isPending}
                >
                  {createBusinessMutation.isPending
                    ? 'Criando...'
                    : 'Criar Negócio'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
