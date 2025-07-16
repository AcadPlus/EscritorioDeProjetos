'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  Plus,
  Search,
  Users,
  Clock,
  Send,
  UserPlus,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useMessagesApi } from '@/lib/api/messages'
import { useConnectionRequests } from '@/lib/api/connections'
import { useAllUsers } from '@/hooks/allUsers'
import { useAuth } from '@/lib/context/AuthContext'
import PrivateRoute from '@/components/private_route'

// -------------------- Estado de Loading --------------------
const LoadingState = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        >
          <MessageCircle className="h-12 w-12 text-purple-600" />
        </motion.div>
        <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse" />
      </div>
      <motion.div
        className="text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <p className="text-gray-800 text-lg font-medium">Carregando mensagens...</p>
        <p className="text-gray-500 text-sm mt-1">Preparando sua central de comunicação</p>
      </motion.div>
    </motion.div>
  </div>
)

// -------------------- Estado de Erro --------------------
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <Card className="p-8 max-w-md w-full">
      <div className="text-center space-y-4">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">Não foi possível carregar as mensagens</p>
          <p className="text-sm text-gray-500">Ocorreu um erro ao tentar carregar suas conversas. Por favor, tente novamente.</p>
        </div>
        <Button onClick={onRetry} variant="default" className="w-full sm:w-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    </Card>
  </div>
)

// -------------------- Estado Vazio --------------------
const EmptyMessagesState = ({ onStartConversation }: { onStartConversation: () => void }) => (
  <motion.div
    className="text-center mt-12 p-8 bg-purple-50 rounded-2xl border border-purple-100"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <MessageCircle className="h-8 w-8 text-purple-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conversa ainda</h3>
    <p className="text-gray-600 mb-4">Comece uma conversa com suas conexões para colaborar em projetos e trocar ideias.</p>
    <p className="text-sm text-gray-500 mb-6">Você pode iniciar conversas com pessoas da sua rede de conexões.</p>
    <Button
      className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      onClick={onStartConversation}
    >
      <Plus className="w-4 h-4 mr-2" />
      Iniciar Nova Conversa
    </Button>
  </motion.div>
)

