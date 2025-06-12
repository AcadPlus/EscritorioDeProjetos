'use client'

import { useState } from 'react'
import { useInitiativesApi } from '@/lib/api/initiatives'
import { InitiativesSummary } from '../components/InitiativesSummary'
import { InitiativesStats } from '../components/InitiativesStats'
import { InitiativesChart } from '../components/InitiativesChart'
import { InitiativesTable } from '../components/InitiativesTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function IniciativasAdminPage() {
  const { useGetInitiativesByAdmin } = useInitiativesApi()
  const { data: initiativesData, isLoading } = useGetInitiativesByAdmin()
  const [activeTab, setActiveTab] = useState('overview')

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
        <h1 className="text-3xl font-bold">Administração de Iniciativas</h1>
        <p className="text-muted-foreground">
          Gerencie as iniciativas da plataforma
        </p>
      </div>

      <InitiativesSummary initiativesData={initiativesData} />

      <Tabs
        defaultValue="overview"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="ativas">Ativas</TabsTrigger>
          <TabsTrigger value="recusadas">Recusadas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InitiativesStats initiativesData={initiativesData} />
            <InitiativesChart initiativesData={initiativesData} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Iniciativas Recentes</CardTitle>
              <CardDescription>
                Últimas iniciativas cadastradas na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InitiativesTable
                initiativesData={initiativesData}
                filter="recent"
                limit={5}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle>Iniciativas Pendentes</CardTitle>
              <CardDescription>
                Iniciativas aguardando aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InitiativesTable
                initiativesData={initiativesData}
                filter="pendentes"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ativas">
          <Card>
            <CardHeader>
              <CardTitle>Iniciativas Ativas</CardTitle>
              <CardDescription>
                Iniciativas aprovadas e em andamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InitiativesTable
                initiativesData={initiativesData}
                filter="ativas"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recusadas">
          <Card>
            <CardHeader>
              <CardTitle>Iniciativas Recusadas</CardTitle>
              <CardDescription>
                Iniciativas que foram rejeitadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InitiativesTable
                initiativesData={initiativesData}
                filter="recusadas"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Iniciativas</CardTitle>
              <CardDescription>
                Lista completa de todas as iniciativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InitiativesTable
                initiativesData={initiativesData}
                filter="all"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
