/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import SidebarWrapper from '@/lib/sidebar_wrapper'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Vitrine {
  _id: string
  title: string
  type: string
  description: string
  tags: string[]
  email: string
  responsibleUser: string
  status: 'pending' | 'approved' | 'rejected'
}

const AdminVitrines = () => {
  const [vitrines, setVitrines] = useState<Vitrine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userDisplayNames, setUserDisplayNames] = useState<
    Record<string, string>
  >({})
  const { toast } = useToast()

  useEffect(() => {
    fetchVitrines()
  }, [])

  const fetchVitrines = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get<{ startups: Vitrine[] }>(
        '/api/vitrines?status=pending',
      )
      console.log(response.data)
      const vitrinesData = response.data.startups || []
      setVitrines(vitrinesData)

      const userIds = Array.from(
        new Set(vitrinesData.map((vitrine) => vitrine.responsibleUser)),
      )
      await fetchUserDisplayNames(userIds)
    } catch (error) {
      console.error('Erro ao buscar vitrines:', error)
      setError('Não foi possível carregar as vitrines.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserDisplayNames = async (userIds: string[]) => {
    try {
      const promises = userIds.map((id) =>
        fetch(`/api/users/${id}`).then((res) => res.json()),
      )
      const users = await Promise.all(promises)

      const displayNamesMap = users.reduce(
        (acc, user) => {
          if (user?.displayName) {
            acc[user._id] = user.displayName
          }
          return acc
        },
        {} as Record<string, string>,
      )

      setUserDisplayNames((prevNames) => ({ ...prevNames, ...displayNamesMap }))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os nomes dos usuários.',
        variant: 'destructive',
      })
    }
  }

  const handleAction = async (
    id: string,
    action: 'approve' | 'reject',
    responsibleUser: string,
  ) => {
    try {
      await axios.put('/api/vitrines', { id, action, responsibleUser })
      toast({
        title: 'Sucesso',
        description: `Vitrine ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso.`,
        variant: 'default',
      })
      fetchVitrines() // Refresh the list after action
    } catch (error) {
      console.error('Erro ao processar ação:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível processar a ação.',
        variant: 'destructive',
      })
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    if (vitrines.length === 0) {
      return <p className="text-center py-4">Nenhuma vitrine pendente.</p>
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {[
              'Título',
              'Tipo',
              'Descrição',
              'Tags',
              'Email',
              'Responsável',
              'Ações',
            ].map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {vitrines.map(
            ({
              _id,
              title,
              type,
              description,
              tags,
              email,
              responsibleUser,
            }) => (
              <TableRow key={_id}>
                <TableCell>{title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{type}</Badge>
                </TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>
                  {userDisplayNames[responsibleUser] || 'Carregando...'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleAction(_id, 'approve', responsibleUser)
                      }
                      variant="default"
                    >
                      Aprovar
                    </Button>
                    <Button
                      onClick={() =>
                        handleAction(_id, 'reject', responsibleUser)
                      }
                      variant="destructive"
                    >
                      Rejeitar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <SidebarWrapper />
      <div className="container mx-auto p-4 ml-64">
        <h1 className="text-2xl font-bold mb-6">Administração de Vitrines</h1>
        {renderContent()}
      </div>
    </>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ))}
  </div>
)

export default AdminVitrines
