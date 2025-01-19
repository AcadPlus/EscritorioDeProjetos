/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Building2, Mail, MapPin, User2, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserType } from '@/lib/types/userTypes'
import { useState, useEffect } from 'react'
import { useUserApi } from '@/lib/api/users'
import { useRouter } from 'next/navigation'
import { ProfileSkeleton } from '@/components/profile-skeleton'
import PrivateRoute from '@/components/private_route'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const { getCurrentUser, deleteUser } = useUserApi()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        console.log(userData)
        setUser(userData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleDeleteAccount = () => {
    localStorage.clear()
    router.push('/linka/login')
  }

  const getUserTitle = (type: UserType) => {
    switch (type) {
      case UserType.PESQUISADOR:
        return 'professor'
      case UserType.ESTUDANTE:
        return 'estudante'
      case UserType.EXTERNO:
        return 'profissional externo'
      default:
        return 'usuário'
    }
  }

  const handleEditProfile = () => {
    // Implement edit profile functionality
    console.log('Edit profile')
  }

  const handleDeleteProfile = async () => {
    if (window.confirm('Tem certeza que deseja deletar seu perfil?')) {
      try {
        await deleteUser(user.tipo_usuario, user.uid)
        handleDeleteAccount()
      } catch (error) {
        console.error('Error deleting profile:', error)
      }
    }
  }

  const handleChangePassword = () => {
    // Implement change password functionality
    console.log('Change password')
  }

  if (loading) {
    console.log(loading)
    return <ProfileSkeleton />
  }

  return (
    <PrivateRoute>
      <div className="p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Informações Principais */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-600">
                  {user.nome.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.nome}
                </h1>
                <p className="text-gray-500">
                  {getUserTitle(user.tipo_usuario)}
                </p>
                {(user.tipo_usuario === UserType.PESQUISADOR ||
                  user.tipo_usuario === UserType.ESTUDANTE) && (
                  <p className="text-gray-500">{user.campus}</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>

              {user.tipo_usuario === UserType.PESQUISADOR && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User2 className="h-4 w-4" />
                  <span>SIAPE: {user.uid}</span>
                </div>
              )}

              {(user.tipo_usuario === UserType.PESQUISADOR ||
                user.tipo_usuario === UserType.ESTUDANTE) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{user.campus}</span>
                </div>
              )}

              {user.tipo_usuario === UserType.EXTERNO && user.empresa && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{user.empresa}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Informações Adicionais */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Informações Adicionais
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Criado em:{' '}
                {new Date(user.data_cadastro).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </Card>

          {/* Conexões e Favoritos */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Conexões e Favoritos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Conexões</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-gray-600">Favoritos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          {/* Ações */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ações</h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={handleEditProfile}
              >
                Editar Perfil
              </Button>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={handleDeleteProfile}
              >
                Deletar Perfil
              </Button>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={handleChangePassword}
              >
                Alterar Senha
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PrivateRoute>
  )
}
