'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import type { EventStatus } from '@/lib/types/event'
import EventList from './components/event-list'
import EventSearch from './components/event-search'
import EventSort from './components/event-sort'
import EventRefresh from './components/event-refresh'
import EventStatusFilter from './components/event-status-filter'
import { useEventsApi } from '@/lib/api/events'

export default function EventosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<EventStatus>('ATIVO')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const { useListEvents } = useEventsApi()
  const { data: events, isLoading } = useListEvents(selectedStatus)

  const handleCreateEvent = () => {
    router.push('/eventos/novo')
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleStatusChange = (status: EventStatus) => {
    setSelectedStatus(status)
  }

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order)
  }

  const handleRefresh = () => {
    toast({
      title: 'Atualizando...',
      description: 'Lista de eventos atualizada com sucesso!',
    })
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho e Controles */}
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            {/* Título e Botão */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Eventos</h1>
              <Button onClick={() => router.push('/eventos/novo')}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Evento
              </Button>
            </div>

            {/* Barra de Pesquisa e Controles */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex-1 w-full lg:max-w-2xl">
                <EventSearch onSearch={handleSearch} />
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <EventSort onSortChange={handleSortChange} />
                <EventRefresh onRefresh={handleRefresh} />
              </div>
            </div>

            {/* Status e Filtros */}
            <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Status dos Eventos
              </h3>
              <EventStatusFilter onStatusChange={handleStatusChange} />
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        <Card>
          <CardContent className="p-6">
            <EventList
              searchTerm={searchTerm}
              status={selectedStatus}
              sortOrder={sortOrder}
              events={events || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
