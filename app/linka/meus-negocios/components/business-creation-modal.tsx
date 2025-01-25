/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { NegocioType, type NegocioCreate } from '@/lib/types/businessTypes'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info, Building, Briefcase, CheckCircle } from 'lucide-react'

const businessSchema = z
  .object({
    nome: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.string().email('Email inválido'),
    telefone: z
      .string()
      .min(14, 'Telefone deve ter pelo menos 14 caracteres (incluindo +55)'),
    tipo_negocio: z.nativeEnum(NegocioType),
    palavras_chave: z
      .array(z.string())
      .min(1, 'Pelo menos uma palavra-chave é obrigatória'),
    midias_sociais: z.record(z.string().url('URL inválida')).optional(),
    id_iniciativas: z.array(z.string()).optional(),
    descricao_problema: z
      .string()
      .min(1, 'Descrição do problema é obrigatória')
      .optional(),
    area_estrategica: z
      .string()
      .min(1, 'Área estratégica é obrigatória')
      .optional(),
    campus: z.string().min(1, 'Campus é obrigatório').optional(),
    cnae: z
      .string()
      .length(7, 'CNAE deve ter exatamente 7 caracteres')
      .optional(),
    area_de_atuacao: z
      .string()
      .min(1, 'Área de atuação é obrigatória')
      .optional(),
    demanda: z.string().min(1, 'Demanda é obrigatória').optional(),
  })
  .refine(
    (data) => {
      if (data.tipo_negocio === NegocioType.INCUBADO) {
        return (
          !!data.descricao_problema && !!data.area_estrategica && !!data.campus
        )
      }
      if (data.tipo_negocio === NegocioType.EXTERNO) {
        return !!data.cnae && !!data.area_de_atuacao && !!data.demanda
      }
      return true
    },
    {
      message:
        'Campos obrigatórios não fornecidos para o tipo de negócio selecionado',
      path: ['tipo_negocio'],
    },
  )

type BusinessFormData = z.infer<typeof businessSchema>

