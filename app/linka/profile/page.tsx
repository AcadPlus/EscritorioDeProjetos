/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Mail,
  Calendar,
  School,
  GraduationCap,
  Building2,
  BadgeIcon as IdCard,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import jwt, { JwtPayload } from 'jsonwebtoken'

import getProfileUserData from '@/hooks/profileUserData'
import useDeleteUser from '@/hooks/useDeleteUser'
import SidebarWrapper from '@/lib/sidebar_wrapper'
import useUpdateUser from '@/hooks/useUpdateUser'
import { useToast } from '@/hooks/use-toast'
import { IUser } from '@/types/user'
import useCampusOptions from '@/hooks/useCampusOptions'

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<IUser>>({})
  const { toast } = useToast()
  const campusOptions = useCampusOptions()
  const {
    deleteUser,
    loading: deletingLoading,
    error: deleteError,
  } = useDeleteUser()

  const { updateUser } = useUpdateUser()

  const isUfcBrEmail = user?.email.endsWith('@ufc.br')

  const handleDeleteProfile = async () => {
    if (user && confirm('Tem certeza que deseja deletar seu perfil?')) {
      const success = await deleteUser(user.uid)

      if (success) {
        router.push('/')
        localStorage.removeItem('token')
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        setError(null)
        return
      }

      const decoded = jwt.decode(token) as JwtPayload & { uid: string }
      if (!decoded || !decoded.uid) {
        setError('Token inválido')
        setLoading(false)
        return
      }

      try {
        const userData = await getProfileUserData(decoded.uid)
        if (userData) {
          setUser(userData)
        } else {
          setError('Usuário não encontrado')
        }
      } catch (err) {
        setError('Erro ao buscar dados do usuário')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEditProfile = () => {
    setIsEditing(true)
    setEditedUser({ ...user })
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const updatedUser = await updateUser(user.uid, editedUser)
      if (updatedUser) {
        setUser(updatedUser)
        setIsEditing(false)
        toast({
          title: 'Dados de Usuário Atualizados!',
          description: 'Seus dados foram alterados com sucesso.',
          variant: 'success',
        })
      }
    } catch (err) {
      setError('Erro ao atualizar o perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-gray-500">
          Você não está cadastrado. Por favor,{' '}
          <Link href="login" className="text-blue-600 underline">
            faça login
          </Link>{' '}
          ou{' '}
          <Link href="signup" className="text-blue-600 underline">
            cadastre sua conta
          </Link>
          .
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="md:w-64 bg-white shadow-md">
        <SidebarWrapper />
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={
                      user.profilePicture?.data
                        ? `data:${user.profilePicture.contentType};base64,${Buffer.from(user.profilePicture.data).toString('base64')}`
                        : undefined
                    }
                  />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.displayName}</h1>
                  <p className="text-gray-500">{user.role}</p>
                  <p className="text-gray-500">{user.campus}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                {isUfcBrEmail ? (
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 mr-2 text-gray-500" />
                    <span>SIAPE: {user.siape}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <IdCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Matrícula: {user.matricula}</span>
                    </div>
                    {user.course && (
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{user.course}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{user.campus}</span>
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">
                  Informações Adicionais
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span>
                      Criado em: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span>
                        Último login:{' '}
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conexões e Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">Conexões</h3>
                    <p className="text-2xl font-bold">
                      {Object.keys(user.connections || {}).length}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Favoritos</h3>
                    <p className="text-2xl font-bold">
                      {Object.keys(user.favorites || {}).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={handleEditProfile}>
                        Editar Perfil
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="displayName">Nome</Label>
                          <Input
                            id="displayName"
                            name="displayName"
                            value={editedUser.displayName || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="campus">Campus</Label>
                          <Select
                            value={editedUser.campus}
                            onValueChange={(value) =>
                              setEditedUser({ ...editedUser, campus: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o campus" />
                            </SelectTrigger>
                            <SelectContent>
                              {campusOptions.map((campus) => (
                                <SelectItem key={campus} value={campus}>
                                  {campus}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {!isUfcBrEmail && (
                          <div>
                            <Label htmlFor="course">Curso</Label>
                            <Input
                              id="course"
                              name="course"
                              value={editedUser.course || ''}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                        <Button onClick={handleSaveProfile}>
                          Salvar Alterações
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDeleteProfile}
                    disabled={deletingLoading}
                  >
                    {deletingLoading ? 'Deletando...' : 'Deletar Perfil'}
                  </Button>
                  {deleteError && <p className="text-red-500">{deleteError}</p>}
                  <Button variant="outline" className="w-full">
                    Alterar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