// -------------------- Card de Conexão --------------------
const ConnectionCard = ({ user, onStartConversation }: { user: any; onStartConversation: (u: any) => void }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profile_image} />
          <AvatarFallback className="bg-purple-100 text-purple-600">
            {user.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{user.nome}</p>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        <Button size="sm" onClick={() => onStartConversation(user)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
)

// -------------------- Página de Mensagens --------------------
export default function MensagensPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectUid = searchParams?.get('uid') || null
  const { userId } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'conversations' | 'connections'>('conversations')
  const [composeOpen, setComposeOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [initialMessage, setInitialMessage] = useState('')

  // APIs
  const { useThreads, useCreateThread } = useMessagesApi()
  const { useGetUserConnections } = useConnectionRequests()
  const { data: allUsers, isLoading: isLoadingUsers } = useAllUsers()

  // Queries
  const {
    data: threadsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingThreads,
    isError: isErrorThreads,
    refetch: refetchThreads,
  } = useThreads()

  const { data: connectionIds = [], isLoading: isLoadingConnections } = useGetUserConnections()
  const { mutateAsync: createThread, isPending: isCreatingThread } = useCreateThread()

  const threads = threadsData?.pages.flatMap((page: any) => page.threads) ?? []

  // Conexões filtradas
  const connectedUsers = useMemo(() => {
    if (!allUsers || !connectionIds.length) return []
    // Mapear cada id de conexão ao objeto de usuário correspondente, se disponível
    const list = connectionIds
      .filter((id) => id !== userId) // evitar incluir o próprio usuário
      .map((id) => allUsers?.find((u: any) => u.uid === id))
      .filter(Boolean) as any[]
    return list
  }, [allUsers, connectionIds, userId])

  const filteredConnections = useMemo(() => {
    if (!searchQuery.trim()) return connectedUsers
    const q = searchQuery.toLowerCase()
    return connectedUsers.filter((u: any) => u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [connectedUsers, searchQuery])

  useEffect(() => {
    console.log('--- DEBUG MENSAGENS ---');
    console.log('isLoadingConnections:', isLoadingConnections);
    console.log('connectionIds:', connectionIds);
    console.log('isLoadingUsers:', isLoadingUsers);
    console.log('allUsers:', allUsers);
    console.log('connectedUsers:', connectedUsers);
    console.log('-----------------------');
  }, [connectionIds, allUsers, connectedUsers, isLoadingConnections, isLoadingUsers]);

  // Auto abrir modal se uid na query
  useEffect(() => {
    if (preselectUid && allUsers && connectedUsers.length) {
      const userObj = allUsers.find((u: any) => u.uid === preselectUid)
      if (userObj) {
        // Já existe thread?
        const existing = threads.find((t: any) =>
          t.participantes?.includes(preselectUid) && t.participantes?.includes(userId)
        )
        if (existing) {
          router.push(`/mensagens/${existing.id}?uid=${preselectUid}`)
        } else {
          openComposeModalIfNeeded(userObj)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectUid, allUsers, connectedUsers])

  // Infinite scroll para threads
  useEffect(() => {
    const handler = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasNextPage && !isLoadingThreads) {
        fetchNextPage()
      }
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [hasNextPage, fetchNextPage, isLoadingThreads])

  const openComposeModalIfNeeded = (targetUser: any) => {
    if (!userId) return
    // Verificar se já existe thread com esse usuário
    const existing = threads.find((t: any) =>
      t.participantes?.includes(targetUser.uid) && t.participantes?.includes(userId)
    )
    if (existing) {
      router.push(`/mensagens/${existing.id}?uid=${targetUser.uid}`)
      return
    }
    // Caso contrário, abrir modal para primeira mensagem
    setSelectedUser(targetUser)
    setInitialMessage('')
    setComposeOpen(true)
  }

  const handleCreateThread = async () => {
    if (!userId || !selectedUser || !initialMessage.trim()) return
    try {
      const thread = await createThread({
        participantes: [selectedUser.uid, userId],
        mensagem_inicial: initialMessage.trim(),
      })
      setComposeOpen(false)
      setActiveTab('conversations')
      router.push(`/mensagens/${thread.id}`)
    } catch (err) {
      console.error('Erro ao criar conversa:', err)
    }
  }

  const handleNewConversationClick = () => setActiveTab('connections')

  const isLoading = isLoadingThreads || isLoadingConnections || isLoadingUsers

  if (isLoading) return <LoadingState />
  if (isErrorThreads) return <ErrorState onRetry={refetchThreads} />

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Central de Mensagens</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">Suas Conversas</h1>
              <div className="flex flex-wrap justify-center gap-6 text-center">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-200" />
                  <span className="text-xl font-bold">{threads.length}</span>
                  <span className="text-purple-200">Conversas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-200" />
                  <span className="text-xl font-bold">{connectionIds.length}</span>
                  <span className="text-purple-200">Conexões</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Controles */}
            <div className="mb-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Mensagens</h2>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {threads.length} conversas
                  </Badge>
                </div>
                <Button
                  onClick={handleNewConversationClick}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                  disabled={isCreatingThread}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Conversa
                </Button>
              </div>
              {/* Busca */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar conversas ou conexões..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="conversations" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Conversas
                </TabsTrigger>
                <TabsTrigger value="connections" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Iniciar Conversa
                </TabsTrigger>
              </TabsList>

              {/* Conversas */}
              <TabsContent value="conversations" className="mt-6">
                {threads.length === 0 ? (
                  <EmptyMessagesState onStartConversation={handleNewConversationClick} />
                ) : (
                  <div className="space-y-2">
                    {threads.map((thread: any) => (
                      <motion.div
                        key={thread.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        {(() => {
                          const otherId = (thread.participantes || []).find((pid: string) => pid !== userId)
                          const otherUser = allUsers?.find((u: any) => u.uid === otherId)
                          return (
                            <Card
                              className="hover:shadow-md transition-all cursor-pointer border-l-4 border-purple-500"
                              onClick={() => router.push(`/mensagens/${thread.id}?uid=${otherId}`)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    {otherUser?.profile_image && (
                                      <AvatarImage src={otherUser.profile_image} />
                                    )}
                                    <AvatarFallback className="bg-purple-100 text-purple-600">
                                      {(otherUser?.nome || 'U').charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-gray-900 truncate">
                                        {otherUser?.nome || 'Usuário'}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {new Date(thread.last_message_at || thread.created_at).toLocaleString('pt-BR', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate mt-1">
                                      {thread.last_message || 'Conversa iniciada'}
                                    </p>
                                  </div>
                                  {thread.unread_count > 0 && (
                                    <Badge className="bg-purple-600 text-white">
                                      {thread.unread_count}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })()}
                      </motion.div>
                    ))}
                    {hasNextPage && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => fetchNextPage()} disabled={isLoadingThreads}>
                          {isLoadingThreads ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Carregando...
                            </>
                          ) : (
                            'Carregar mais conversas'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Conexões */}
              <TabsContent value="connections" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Suas Conexões ({connectedUsers.length})</h3>
                    <Button variant="outline" size="sm" onClick={() => router.push('/rede')}>
                      <Users className="w-4 h-4 mr-2" /> Ver Rede
                    </Button>
                  </div>
                  {connectionIds.length === 0 ? (
                    <motion.div
                      className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conexão encontrada</h3>
                      <p className="text-gray-600 mb-4">Você precisa ter conexões aceitas para iniciar conversas.</p>
                      <Button
                        onClick={() => router.push('/rede')}
                        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-2" /> Explorar Rede
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {filteredConnections.map((u: any) => (
                        <motion.div key={u.uid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                          <ConnectionCard user={u} onStartConversation={openComposeModalIfNeeded} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {searchQuery && filteredConnections.length === 0 && connectionIds.length > 0 && (
                    <div className="text-center p-8">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conexão encontrada</h3>
                      <p className="text-gray-600">Não encontramos conexões para "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      {/* Modal de mensagem inicial */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar conversa</DialogTitle>
            <DialogDescription>
              Envie a primeira mensagem para <strong>{selectedUser?.nome}</strong>
            </DialogDescription>
          </DialogHeader>
          <textarea
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            placeholder="Digite sua mensagem..."
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateThread}
              disabled={isCreatingThread || !initialMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PrivateRoute>
  )
}