'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useMessagesApi } from '@/lib/api/messages'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import { useAllUsers } from '@/hooks/allUsers'

export default function ChatPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const threadId = params.id
  const searchParams = useSearchParams()
  const otherUid = searchParams?.get('uid') || ''

  const { data: allUsers } = useAllUsers()
  const otherUser = allUsers?.find((u: any) => u.uid === otherUid)

  const { useMessages, useSendMessage } = useMessagesApi()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useMessages(threadId)
  const { mutateAsync: sendMessage, isLoading: sending } = useSendMessage(threadId)

  const messagesRaw = data?.pages.flatMap((p) => p.messages) ?? []
  const messages = [...messagesRaw].sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // mais antigas em cima, novas embaixo

  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Infinite scroll (top) to load older
  const containerRef = useRef<HTMLDivElement | null>(null)
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = inputRef.current?.value.trim()
    if (!content) return
    await sendMessage({ conteudo: content })
    if (inputRef.current) inputRef.current.value = ''
  }

  if (isLoading) return <div className="p-4">Carregando chat...</div>
  if (isError) return <div className="p-4 text-destructive">Erro ao carregar chat.</div>

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-50 via-white to-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-purple-600 hover:text-purple-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar className="h-10 w-10">
          {otherUser?.profile_image && <AvatarImage src={otherUser.profile_image} />}
          <AvatarFallback className="bg-purple-100 text-purple-600">
            {(otherUser?.nome || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-gray-800 flex-1 truncate">{otherUser?.nome || 'Usuário'}</span>
        {otherUid && (
          <button
            onClick={() => router.push(`/perfil?id=${otherUid}&type=${otherUser?.tipo_usuario || ''}`)}
            className="text-purple-600 hover:text-purple-800 text-sm underline"
          >
            Ver perfil
          </button>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex flex-col h-[calc(100vh-10rem)] max-w-2xl w-full mx-auto border-x">
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
        >
          {messages.map((msg) => {
            const isMe =
              typeof window !== 'undefined' &&
              msg.remetente_id === localStorage.getItem('userId')
            return (
              <div
                key={msg.id}
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${isMe ? 'ml-auto bg-purple-600 text-white' : 'bg-white border'}`}
              >
                {msg.conteudo}
                <div className="mt-1 text-[10px] opacity-70 text-right">
                  {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Formulário */}
        <form onSubmit={onSubmit} className="p-3 border-t bg-white flex gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Digite sua mensagem..."
            className="flex-1 resize-none border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
} 