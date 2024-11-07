'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import SidebarWrapper from '@/lib/sidebar_wrapper'

const AdminVitrines = () => {
  const [vitrines, setVitrines] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userDisplayNames, setUserDisplayNames] = useState({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchVitrines = async () => {
      setIsLoading(true)
      try {
        const {
          data: { vitrines: vitrinesData },
        } = await axios.get('/api/vitrines')
        setVitrines(vitrinesData)

        const userIds = [
          ...new Set(vitrinesData.map((vitrine) => vitrine.responsibleUser)),
        ]
        fetchUserDisplayNames(userIds)
      } catch (error) {
        console.error('Erro ao buscar vitrines:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as vitrines.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVitrines()
  }, [toast])

  const fetchUserDisplayNames = async (userIds) => {
    try {
      const promises = userIds.map((id) =>
        fetch(`/api/users/${id}`).then((res) => res.json()),
      )
      const users = await Promise.all(promises)

      const displayNamesMap = users.reduce((acc, user) => {
        if (user?.displayName) {
          acc[user._id] = user.displayName
        }
        return acc
      }, {})

      setUserDisplayNames((prevNames) => ({ ...prevNames, ...displayNamesMap }))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  const handleAction = async (id, action, responsibleUser) => {
    try {
      await axios.put('/api/vitrines', { id, action, responsibleUser })
      toast({
        title: 'Sucesso',
        description: `Vitrine ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso.`,
        variant: 'default',
      })
      fetchVitrines()
    } catch (error) {
      console.error('Erro ao processar ação:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível processar a ação.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <SidebarWrapper />
      <div className="container mx-auto p-4 ml-64">
        <h1 className="text-2xl font-bold mb-6">Administração de Vitrines</h1>
        {isLoading ? (
          <p>Carregando...</p>
        ) : vitrines.length === 0 ? (
          <p>Nenhuma vitrine pendente.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                {[
                  'Título',
                  'Tipo',
                  'Descrição',
                  'Tags',
                  'Email',
                  'Responsável',
                  'Ações',
                ].map((header) => (
                  <th key={header} className="border border-gray-300 p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                  <tr key={_id}>
                    <td className="border border-gray-300 p-2">{title}</td>
                    <td className="border border-gray-300 p-2">
                      <Badge variant="outline">{type}</Badge>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {description}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">{email}</td>
                    <td className="border border-gray-300 p-2">
                      {userDisplayNames[responsibleUser] || 'Carregando...'}
                    </td>
                    <td className="border border-gray-300 p-2">
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
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default AdminVitrines
