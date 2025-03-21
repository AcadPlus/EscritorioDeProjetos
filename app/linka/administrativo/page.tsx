'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, HandshakeIcon, CalendarCheck } from 'lucide-react'

export default function AdministrativoPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie negócios, iniciativas e eventos da plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Administração de Negócios</CardTitle>
            <Building2 className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <CardDescription className="min-h-[100px]">
              Gerencie todos os negócios da plataforma. Aprove ou rejeite solicitações, 
              visualize métricas e monitore o desempenho dos negócios ativos.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => router.push('/linka/administrativo/negocios')}
            >
              Gerenciar Negócios
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Administração de Iniciativas</CardTitle>
            <HandshakeIcon className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <CardDescription className="min-h-[100px]">
              Gerencie todas as iniciativas. Aprove ou rejeite solicitações pendentes,
              analise métricas de engajamento e acompanhe o progresso das iniciativas ativas.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => router.push('/linka/administrativo/iniciativas')}
            >
              Gerenciar Iniciativas
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Administração de Eventos</CardTitle>
            <CalendarCheck className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <CardDescription className="min-h-[100px]">
              Monitore e gerencie todos os eventos da plataforma. Valide informações,
              analise a participação e acompanhe eventos passados e futuros.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => router.push('/linka/administrativo/eventos')}
            >
              Gerenciar Eventos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
