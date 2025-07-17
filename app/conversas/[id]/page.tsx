'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useMessagesApi } from '@/lib/api/messages'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  User, 
  MoreVertical,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { useAllUsers } from '@/hooks/allUsers'
import { useAuth } from '@/lib/context/AuthContext'

// -------------------- Estado de Loading --------------------
const ChatLoadingState = () => (
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
        <p className="text-gray-800 text-lg font-medium">Carregando conversa...</p>
        <p className="text-gray-500 text-sm mt-1">Preparando suas mensagens</p>
      </motion.div>
    </motion.div>
  </div>
)

// -------------------- Estado de Erro --------------------
const ChatErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <motion.div
      className="text-center max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar conversa</h3>
      <p className="text-gray-600 mb-6">Não foi possível carregar as mensagens. Verifique sua conexão e tente novamente.</p>
      <Button onClick={onRetry} className="bg-purple-600 hover:bg-purple-700 text-white">
        <RefreshCw className="w-4 h-4 mr-2" />
        Tentar novamente
      </Button>
    </motion.div>
  </div>
)

export default function ChatPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const threadId = params.id
  const searchParams = useSearchParams()
  const otherUid = searchParams?.get('uid') || ''
  const { userId } = useAuth()

  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const { data: allUsers } = useAllUsers()
  const otherUser = allUsers?.find((u: any) => u.uid === otherUid)

  const { useMessages, useSendMessage } = useMessagesApi()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    refetch,
  } = useMessages(threadId)
  const { mutateAsync: sendMessage, isPending: sending } = useSendMessage(threadId)

  const messagesRaw = data?.pages.flatMap((p) => p.messages) ?? []
  const messages = [...messagesRaw].sort((a: any, b: any) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [message])

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Auto-refresh messages every 10 seconds when tab is active
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const startPolling = () => {
      intervalId = setInterval(() => {
        if (!document.hidden && !isLoading && !isError) {
          refetch()
        }
      }, 10000) // 10 segundos
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId)
      } else {
        startPolling()
      }
    }

    // Iniciar polling apenas se a aba estiver ativa
    if (!document.hidden) {
      startPolling()
    }

    // Listener para mudanças de visibilidade da aba
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refetch, isLoading, isError])

  // Infinite scroll para carregar mensagens antigas
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && containerRef.current.scrollTop === 0 && hasNextPage) {
        fetchNextPage()
      }
    }
    const el = containerRef.current
    el?.addEventListener('scroll', handleScroll)
    return () => el?.removeEventListener('scroll', handleScroll)
  }, [hasNextPage, fetchNextPage])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const content = message.trim()
    if (!content || sending) return
    
    setMessage('')
    setIsTyping(false)
    
    try {
      await sendMessage({ conteudo: content })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setMessage(content) // Restaura a mensagem se houve erro
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  if (isLoading) return <ChatLoadingState />
  if (isError) return <ChatErrorState onRetry={refetch} />

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header aprimorado */}
      <motion.div 
        className="flex items-center gap-3 p-4 bg-white/95 backdrop-blur-sm shadow-lg border-b border-purple-100 sticky top-0 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Avatar className="h-10 w-10 ring-2 ring-purple-200">
          {(otherUser?.foto_url || otherUser?.profile_image_url) ? (
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <Image 
                src={otherUser.foto_url || otherUser.profile_image_url} 
                alt={`Foto de ${otherUser.nome}`} 
                fill
                sizes="40px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-violet-100 text-purple-700 font-semibold">
              {(otherUser?.nome || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">
            {otherUser?.nome || 'Usuário'}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {otherUser?.email || 'Usuário da plataforma'}
          </p>
        </div>

        {otherUid && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/perfil?id=${otherUid}&type=${otherUser?.tipo_usuario || ''}`)}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <User className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ver perfil</span>
          </Button>
        )}
      </motion.div>

      {/* Container de mensagens */}
      <div className="flex-1 flex flex-col min-h-0">
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Indicador de carregamento de mensagens antigas */}
          {hasNextPage && (
            <div className="text-center py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchNextPage()}
                className="text-purple-600 hover:text-purple-700"
              >
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando mensagens antigas...
              </Button>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, index) => {
              const isMe = msg.remetente_id === userId
              const showAvatar = !isMe && (index === 0 || messages[index - 1]?.remetente_id !== msg.remetente_id)
              
              return (
                <motion.div
                  key={msg.id}
                  className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Avatar do remetente */}
                  {showAvatar && !isMe && (
                    <Avatar className="h-8 w-8 mt-auto">
                      {(otherUser?.foto_url || otherUser?.profile_image_url) ? (
                        <div className="relative h-full w-full rounded-full overflow-hidden">
                          <Image 
                            src={otherUser.foto_url || otherUser.profile_image_url} 
                            alt={`Foto de ${otherUser.nome}`} 
                            fill
                            sizes="32px"
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-purple-100 to-violet-100 text-purple-700 text-xs">
                          {(otherUser?.nome || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  
                  {/* Espaçamento quando não há avatar */}
                  {!showAvatar && !isMe && <div className="w-8" />}

                  {/* Mensagem */}
                  <div
                    className={`
                      max-w-xs sm:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed relative
                      ${isMe 
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg' 
                        : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                      }
                      ${isMe ? 'rounded-br-md' : 'rounded-bl-md'}
                    `}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.conteudo}</p>
                    <div className={`
                      mt-2 text-[10px] flex items-center gap-1
                      ${isMe ? 'text-purple-100 justify-end' : 'text-gray-400 justify-start'}
                    `}>
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          <div ref={bottomRef} />
        </div>

        {/* Input aprimorado */}
        <motion.div 
          className="border-t border-purple-100 bg-white/95 backdrop-blur-sm p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem... (Enter para enviar)"
                className="
                  w-full resize-none border border-purple-200 rounded-2xl px-4 py-3 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  placeholder-gray-400 text-sm leading-relaxed min-h-[44px] max-h-[120px]
                  bg-white shadow-sm transition-all duration-200
                "
                rows={1}
                disabled={sending}
              />
              {isTyping && (
                <motion.div
                  className="absolute bottom-1 right-3 text-xs text-purple-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Digitando...
                </motion.div>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={!message.trim() || sending}
              className="
                bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 
                text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200 
                rounded-2xl px-4 py-3 h-11 min-w-[44px]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          
          <p className="text-xs text-gray-400 mt-2 text-center">
            Pressione Enter para enviar • Shift + Enter para nova linha
          </p>
        </motion.div>
      </div>
    </div>
  )
} 