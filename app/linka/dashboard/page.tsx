'use client'

import { useState, useEffect } from 'react'
import { Search, Link as LinkIcon, Loader2, Filter } from 'lucide-react'
import ItemCard from '@/components/base-item-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

import { useVitrineData } from '@/hooks/useVitrineData'

export default function VitrinesComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [activeTab, setActiveTab] = useState('startup')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('recent')
  const { toast } = useToast()
  const [selectedItem, setSelectedItem] = useState(null)

  const [userDisplayNames, setUserDisplayNames] = useState({})

  const [editingItem, setEditingItem] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editTags, setEditTags] = useState([])

  const {
    data: vitrines,
    isLoading,
    error,
    hasMore,
  } = useVitrineData(activeTab, page, searchQuery, sortBy)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt.decode(token)
      setCurrentUser(decoded?.uid)
    }
  }, [])

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

  useEffect(() => {
    if (!vitrines) return
    fetchUserDisplayNames(vitrines.map((item) => item.responsibleUser))
  }, [vitrines])

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
    setPage(1)
  }

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handleNewItem = () => {
    toast({
      title: 'Item Criado',
      description: 'O novo item foi adicionado com sucesso à vitrine.',
      variant: 'success',
    })
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setPage(1)
  }

  // useEffect(() => {
  //   if (!vitrines) return
  //   const filteredItemsTemp = vitrines.filter(
  //     (vitrine) =>
  //       vitrine.type === activeTab &&
  //       (vitrine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         vitrine.description
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase())),
  //   )
  //   setFilteredItems(filteredItemsTemp)
  // }, [vitrines])

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
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vitrines.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        currentUser={currentUser}
                        userDisplayNames={userDisplayNames}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
                {isLoading && (
                  <div className="flex justify-center items-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                {!isLoading && vitrines.length === 0 && (
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
