/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import useCampusOptions from '@/hooks/useCampusOptions'
import axios from 'axios'
import { Loader2, Plus } from 'lucide-react'
import jwt from 'jsonwebtoken'
import { unknown, z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DecodedToken } from '@/hooks/useVitrineData'
import { CampusOption } from '@/types/campusOptions'

const formSchema = z.object({
  type: z.enum(['startup', 'competencia', 'laboratorio']),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  tags: z.string().min(1, 'Tags são obrigatórias'),
  logo: z.instanceof(File).nullable(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  detailedDescription: z.string().min(1, 'Descrição detalhada é obrigatória'),
  email: z.string().email('Email inválido'),
  portfolioLink: z.string().url('Link inválido'),
  campus: z.string().min(1, 'Campus é obrigatório'),
  involvedCourses: z.string().min(1, 'Cursos envolvidos são obrigatórios'),
})

type FormData = z.infer<typeof formSchema>

export default function CreateItemModal({
  onItemCreated,
}: {
  onItemCreated: (item: unknown) => void
}) {
  const campusOptions = useCampusOptions()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      title: '',
      description: '',
      tags: '',
      logo: null,
      category: '',
      detailedDescription: '',
      email: '',
      portfolioLink: '',
      campus: '',
      involvedCourses: '',
    },
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])) as DecodedToken
        if (decoded && decoded.uid) {
          setUid(decoded.uid)
        }
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const onSubmit = async (data: FormData) => {
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
          formDataToSend.append(key, value)
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
        setIsOpen(false)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Item para a Vitrine</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campus" className="text-right">
              Campus
            </Label>
            <Controller
              name="campus"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {(campusOptions as unknown as CampusOption[]).map(
                      (option) => (
                        <SelectItem key={option.id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.campus && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.campus.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input id="title" {...field} className="col-span-3" />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea id="description" {...field} className="col-span-3" />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Input
                  id="tags"
                  {...field}
                  placeholder="Separadas por vírgula"
                  className="col-span-3"
                />
              )}
            />
            {errors.tags && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.tags.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logo" className="text-right">
              Logo
            </Label>
            <Controller
              name="logo"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  id="logo"
                  type="file"
                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                  {...field}
                  className="col-span-3"
                />
              )}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.logo.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Input id="category" {...field} className="col-span-3" />
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="detailedDescription" className="text-right">
              Descrição Detalhada
            </Label>
            <Controller
              name="detailedDescription"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="detailedDescription"
                  {...field}
                  className="col-span-3"
                />
              )}
            />
            {errors.detailedDescription && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.detailedDescription.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  {...field}
                  className="col-span-3"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portfolioLink" className="text-right">
              Link do Portfólio
            </Label>
            <Controller
              name="portfolioLink"
              control={control}
              render={({ field }) => (
                <Input
                  id="portfolioLink"
                  type="url"
                  {...field}
                  className="col-span-3"
                />
              )}
            />
            {errors.portfolioLink && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.portfolioLink.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campus" className="text-right">
              Campus
            </Label>
            <Controller
              name="campus"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campusOptions.map((campusName, index) => (
                      <SelectItem key={index} value={campusName}>
                        {campusName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.campus && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.campus.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="involvedCourses" className="text-right">
              Cursos Envolvidos
            </Label>
            <Controller
              name="involvedCourses"
              control={control}
              render={({ field }) => (
                <Input
                  id="involvedCourses"
                  {...field}
                  placeholder="Separados por vírgula"
                  className="col-span-3"
                />
              )}
            />
            {errors.involvedCourses && (
              <p className="text-red-500 text-sm col-span-4 text-right">
                {errors.involvedCourses.message}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Criar Item'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
