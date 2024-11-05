'use client'

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

export default function CreateItemModal({
  onItemCreated,
}: {
  onItemCreated: (item: any) => void
}) {
  const campusOptions = useCampusOptions()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [uid, setUid] = useState('')
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    tags: '',
    // image: null as File | null,
    logo: null as File | null,
    category: '',
    detailedDescription: '',
    email: '',
    portfolioLink: '',
    campus: '',
    involvedCourses: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt.decode(token)
      setUid(decoded.uid as string)
    }
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const formDataToSend = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (key === 'tags' || key === 'involvedCourses') {
          formDataToSend.append(
            key,
            JSON.stringify(value.split(',').map((item) => item.trim())),
          )
        } else {
          formDataToSend.append(key, value)
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
        setFormData({
          type: '',
          title: '',
          description: '',
          tags: '',
          // image: null,
          logo: null,
          category: '',
          detailedDescription: '',
          email: '',
          portfolioLink: '',
          campus: '',
          involvedCourses: '',
        })
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Item para a Vitrine</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
              value={formData.type}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Tipo de Item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="competencia">Competência</SelectItem>
                <SelectItem value="laboratorio">Laboratório</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Separadas por vírgula"
              className="col-span-3"
            />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Imagem</Label>
            <Input id="image" name="image" type="file" onChange={handleFileChange} className="col-span-3" />
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logo" className="text-right">
              Logo
            </Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="detailedDescription" className="text-right">
              Descrição Detalhada
            </Label>
            <Textarea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portfolioLink" className="text-right">
              Link do Portfólio
            </Label>
            <Input
              id="portfolioLink"
              name="portfolioLink"
              value={formData.portfolioLink}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campus" className="text-right">
              Campus
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, campus: value }))
              }
              value={formData.campus}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o campus" />
              </SelectTrigger>
              <SelectContent>
                {campusOptions.map((campus) => (
                  <SelectItem key={campus} value={campus}>
                    {campus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="involvedCourses" className="text-right">
              Cursos Envolvidos
            </Label>
            <Input
              id="involvedCourses"
              name="involvedCourses"
              value={formData.involvedCourses}
              onChange={handleInputChange}
              placeholder="Separados por vírgula"
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Item'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
