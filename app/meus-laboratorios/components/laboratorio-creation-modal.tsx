/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useLaboratorioApi } from '@/lib/api/laboratorio'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TipoLaboratorio, type LaboratorioCreate } from '@/lib/types/laboratorioTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PhoneInput } from '@/components/phone-input'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

const laboratorioSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  unidade: z
    .string()
    .min(2, 'Unidade deve ter pelo menos 2 caracteres')
    .max(100, 'Unidade deve ter no máximo 100 caracteres'),
  subunidade: z.string().optional(),
  responsavel: z
    .string()
    .min(3, 'Nome do responsável deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do responsável deve ter no máximo 100 caracteres'),
  telefone: z
    .string()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres (incluindo +55)'),
  email: z.string().email('Email inválido'),
  tipo: z.nativeEnum(TipoLaboratorio),
  campus: z.string().optional(),
  sala: z.string().optional(),
  endereco: z.string().optional(),
  descricao: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  areas_pesquisa: z
    .array(z.string())
    .max(10, 'Máximo de 10 áreas de pesquisa')
    .optional(),
  equipamentos: z
    .array(z.string())
    .max(20, 'Máximo de 20 equipamentos')
    .optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
})

type LaboratorioFormData = z.infer<typeof laboratorioSchema>

export function LaboratorioCreationModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const { useCreateLaboratorio } = useLaboratorioApi()
  const createLaboratorioMutation = useCreateLaboratorio()
  const [newArea, setNewArea] = useState('')
  const [newEquipamento, setNewEquipamento] = useState('')

  const form = useForm<LaboratorioFormData>({
    resolver: zodResolver(laboratorioSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      unidade: '',
      subunidade: '',
      responsavel: '',
      telefone: '+55',
      email: '',
      tipo: TipoLaboratorio.PESQUISA,
      campus: '',
      sala: '',
      endereco: '',
      descricao: '',
      areas_pesquisa: [],
      equipamentos: [],
      website: '',
    },
  })

  const onSubmit = async (data: LaboratorioFormData) => {
    try {
      const laboratorioData: LaboratorioCreate = {
        nome: data.nome,
        unidade: data.unidade,
        subunidade: data.subunidade || undefined,
        responsavel: data.responsavel,
        telefone: data.telefone,
        email: data.email,
        tipo: data.tipo,
        campus: data.campus || undefined,
        sala: data.sala || undefined,
        endereco: data.endereco || undefined,
        descricao: data.descricao || undefined,
        areas_pesquisa: data.areas_pesquisa || [],
        equipamentos: data.equipamentos || [],
        website: data.website || undefined,
      }

      await createLaboratorioMutation.mutateAsync(laboratorioData)
      onClose()
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao criar laboratório:', error)
    }
  }

  const addAreaPesquisa = () => {
    if (newArea.trim() && newArea.length <= 50) {
      const currentAreas = form.getValues('areas_pesquisa') || []
      if (currentAreas.length < 10) {
        form.setValue('areas_pesquisa', [...currentAreas, newArea.trim()])
        setNewArea('')
      }
    }
  }

  const removeAreaPesquisa = (index: number) => {
    const currentAreas = form.getValues('areas_pesquisa') || []
    form.setValue('areas_pesquisa', currentAreas.filter((_, i) => i !== index))
  }

  const addEquipamento = () => {
    if (newEquipamento.trim() && newEquipamento.length <= 100) {
      const currentEquipamentos = form.getValues('equipamentos') || []
      if (currentEquipamentos.length < 20) {
        form.setValue('equipamentos', [...currentEquipamentos, newEquipamento.trim()])
        setNewEquipamento('')
      }
    }
  }

  const removeEquipamento = (index: number) => {
    const currentEquipamentos = form.getValues('equipamentos') || []
    form.setValue('equipamentos', currentEquipamentos.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Laboratório</DialogTitle>
          <DialogDescription>
            Preencha as informações básicas do laboratório. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Laboratório *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Laboratório de Inovação Tecnológica" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TipoLaboratorio.PESQUISA}>Pesquisa</SelectItem>
                          <SelectItem value={TipoLaboratorio.ENSINO}>Ensino</SelectItem>
                          <SelectItem value={TipoLaboratorio.EXTENSAO}>Extensão</SelectItem>
                          <SelectItem value={TipoLaboratorio.DESENVOLVIMENTO}>Desenvolvimento</SelectItem>
                          <SelectItem value={TipoLaboratorio.MULTIDISCIPLINAR}>Multidisciplinar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: UFC, IFCE, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subunidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subunidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Departamento de Computação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Responsável e Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Responsável e Contato</h3>

              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@ufc.br" {...field} />
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
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Localização</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="campus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Pici, Russas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sala"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 123, L102" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Descrição</h3>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição das Atividades</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva as atividades, objetivos e missão do laboratório..."
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
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://laboratorio.ufc.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Áreas de Pesquisa */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Áreas de Pesquisa</h3>

              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar área de pesquisa"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAreaPesquisa())}
                  maxLength={50}
                />
                <Button type="button" onClick={addAreaPesquisa} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.watch('areas_pesquisa')?.map((area, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeAreaPesquisa(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Equipamentos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Equipamentos</h3>

              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar equipamento"
                  value={newEquipamento}
                  onChange={(e) => setNewEquipamento(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipamento())}
                  maxLength={100}
                />
                <Button type="button" onClick={addEquipamento} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.watch('equipamentos')?.map((equipamento, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {equipamento}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeEquipamento(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createLaboratorioMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {createLaboratorioMutation.isPending ? 'Criando...' : 'Criar Laboratório'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
