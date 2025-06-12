/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Building2,
  Mail,
  MapPin,
  User2,
  Calendar,
  Camera,
  Trash2,
  Loader2,
  PencilIcon,
  KeyIcon,
  UserX,
  UserPlus,
  UserMinus,
  UserCheck,
} from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UserType } from '@/lib/types/userTypes'
import { useRouter } from 'next/navigation'
import { ProfileSkeleton } from './profile-skeleton'
import { useUserApi } from '@/lib/api/users'
import { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ImageCropModal } from '@/components/ImageCropModal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConnectionRequests } from '@/lib/api/connections'
import { ConnectionStatus } from '@/lib/types/connectionTypes'
import { motion } from 'framer-motion'

interface ProfilePageProps {
  userId?: string | null
  userType?: string | null
}

export default function ProfilePage({ userId, userType }: ProfilePageProps) {
  const router = useRouter()
  const {
    useGetCurrentUser,
    useDeleteUser,
    useUploadProfileImage,
    useDeleteProfileImage,
    useUpdateUser,
    useChangePassword,
    useGetUserById,
  } = useUserApi()

  const {
    useCreateRequest,
    useUpdateRequest,
    useCancelRequest,
    useRemoveConnection,
    useGetConnectionStatus,
  } = useConnectionRequests()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteImageDialogOpen, setIsDeleteImageDialogOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [editProfileData, setEditProfileData] = useState({
    nome: '',
    email: '',
    empresa: '',
    campus: '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const isViewingOwnProfile = !userId
  const viewingUserType = (userType as UserType) || UserType.ESTUDANTE

  // Fetch current user data
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useGetCurrentUser()
  // Fetch other user data if viewing someone else's profile
  const { data: otherUser, isLoading: isOtherUserLoading } = useGetUserById(
    viewingUserType,
    userId || '',
    { enabled: !!userId && !!userType },
  )

  // Get connection status if viewing someone else's profile
  const { data: connectionStatus, isLoading: isConnectionStatusLoading } =
    useGetConnectionStatus(userId || '', { enabled: !!userId && !!currentUser })

  // Connection mutations
  const sendConnectionMutation = useCreateRequest()
  const acceptConnectionMutation = useUpdateRequest()
  const rejectConnectionMutation = useUpdateRequest()
  const cancelConnectionMutation = useCancelRequest()
  const removeConnectionMutation = useRemoveConnection()

  // User data mutations
  const deleteUserMutation = useDeleteUser()
  const uploadProfileImageMutation = useUploadProfileImage()
  const deleteProfileImageMutation = useDeleteProfileImage()
  const updateUserMutation = useUpdateUser()
  const changePasswordMutation = useChangePassword()

  // Determine which user data to display
  const user = isViewingOwnProfile ? currentUser : otherUser?.user
  const isLoading = isViewingOwnProfile
    ? isCurrentUserLoading
    : isOtherUserLoading

  useEffect(() => {
    if (user) {
      setEditProfileData({
        nome: user.nome || '',
        email: user.email || '',
        empresa: user.empresa || '',
        campus: user.campus || '',
      })
    }
  }, [user])

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
    setIsEditProfileOpen(true)
  }

  const handleDeleteProfile = async () => {
    if (window.confirm('Tem certeza que deseja deletar seu perfil?')) {
      try {
        await deleteUserMutation.mutateAsync({
          userType: currentUser?.user?.tipo_usuario,
          userId: currentUser?.user?.uid,
        })
        handleDeleteAccount()
      } catch (error) {
        console.error('Error deleting profile:', error)
        toast.error('Erro ao deletar perfil')
      }
    }
  }

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    setSelectedFile(file)
    setIsCropModalOpen(true)
  }

  const handleCropComplete = async (croppedImage: File) => {
    setIsCropModalOpen(false)
    setIsUploading(true)

    try {
      const result = await uploadProfileImageMutation.mutateAsync(croppedImage)
      toast.success('Foto de perfil atualizada com sucesso')
    } catch (error) {
      console.error('Error uploading profile image:', error)
      toast.error('Erro ao atualizar foto de perfil')
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
    }
  }

  const handleDeleteProfileImage = async () => {
    setIsDeleteImageDialogOpen(false)
    setIsUploading(true)

    try {
      await deleteProfileImageMutation.mutateAsync()
      toast.success('Foto de perfil removida com sucesso')
    } catch (error) {
      console.error('Error deleting profile image:', error)
      toast.error('Erro ao remover foto de perfil')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateUserMutation.mutateAsync({
        userData: editProfileData,
      })
      setIsEditProfileOpen(false)
      toast.success('Perfil atualizado com sucesso')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Erro ao atualizar perfil')
    }
  }

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
      setIsChangePasswordOpen(false)
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Senha alterada com sucesso')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Erro ao alterar senha')
    }
  }

  // Connection handling functions
  const handleSendConnectionRequest = async () => {
    if (!userId) return

    try {
      await sendConnectionMutation.mutateAsync(userId)
      toast.success('Solicitação de conexão enviada')
    } catch (error) {
      console.error('Error sending connection request:', error)
      toast.error('Erro ao enviar solicitação de conexão')
    }
  }

  const handleAcceptConnectionRequest = async () => {
    if (!userId) return

    try {
      await acceptConnectionMutation.mutateAsync({
        userId,
        status: ConnectionStatus.ACCEPTED,
      })
      toast.success('Solicitação de conexão aceita com sucesso')
    } catch (error) {
      toast.error('Erro ao aceitar solicitação de conexão')
    }
  }

  const handleRejectConnectionRequest = async () => {
    if (!userId) return

    try {
      await rejectConnectionMutation.mutateAsync({
        userId,
        status: ConnectionStatus.REJECTED,
      })
      toast.success('Solicitação de conexão rejeitada')
    } catch (error) {
      toast.error('Erro ao rejeitar solicitação de conexão')
    }
  }

  const handleCancelConnectionRequest = async () => {
    if (!userId) return

    try {
      await cancelConnectionMutation.mutateAsync(userId)
      toast.success('Solicitação de conexão cancelada')
    } catch (error) {
      toast.error('Erro ao cancelar solicitação de conexão')
    }
  }

  const handleRemoveConnection = async () => {
    if (!userId) return

    try {
      await removeConnectionMutation.mutateAsync({
        userId,
        userType: viewingUserType,
      })
      toast.success('Conexão removida com sucesso')
    } catch (error) {
      toast.error('Erro ao remover conexão')
    }
  }

  // Render connection action button based on connection status
  const renderConnectionActionButton = () => {
    if (isConnectionStatusLoading) {
      return (
        <Button disabled className="w-full">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Carregando...
        </Button>
      )
    }

    // Verificar se o usuário atual tem o ID do usuário visualizado em suas conexões
    const userConnections = currentUser?.user?.conexoes || []
    if (userConnections.includes(userId)) {
      return (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleRemoveConnection}
          disabled={removeConnectionMutation.isPending}
        >
          {removeConnectionMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <UserMinus className="h-4 w-4 mr-2" />
          )}
          Remover Conexão
        </Button>
      )
    }

    switch (connectionStatus) {
      case ConnectionStatus.ACCEPTED:
        return (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRemoveConnection}
            disabled={removeConnectionMutation.isPending}
          >
            {removeConnectionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <UserMinus className="h-4 w-4 mr-2" />
            )}
            Remover Conexão
          </Button>
        )
      case ConnectionStatus.PENDING: {
        // Verificar se o usuário atual enviou ou recebeu a solicitação
        const sentRequests = currentUser?.user?.solicitacoes_enviadas || []
        const receivedRequests = currentUser?.user?.solicitacoes_recebidas || []
        
        const isSentByMe = sentRequests.some(
          (req: any) => req.target_id === userId && req.status === ConnectionStatus.PENDING
        )
        
        const isReceivedByMe = receivedRequests.some(
          (req: any) => req.requester_id === userId && req.status === ConnectionStatus.PENDING
        )

        if (isSentByMe) {
          return (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCancelConnectionRequest}
              disabled={cancelConnectionMutation.isPending}
            >
              {cancelConnectionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserMinus className="h-4 w-4 mr-2" />
              )}
              Cancelar Solicitação
            </Button>
          )
        } else if (isReceivedByMe) {
          return (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={handleAcceptConnectionRequest}
                disabled={acceptConnectionMutation.isPending}
              >
                {acceptConnectionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                Aceitar
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={handleRejectConnectionRequest}
                disabled={rejectConnectionMutation.isPending}
              >
                {rejectConnectionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserX className="h-4 w-4 mr-2" />
                )}
                Rejeitar
              </Button>
            </div>
          )
        } else {
          return (
            <Button
              variant="outline"
              className="w-full"
              disabled={true}
            >
              <Loader2 className="h-4 w-4 mr-2" />
              Solicitação Pendente
            </Button>
          )
        }
      }
      default:
        return (
          <Button
            className="w-full"
            onClick={handleSendConnectionRequest}
            disabled={sendConnectionMutation.isPending}
          >
            {sendConnectionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Conectar
          </Button>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Loader2 className="h-12 w-12 text-primary" />
          </motion.div>
          <motion.p
            className="text-muted-foreground text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Carregando perfil...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-muted-foreground">
          Dados do usuário não disponíveis
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Informações Principais */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start gap-6">
              <div className="relative group">
                <motion.div
                  className="relative w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden transition-transform duration-200 transform group-hover:scale-105 border-4 border-background shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                >
                  {isUploading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  ) : (
                    <>
                      {user?.foto_url ? (
                        <Image
                          src={user.foto_url}
                          alt="Foto de perfil"
                          fill
                          sizes="(max-width: 144px) 100vw, 144px"
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <User2 className="h-12 w-12 text-gray-400" />
                      )}
                    </>
                  )}
                </motion.div>
                {isViewingOwnProfile && (
                  <motion.div
                    className="absolute bottom-0 right-0 flex gap-1.5 bg-background rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button
                      className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Camera className="h-4 w-4" />
                    </motion.button>
                    {user?.foto_url && (
                      <motion.button
                        className="h-8 w-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDeleteImageDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    )}
                  </motion.div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <motion.h1
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {user?.nome}
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {getUserTitle(user?.tipo_usuario as UserType)}
                  </motion.p>
                </div>

                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>

                  {user?.campus && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{user.campus}</span>
                    </div>
                  )}

                  {user?.empresa && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{user.empresa}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Membro desde{' '}
                      {new Date(user?.data_cadastro).toLocaleDateString(
                        'pt-BR',
                      )}
                    </span>
                  </div>
                </motion.div>

                {isViewingOwnProfile ? (
                  <motion.div
                    className="flex gap-2 pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleEditProfile}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleChangePassword}
                      >
                        <KeyIcon className="h-4 w-4 mr-2" />
                        Alterar Senha
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {renderConnectionActionButton()}
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Informações Adicionais */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Informações Adicionais
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Criado em:{' '}
                {new Date(user?.data_cadastro).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Conexões e Favoritos */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Conexões e Favoritos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Conexões</p>
                <p className="text-2xl font-bold">
                  {user?.conexoes?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Favoritos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Ações - Only show for own profile */}
        {isViewingOwnProfile && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Ações</h2>
              <div className="space-y-2">
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={handleEditProfile}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Editar Perfil
                  </Button>
                </motion.div>
                <Separator />
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <UserX className="h-4 w-4" />
                    Deletar Perfil
                  </Button>
                </motion.div>
                <Separator />
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={handleChangePassword}
                  >
                    <KeyIcon className="h-4 w-4" />
                    Alterar Senha
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Dialogs - Only show for own profile */}
      {isViewingOwnProfile && (
        <>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  sua conta e removerá seus dados de nossos servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProfile}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteUserMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Deletar Conta'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={isDeleteImageDialogOpen}
            onOpenChange={setIsDeleteImageDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover foto de perfil</AlertDialogTitle>
                <AlertDialogDescription>
                  Você tem certeza que deseja remover sua foto de perfil?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProfileImage}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteProfileImageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Remover Foto'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogDescription>
                  Faça as alterações necessárias no seu perfil.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={editProfileData.nome}
                    onChange={(e) =>
                      setEditProfileData((prev) => ({
                        ...prev,
                        nome: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editProfileData.email}
                    onChange={(e) =>
                      setEditProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                {user?.tipo_usuario === UserType.EXTERNO && (
                  <div className="grid gap-2">
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input
                      id="empresa"
                      value={editProfileData.empresa}
                      onChange={(e) =>
                        setEditProfileData((prev) => ({
                          ...prev,
                          empresa: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
                {(user?.tipo_usuario === UserType.PESQUISADOR ||
                  user?.tipo_usuario === UserType.ESTUDANTE) && (
                  <div className="grid gap-2">
                    <Label htmlFor="campus">Campus</Label>
                    <Input
                      id="campus"
                      value={editProfileData.campus}
                      onChange={(e) =>
                        setEditProfileData((prev) => ({
                          ...prev,
                          campus: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isChangePasswordOpen}
            onOpenChange={setIsChangePasswordOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
                <DialogDescription>
                  Digite sua senha atual e a nova senha.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsChangePasswordOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdatePassword}
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Alterar Senha'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedFile && (
            <ImageCropModal
              isOpen={isCropModalOpen}
              onClose={() => {
                setIsCropModalOpen(false)
                setSelectedFile(null)
              }}
              imageFile={selectedFile}
              onCropComplete={handleCropComplete}
            />
          )}
        </>
      )}
    </motion.div>
  )
}
