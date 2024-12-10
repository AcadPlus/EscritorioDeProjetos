/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { AbstractVitrineFactory } from '@/app/factories/AbstractVitrineFactory'

interface GenericFormProps {
  factory: AbstractVitrineFactory
  onItemCreated: (item: unknown) => void
}

export default function GenericForm({
  factory,
  onItemCreated,
}: GenericFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)

  const formSchema = factory.createSchema()
  const fields = factory.createFields()
  const title = factory.getTitle()
  const type = factory.getType()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {} as any,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])) as { uid: string }
        if (decoded && decoded.uid) {
          setUid(decoded.uid)
        }
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const onSubmit = async (data: any) => {
    if (!uid) {
      toast({
        title: 'Erro',
        description: 'Usuário não autenticado',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    const formDataToSend = new FormData()

    // Add the type field
    formDataToSend.append('type', type)

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null) {
        if (key === 'tags' || key === 'involvedCourses') {
          if (typeof value === 'string') {
            formDataToSend.append(
              key,
              JSON.stringify(
                value.split(',').map((item: string) => item.trim()),
              ),
            )
          }
        } else if (key === 'logo' && value instanceof File) {
          formDataToSend.append('logo', value)
        } else {
          formDataToSend.append(key, value as string)
        }
      }
    })

    formDataToSend.append('responsibleUser', uid)

    try {
      const response = await axios.post('/api/vitrines', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.status === 201) {
        onItemCreated(response.data.newItem)
        reset()
        toast({
          title: 'Sucesso',
          description: 'Item criado com sucesso!',
          variant: 'success',
        })
      }
    } catch (error) {
      console.error('Erro ao criar item:', error)
      toast({
        title: 'Erro',
        description:
          'Não foi possível criar o item. Por favor, tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {fields.map((field) => (
          <div key={field.name} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={field.name} className="text-right">
              {field.label}
            </Label>
            {field.type === 'select' ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={`Selecione ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : field.type === 'textarea' ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field }) => (
                  <Textarea id={field.name} {...field} className="col-span-3" />
                )}
              />
            ) : field.type === 'file' ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Input
                    id={field.name}
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        onChange(file)
                      }
                    }}
                    {...rest}
                    className="col-span-3"
                  />
                )}
              />
            ) : (
              <Controller
                name={field.name}
                control={control}
                render={({ field }) => (
                  <Input
                    id={field.name}
                    type={field.type || 'text'}
                    {...field}
                    className="col-span-3"
                  />
                )}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
        <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Criar Item'
          )}
        </Button>
      </form>
    </>
  )
}
