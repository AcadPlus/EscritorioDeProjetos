'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Mail, Link as LinkIcon, MapPin, GraduationCap, Loader2 } from 'lucide-react'
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
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from "@/components/ui/use-toast"
import SidebarWrapper from '@/lib/sidebar_wrapper'
import { motion, AnimatePresence } from 'framer-motion'

const ITEMS_PER_PAGE = 9

export function Page() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('startup')
  const [vitrines, setVitrines] = useState([])
  const [userDisplayNames, setUserDisplayNames] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  const fetchVitrines = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/vitrines?page=${page}&limit=${ITEMS_PER_PAGE}&type=${activeTab}&search=${searchQuery}`)
      if (!response.ok) throw new Error('Failed to fetch vitrines')
      const data = await response.json()

      if (Array.isArray(data.vitrines)) {
        setVitrines(prevVitrines => [...prevVitrines, ...data.vitrines])
        fetchUserDisplayNames(data.vitrines.map(item => item.responsibleUser))
      } else {
        throw new Error('Expected an array for vitrines')
      }
    } catch (error) {
      setError(error.message)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vitrines. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, activeTab, searchQuery, toast])

  useEffect(() => {
    fetchVitrines()
  }, [fetchVitrines])

  const fetchUserDisplayNames = async (userIds) => {
    try {
      const uniqueIds = [...new Set(userIds)]
      const promises = uniqueIds.map(id =>
        fetch(`/api/users/${id}`).then(res => res.json())
      )

      const users = await Promise.all(promises)
      const displayNamesMap = {}
      users.forEach(user => {
        if (user && user.displayName) {
          displayNamesMap[user.uid] = user.displayName
        }
      })

      setUserDisplayNames(prevNames => ({ ...prevNames, ...displayNamesMap }))
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
    setPage(prevPage => prevPage + 1)
  }

  const filteredItems = vitrines.filter(vitrine => 
    vitrine.type === activeTab &&
    (vitrine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     vitrine.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <>
      <SidebarWrapper />
      <div className="min-h-screen bg-gray-100 flex">
        <div className="flex-1">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 md:mb-0">Explore as Vitrines</h2>
                <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
                  <Input
                    className="w-full bg-white md:w-64"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" variant="outline" className="bg-white" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              <p className="text-gray-600">
                Descubra oportunidades em Startups, Competências e Laboratórios da UFC.
              </p>
            </div>
            <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setVitrines([]); setPage(1); }}>
              <TabsList className="mb-4">
                <TabsTrigger value="startup">Startups</TabsTrigger>
                <TabsTrigger value="competencia">Competências</TabsTrigger>
                <TabsTrigger value="laboratorio">Laboratórios</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {error && (
                  <div className="text-center text-red-500 mb-4">
                    {error}
                  </div>
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
                            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />
                            <CardDescription>{item.description}</CardDescription>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.image} alt={item.responsibleUser} />
                                <AvatarFallback>
                                  {userDisplayNames[item.responsibleUser]
                                    ? userDisplayNames[item.responsibleUser].split(' ').map(n => n[0]).join('').slice(0, 2)
                                    : item.responsibleUser.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{userDisplayNames[item.responsibleUser] || item.responsibleUser}</span>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">Detalhes</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                  <DialogTitle>{item.title}</DialogTitle>
                                  <DialogDescription>{item.category}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg" />
                                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    <p>{item.detailedDescription}</p>
                                  </ScrollArea>
                                  <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                                    ))}
                                  </div>
                                  <Separator />
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Informações de Contato</h4>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4" />
                                      <a href={`mailto:${item.email}`} className="text-sm text-blue-600 hover:underline">{item.email}</a>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <LinkIcon className="h-4 w-4" />
                                      <a href={item.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Portfolio</a>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-4 w-4" />
                                      <span className="text-sm">{item.campus}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <GraduationCap className="h-4 w-4" />
                                      <span className="text-sm">{item.involvedCourses.join(', ')}</span>
                                    </div>
                                  </div>
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
                {!isLoading && filteredItems.length > 0 && filteredItems.length % ITEMS_PER_PAGE === 0 && (
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