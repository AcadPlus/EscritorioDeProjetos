/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Loader2, Filter, Mail, ExternalLink } from 'lucide-react'
import VitrineCard from '@/components/vitrine-card'
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
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { VitrineItem, VitrineType, SortType } from '@/types/vitrine-items'

import CreateVitrineModal from '@/components/criar-vitrine'

import { DecodedToken, UserDisplayName } from '@/hooks/useVitrineData'

export default function VitrinesComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [activeTab, setActiveTab] = useState<VitrineType>('startup')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortType>('recent')
  const { toast } = useToast()
  const [selectedItem, setSelectedItem] = useState<VitrineItem | null>(null)
  const [userDisplayNames, setUserDisplayNames] = useState<
    Record<string, string>
  >({})
  const [editingItem, setEditingItem] = useState<VitrineItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [allVitrines, setAllVitrines] = useState<VitrineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken
      setCurrentUser(decoded?.uid || '')
    }
  }, [])

  const handleEdit = (itemId: string) => {
    const itemToEdit = allVitrines.find((item) => item._id === itemId)
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
        const response = await axios.put<{ success: boolean }>(
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
          toast({
            title: 'Item Atualizado',
            description: 'O item foi atualizado com sucesso.',
            variant: 'success',
          })
          setEditingItem(null)
        } else {
          toast({
            title: 'Erro',
            description: 'Erro ao atualizar o item.',
            variant: 'destructive',
          })
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
    const fetchVitrines = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`/api/vitrines/${activeTab}`, {
          params: { status: 'approved' }, // Ensure only approved vitrines are fetched
        })
        setAllVitrines(response.data.items)
        setError(null)
      } catch (err) {
        setError('Failed to fetch vitrines')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVitrines()
  }, [activeTab])

  useEffect(() => {
    if (!allVitrines) return
    fetchUserDisplayNames(allVitrines.map((item) => item.responsibleUser))
  }, [allVitrines])

  const fetchUserDisplayNames = async (userIds: string[]) => {
    try {
      const uniqueIds = [...new Set(userIds)]
      const promises = uniqueIds.map((id) =>
        fetch(`/api/users/${id}`).then((res) => res.json()),
      )

      const users = await Promise.all(promises)
      const displayNamesMap: Record<string, string> = {}
      users.forEach((user: UserDisplayName) => {
        if (user && user.displayName) {
          displayNamesMap[user.uid] = user.displayName
        }
      })

      setUserDisplayNames((prevNames) => ({ ...prevNames, ...displayNamesMap }))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleSortChange = (value: SortType) => {
    setSortBy(value)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
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

  const renderDetails = (item: VitrineItem): JSX.Element => {
    return (
      <div>
        <p>
          <strong>Fundação:</strong> {item.foundationYear}
        </p>
        <p>
          <strong>Setor:</strong> {item.sector}
        </p>
        <p>
          <strong>Localização:</strong> {item.location}
        </p>
        <p>
          <strong>Problema:</strong> {item.problem}
        </p>
        <p>
          <strong>Solução:</strong> {item.solution}
        </p>
        <p>
          <strong>Área Estratégica:</strong> {item.strategicArea}
        </p>
        <p>
          <strong>Potencial de Impacto:</strong> {item.potentialImpact}
        </p>
        <div className="flex space-x-2 mt-2">
          {item.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={item.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Website
              </a>
            </Button>
          )}
          {item.email && (
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${item.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Contato
              </a>
            </Button>
          )}
        </div>
      </div>
    )
  }

  const filteredVitrines = useMemo(() => {
    let result = allVitrines

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        break
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // 'recent'
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }

    return result
  }, [allVitrines, searchQuery, sortBy])

  const paginatedVitrines = useMemo(() => {
    const startIndex = (page - 1) * 9
    return filteredVitrines.slice(startIndex, startIndex + 9)
  }, [filteredVitrines, page])

  const hasMore = paginatedVitrines.length === 9

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
                  <CreateVitrineModal onItemCreated={handleNewItem} />
                </div>
              </div>
              <p className="text-gray-600">
                Descubra oportunidades em Startups da UFC.
              </p>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as VitrineType)
                setPage(1)
              }}
            >
              <TabsList className="mb-4 gap-2">
                <TabsTrigger className="bg-white" value="startup">
                  Startups
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {error && (
                  <div className="text-center text-red-500 mb-4">{error}</div>
                )}
                <AnimatePresence>
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedVitrines.map((item) => (
                      <VitrineCard
                        key={item._id}
                        item={item as VitrineItem}
                        currentUser={currentUser}
                        userDisplayNames={userDisplayNames}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        renderDetails={renderDetails}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
                {isLoading && (
                  <div className="flex justify-center items-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                {!isLoading && paginatedVitrines.length === 0 && (
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
