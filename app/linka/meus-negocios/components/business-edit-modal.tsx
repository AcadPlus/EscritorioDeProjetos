// components/business-edit-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useBusinessApi } from '@/lib/api/business'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  NegocioType,
  type NegocioUpdate,
  type NegocioResponse,
} from '@/lib/types/businessTypes'
import { toast } from '@/hooks/use-toast'

const businessEditSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z
    .string()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres (incluindo +55)'),
  palavras_chave: z
    .array(z.string())
    .min(1, 'Pelo menos uma palavra-chave é obrigatória'),
  descricao_problema: z.string().optional(),
  area_estrategica: z.string().optional(),
  campus: z.string().optional(),
  cnae: z
    .string()
    .length(7, 'CNAE deve ter exatamente 7 caracteres')
    .optional(),
  area_de_atuacao: z.string().optional(),
  demanda: z.string().optional(),
})

type BusinessEditFormData = z.infer<typeof businessEditSchema>

interface BusinessEditModalProps {
  isOpen: boolean
  onClose: () => void
  business: NegocioResponse
}

export function BusinessEditModal({
  isOpen,
  onClose,
  business,
}: BusinessEditModalProps) {
  const { useUpdateBusiness } = useBusinessApi()
  const updateBusinessMutation = useUpdateBusiness()

  const form = useForm<BusinessEditFormData>({
    resolver: zodResolver(businessEditSchema),
    defaultValues: {
      nome: business.nome,
      email: business.email,
      telefone: business.telefone,
      palavras_chave: business.palavras_chave,
      descricao_problema: business.descricao_problema,
      area_estrategica: business.area_estrategica,
      campus: business.campus,
      cnae: business.cnae,
      area_de_atuacao: business.area_de_atuacao,
      demanda: business.demanda,
    },
  })

  const onSubmit = async (data: BusinessEditFormData) => {
    try {
      await updateBusinessMutation.mutateAsync({
        businessId: business.id,
        updateData: data as NegocioUpdate,
      })
      toast({
        title: 'Negócio atualizado com sucesso',
        duration: 3000,
      })
      onClose()
    } catch (error) {
      console.error('Error updating business:', error)
      toast({
        title: 'Erro ao atualizar negócio',
        description: 'Por favor, tente novamente.',
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Negócio</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input {...field} />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {business.tipo_negocio === NegocioType.INCUBADO ? (
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateBusinessMutation.isLoading}>
                {updateBusinessMutation.isLoading
                  ? 'Atualizando...'
                  : 'Atualizar Negócio'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