export function BusinessCreationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const { useCreateBusiness } = useBusinessApi()
  const createBusinessMutation = useCreateBusiness()
  const [businessType, setBusinessType] = useState<NegocioType>(
    NegocioType.EXTERNO,
  )

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      telefone: '+55',
      tipo_negocio: businessType,
      palavras_chave: [],
      midias_sociais: {},
    },
  })

  useEffect(() => {
    const userType = localStorage.getItem('userType')
    if (userType === 'estudante' || userType === 'pesquisador') {
      setBusinessType(NegocioType.INCUBADO)
    } else {
      setBusinessType(NegocioType.EXTERNO)
    }
  }, [])

  useEffect(() => {
    form.setValue('tipo_negocio', businessType)
  }, [businessType, form])

  const onSubmit = async (data: BusinessFormData) => {
    try {
      await createBusinessMutation.mutateAsync(data as NegocioCreate)
      onClose()
      form.reset()
      setStep(0)
    } catch (error) {
      console.error('Error creating business:', error)
      // Adicione aqui a lógica para mostrar uma mensagem de erro ao usuário
    }
  }

  const nextStep = () => {
    const currentStepFields = getFieldsForStep(step)
    const isStepValid = currentStepFields.every(
      (field) => !form.formState.errors[field],
    )

    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, 3))
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
      case 1:
        return ['nome', 'email', 'telefone', 'palavras_chave']
      case 2:
        return businessType === NegocioType.INCUBADO
          ? ['descricao_problema', 'area_estrategica', 'campus']
          : ['cnae', 'area_de_atuacao', 'demanda']
      default:
        return []
    }
  }

  const steps = [
    { title: 'Introdução', icon: <Info className="w-5 h-5" /> },
    { title: 'Informações Básicas', icon: <Building className="w-5 h-5" /> },
    { title: 'Detalhes Específicos', icon: <Briefcase className="w-5 h-5" /> },
    { title: 'Revisão', icon: <CheckCircle className="w-5 h-5" /> },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
        <div className="flex justify-between mb-4">
          {steps.map((s, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`flex flex-col items-center ${index === step ? 'text-black' : 'text-[#aaa]'}`}
                  >
                    {s.icon}
                    <span className="text-xs mt-1">{s.title}</span>
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
                <h3 className="text-lg font-semibold">
                  Bem-vindo à Criação de Negócio
                </h3>
                <p>
                  Neste processo, você irá cadastrar seu negócio em nossa
                  plataforma. Com base no seu perfil, seu negócio será
                  registrado como:
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">
                    {businessType === NegocioType.INCUBADO
                      ? 'Negócio Incubado'
                      : 'Negócio Externo'}
                  </h4>
                  {businessType === NegocioType.INCUBADO ? (
                    <p>
                      Ideal para startups e empresas em estágio inicial que
                      buscam suporte e mentoria. Você precisará fornecer
                      informações sobre o problema que seu negócio resolve, a
                      área estratégica e o campus associado.
                    </p>
                  ) : (
                    <p>
                      Para empresas já estabelecidas que desejam se conectar com
                      nossa rede. Você precisará fornecer o CNAE, área de
                      atuação e demanda específica.
                    </p>
                  )}
                </div>
                <p>
                  Vamos começar com algumas informações básicas sobre o seu
                  negócio.
                </p>
              </div>
            )}
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Negócio</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
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
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+5588999999999" />
                      </FormControl>
                      <FormDescription>
                        Inclua o código do país (+55 para Brasil)
                      </FormDescription>
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
                        <Input
                          {...field}
                          value={field.value?.join(', ') || ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.split(', ').filter(Boolean),
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Separe as palavras-chave por vírgula
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                {businessType === NegocioType.INCUBADO ? (
                  <>
                    <FormField
                      control={form.control}
                      name="descricao_problema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição do Problema</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="area_estrategica"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área Estratégica</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="campus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campus</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="cnae"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNAE</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={7} />
                          </FormControl>
                          <FormDescription>
                            Deve ter exatamente 7 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="area_de_atuacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área de Atuação</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="demanda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Demanda</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Revisão das Informações
                </h3>
                <p>
                  Por favor, revise todas as informações fornecidas antes de
                  criar o negócio:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>Nome do Negócio:</strong> {form.getValues('nome')}
                  </p>
                  <p>
                    <strong>Email:</strong> {form.getValues('email')}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {form.getValues('telefone')}
                  </p>
                  <p>
                    <strong>Tipo de Negócio:</strong>{' '}
                    {businessType === NegocioType.INCUBADO
                      ? 'Incubado'
                      : 'Externo'}
                  </p>
                  <p>
                    <strong>Palavras-chave:</strong>{' '}
                    {form.getValues('palavras_chave').join(', ')}
                  </p>
                  {businessType === NegocioType.INCUBADO ? (
                    <>
                      <p>
                        <strong>Descrição do Problema:</strong>{' '}
                        {form.getValues('descricao_problema')}
                      </p>
                      <p>
                        <strong>Área Estratégica:</strong>{' '}
                        {form.getValues('area_estrategica')}
                      </p>
                      <p>
                        <strong>Campus:</strong> {form.getValues('campus')}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>CNAE:</strong> {form.getValues('cnae')}
                      </p>
                      <p>
                        <strong>Área de Atuação:</strong>{' '}
                        {form.getValues('area_de_atuacao')}
                      </p>
                      <p>
                        <strong>Demanda:</strong> {form.getValues('demanda')}
                      </p>
                    </>
                  )}
                </div>
                <p>
                  Se todas as informações estiverem corretas, clique em
                  &quot;Criar Negócio&quot; para finalizar o processo.
                </p>
              </div>
            )}
            <DialogFooter>
              {step > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                </Button>
              ) : (
                <Button type="submit" disabled={!form.formState.isValid}>
                  Criar Negócio
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
