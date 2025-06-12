'use client'

import { useEventsApi } from '@/lib/api/events'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EventsSummary } from '../components/EventsSummary'
import { EventsStats } from '../components/EventsStats'
import { EventsChart } from '../components/EventsChart'
import { EventsTable } from '../components/EventsTable'
import { Event } from '@/lib/types/event'

type EventsData = {
  ativos: Event[]
  concluidos: Event[]
  cancelados: Event[]
  all: Event[]
}

export default function EventosAdminPage() {
  const { useGetEventsByAdmin } = useEventsApi()
  const { data: events, isLoading } = useGetEventsByAdmin()

  // Transformar os dados no formato esperado
  const eventsData: EventsData = {
    ativos: Array.isArray(events) ? events.filter((event) => event.status === 'ATIVO') : [],
    concluidos: Array.isArray(events) ? events.filter((event) => event.status === 'CONCLUIDO') : [],
    cancelados: Array.isArray(events) ? events.filter((event) => event.status === 'CANCELADO') : [],
    all: Array.isArray(events) ? events : [],
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-24 w-full bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Administração de Eventos</h1>
        <p className="text-muted-foreground">
          Gerencie os eventos da plataforma
        </p>
      </div>

      <EventsSummary eventsData={eventsData} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventsStats eventsData={eventsData} />
            <EventsChart eventsData={eventsData} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
              <CardDescription>
                Últimos eventos cadastrados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsTable eventsData={eventsData} filter="recent" limit={5} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ativos">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Ativos</CardTitle>
              <CardDescription>
                Eventos em andamento na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsTable eventsData={eventsData} filter="ativos" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concluidos">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Concluídos</CardTitle>
              <CardDescription>
                Eventos que já foram finalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsTable eventsData={eventsData} filter="concluidos" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Eventos</CardTitle>
              <CardDescription>
                Lista completa de todos os eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsTable eventsData={eventsData} filter="all" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
