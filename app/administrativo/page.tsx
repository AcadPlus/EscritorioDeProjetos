'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, HandshakeIcon, CalendarCheck } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Negócios</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aprovar, visualizar e gerenciar todos os negócios cadastrados na plataforma.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/administrativo/negocios')}>
              Acessar
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Iniciativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aprovar, visualizar e gerenciar todas as iniciativas cadastradas na plataforma.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/administrativo/iniciativas')}>
              Acessar
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Crie, edite e gerencie todos os eventos da plataforma.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/administrativo/eventos')}>
              Acessar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
