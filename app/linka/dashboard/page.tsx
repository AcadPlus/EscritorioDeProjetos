'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Mail,
  Link as LinkIcon,
  MapPin,
  GraduationCap,
  Loader2,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SidebarWrapper from '@/lib/sidebar_wrapper'
import { motion, AnimatePresence } from 'framer-motion'
import CreateItemModal from '@/components/criar-vitrine'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import ImageDisplay from '@/app/ui/imageDisplay'

const ITEMS_PER_PAGE = 9

export default function VitrinesComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt.decode(token)
      setCurrentUser(decoded?.uid)
    }
  }, [])

  const [activeTab, setActiveTab] = useState('startup')
  const [vitrines, setVitrines] = useState([])
  const [userDisplayNames, setUserDisplayNames] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const { toast } = useToast()

  const [editingItem, setEditingItem] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editTags, setEditTags] = useState([])

  const handleEdit = (itemId) => {
    const itemToEdit = vitrines.find((item) => item._id === itemId)
    if (itemToEdit) {
      setEditingItem(itemToEdit)
      setEditTitle(itemToEdit.title)
      setEditDescription(itemToEdit.description)
      setEditTags(itemToEdit.tags)
    }
  }

  const handleEditSubmit = async () => {
    if (editingItem) {
      try {
        const response = await axios.put(
          '/api/vitrines',
          {
            id: editingItem._id,
            title: editTitle,
            description: editDescription,
            tags: editTags,
            creatorId: currentUser,
            updatedAt: Date.now(),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.status === 200) {
          setVitrines(
            vitrines.map((item) =>
              item._id === editingItem._id
                ? {
                    ...item,
                    title: editTitle,
                    description: editDescription,
                    tags: editTags,
                  }
                : item,
            ),
          )
          toast({
            title: 'Item Atualizado',
            description: 'O item foi atualizado com sucesso.',
            variant: 'success',
          })
          setEditingItem(null)
        } else {
          alert('Erro ao atualizar o item.')
        }
      } catch (error) {
        console.error('Erro ao atualizar o item:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar o item.',
          variant: 'destructive',
        })
      }
    }
  }

  const fetchVitrines = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/vitrines', {
        // params: {
        //   page,
        //   limit: ITEMS_PER_PAGE,
        //   type: activeTab,
        //   search: searchQuery,
        //   sort: sortBy,
        // }
      })

      const newVitrines = response.data.vitrines
      console.log(newVitrines)
      setVitrines((prevVitrines) =>
        page === 1 ? newVitrines : [...prevVitrines, ...newVitrines],
      )
      setHasMore(newVitrines?.length === ITEMS_PER_PAGE)
      fetchUserDisplayNames(newVitrines.map((item) => item.responsibleUser))
    } catch (error) {
      console.log(error)
      setError(
        'Não foi possível carregar as vitrines. Por favor, tente novamente mais tarde.',
      )
      toast({
        title: 'Erro',
        description:
          'Não foi possível carregar as vitrines. Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, activeTab, searchQuery, sortBy, toast])

  useEffect(() => {
    fetchVitrines()
  }, [fetchVitrines])

  const fetchUserDisplayNames = async (userIds) => {
    try {
      const uniqueIds = [...new Set(userIds)]
      const promises = uniqueIds.map((id) =>
        fetch(`/api/users/${id}`).then((res) => res.json()),
      )

      const users = await Promise.all(promises)
      const displayNamesMap = {}
      users.forEach((user) => {
        if (user && user.displayName) {
          displayNamesMap[user.uid] = user.displayName
        }
      })

      setUserDisplayNames((prevNames) => ({ ...prevNames, ...displayNamesMap }))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setVitrines([])
    setPage(1)
    fetchVitrines()
  }

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handleNewItem = () => {
    fetchVitrines()
    // setVitrines(prevVitrines => [newItem, ...prevVitrines])
    toast({
      title: 'Item Criado',
      description: 'O novo item foi adicionado com sucesso à vitrine.',
      variant: 'success',
    })
  }
  const handleSortChange = (value) => {
    setSortBy(value)
    setVitrines([])
    setPage(1)
  }

  useEffect(() => {
    if (!vitrines) return
    const filteredItemsTemp = vitrines.filter(
      (vitrine) =>
        vitrine.type === activeTab &&
        (vitrine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vitrine.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())),
    )
    setFilteredItems(filteredItemsTemp)
  }, [vitrines])

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        const response = await axios.delete('/api/vitrines', {
          params: {
            id,
            creatorId: currentUser,
          },
        })

        if (response.status === 204) {
          setVitrines(vitrines.filter((item) => item._id !== id))
          toast({
            title: 'Item Excluído',
            description: 'O item foi excluído com sucesso.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Erro',
            description: 'Erro ao excluir o item.',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Erro ao excluir o item:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o item.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <>
      <SidebarWrapper />
      <div className="min-h-screen bg-gray-100 flex">
        <div className="flex-1">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 md:mb-0">
                  Explore as Vitrines
                </h2>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center space-x-2 w-full md:w-auto"
                  >
                    <Input
                      className="w-full bg-white md:w-64"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="bg-white"
                      size="icon"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white">
                        <Filter className="mr-2 h-4 w-4" />
                        Ordenar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      <DropdownMenuItem
                        onSelect={() => handleSortChange('recent')}
                      >
                        Mais Recentes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleSortChange('oldest')}
                      >
                        Mais Antigos
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleSortChange('alphabetical')}
                      >
                        Ordem Alfabética
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <CreateItemModal onItemCreated={handleNewItem} />
                </div>
              </div>
              <p className="text-gray-600">
                Descubra oportunidades em Startups, Competências e Laboratórios
                da UFC.
              </p>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value)
                setVitrines([])
                setPage(1)
              }}
            >
              <TabsList className="mb-4 gap-2">
                <TabsTrigger className="bg-white" value="startup">
                  Startups
                </TabsTrigger>
                <TabsTrigger className="bg-white" value="competencia">
                  Competências
                </TabsTrigger>
                <TabsTrigger className="bg-white" value="laboratorio">
                  Laboratórios
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {error && (
                  <div className="text-center text-red-500 mb-4">{error}</div>
                )}
                <AnimatePresence>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                          <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ImageDisplay
                              image={item.logo}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <CardDescription>
                              {item.description}
                            </CardDescription>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={item.image}
                                  alt={item.responsibleUser}
                                />
                                <AvatarFallback>
                                  {userDisplayNames[item.responsibleUser]
                                    ? userDisplayNames[item.responsibleUser]
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                    : item.responsibleUser
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {userDisplayNames[item.responsibleUser] ||
                                  item.responsibleUser}
                              </span>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">Detalhes</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                  <DialogTitle>{item.title}</DialogTitle>
                                  <DialogDescription>
                                    {item.category}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <ImageDisplay
                                    image={item.logo}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    <p>{item.detailedDescription}</p>
                                  </ScrollArea>
                                  <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="secondary">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <Separator />
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">
                                      Informações de Contato
                                    </h4>
                                    {/* Informações de contato */}
                                  </div>

                                  {/* Exibir opções de editar e excluir se o usuário for o dono */}
                                  {editingItem && (
                                    <Dialog
                                      open={!!editingItem}
                                      onOpenChange={() => setEditingItem(null)}
                                    >
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Editar Vitrine
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <Input
                                            value={editTitle}
                                            onChange={(e) =>
                                              setEditTitle(e.target.value)
                                            }
                                            placeholder="Título"
                                          />
                                          <Input
                                            value={editDescription}
                                            onChange={(e) =>
                                              setEditDescription(e.target.value)
                                            }
                                            placeholder="Descrição"
                                          />
                                          <Input
                                            value={editTags.join(', ')}
                                            onChange={(e) =>
                                              setEditTags(
                                                e.target.value
                                                  .split(',')
                                                  .map((tag) => tag.trim()),
                                              )
                                            }
                                            placeholder="Tags (separadas por vírgula)"
                                          />
                                        </div>
                                        <DialogFooter>
                                          <Button
                                            variant="outline"
                                            onClick={() => setEditingItem(null)}
                                          >
                                            Cancelar
                                          </Button>
                                          <Button onClick={handleEditSubmit}>
                                            Salvar
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}

                                  {item.responsibleUser === currentUser && ( // currentUser deve ser o ID do usuário logado
                                    <div className="flex justify-between mt-4">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleEdit(item._id)}
                                      >
                                        Editar
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => handleDelete(item._id)}
                                      >
                                        Excluir
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
                {isLoading && (
                  <div className="flex justify-center items-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                {!isLoading && filteredItems.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    Nenhum resultado encontrado.
                  </div>
                )}
                {!isLoading && hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button onClick={loadMore}>Carregar Mais</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  )
}
