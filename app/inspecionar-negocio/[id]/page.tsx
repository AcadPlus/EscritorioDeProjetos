/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageCropModal } from '@/components/ImageCropModal'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/context/AuthContext'
import { useBusinessApi } from '@/lib/api/business'
import { useUserApi } from '@/lib/api/users'
import { NegocioUpdate, PapelNegocio } from '@/lib/types/businessTypes'

// Componentes
import { BusinessHeader } from '../components/BusinessHeader'
import { BusinessInfo } from '../components/BusinessInfo'
import { MembersSection } from '../components/MembersSection'
import { InitiativesSection } from '../components/InitiativesSection'

interface BusinessDetailPageProps {
  params: Promise<{
    id: string
  }>
}

interface UserType {
  uid: string
  nome: string
}

export default function BusinessDetailPage({
  params,
}: BusinessDetailPageProps) {
  // Usar a função use() para desempacotar params
  const { id } = React.use(params)
  const {
    useGetBusiness,
    useUpdateBusinessPhotos,
    useUpdateBusiness,
    useAddBusinessMember,
    useRemoveBusinessMember,
  } = useBusinessApi()
  const { useFetchUsers } = useUserApi()
  const auth = useAuth()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editedBusiness, setEditedBusiness] = useState<NegocioUpdate>({})
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    file: File
    type: 'profile' | 'cover'
  } | null>(null)
  const { data: users = [] } = useFetchUsers()
  const { mutate: addMember } = useAddBusinessMember()
  const { mutate: removeMember } = useRemoveBusinessMember()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [userRoles, setUserRoles] = useState<Record<string, PapelNegocio>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'info' | 'members' | 'initiatives'
  >('info')

  const { data: business, isLoading, error, refetch } = useGetBusiness(id)
  const updatePhotosMutation = useUpdateBusinessPhotos()
  const updateBusinessMutation = useUpdateBusiness()
  const { toast } = useToast()

  // Refs para os inputs de arquivo
  const profileInputRef = React.useRef<HTMLInputElement>(null)
  const coverInputRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const isOwner = business?.uid_admin === auth.userId

  useEffect(() => {
    if (business) {
      setSelectedUsers([])
      setUserRoles({})
      setEditedBusiness({})
    }
  }, [business])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFieldChange = (field: keyof NegocioUpdate, value: string) => {
    setEditedBusiness((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveFields = async () => {
    try {
      await updateBusinessMutation.mutateAsync({
        businessId: id,
        updateData: editedBusiness,
      })
      setIsEditingFields(false)
      setEditedBusiness({})
      await refetch()
      toast({
        title: 'Sucesso',
        description: 'Informações atualizadas com sucesso',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as informações',
        variant: 'destructive',
      })
    }
  }

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'cover',
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage({ file, type })
      setIsCropModalOpen(true)
    }
  }

  const handleCropComplete = async (croppedImage: File) => {
    if (!selectedImage) return

    try {
      const updateData = {
        businessId: id,
        fotoPerfil: selectedImage.type === 'profile' ? croppedImage : undefined,
        fotoCapa: selectedImage.type === 'cover' ? croppedImage : undefined,
      }

      await updatePhotosMutation.mutateAsync(updateData)

      setIsCropModalOpen(false)
      setSelectedImage(null)
      await refetch()

      toast({
        title: 'Sucesso',
        description: 'Imagem atualizada com sucesso',
      })
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a imagem',
        variant: 'destructive',
      })
    }
  }

  const handleInviteUsers = async () => {
    try {
      if (selectedUsers.length === 0) {
        toast({
          title: 'Aviso',
          description: 'Selecione pelo menos um usuário para convidar',
          variant: 'default',
        })
        return
      }

      for (const userId of selectedUsers) {
        const papel = userRoles[userId] || PapelNegocio.MEMBRO
        await addMember({
          businessId: id,
          userId,
          papel,
        })
      }

      setShowInviteDialog(false)
      setSelectedUsers([])
      setUserRoles({})
      await refetch()

      toast({
        title: 'Sucesso',
        description: 'Convites enviados com sucesso',
      })
    } catch (error) {
      console.error('Erro ao adicionar usuários:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar os convites',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember({
        businessId: id,
        userId,
      })
      await refetch()
      toast({
        title: 'Sucesso',
        description: 'Membro removido com sucesso',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o membro',
        variant: 'destructive',
      })
    }
  }

  const filteredUsers = React.useMemo(() => {
    if (!users || !business) return []

    return users.filter((user: UserType) => {
      const membros = business.membros || {}
      const isMember = Object.keys(membros).includes(user.uid)
      const isOwner = user.uid === business.uid_admin
      const matchesSearch = user.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return !isMember && !isOwner && matchesSearch
    })
  }, [users, business, searchTerm])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
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
            Carregando negócio...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-b from-gray-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-gray-600 mb-4">Negócio não encontrado</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Voltar
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full">
      {/* Capa e Foto de Perfil */}
      <BusinessHeader
        business={business}
        isOwner={isOwner}
        onProfilePhotoClick={() => profileInputRef.current?.click()}
        onCoverPhotoClick={() => coverInputRef.current?.click()}
      />

      {/* Navegação em dispositivos móveis */}
      <div className="sticky top-0 z-30 bg-white shadow-md md:hidden mt-12">
        <div className="flex justify-between border-b">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              activeTab === 'info'
                ? 'text-gray-900 border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              activeTab === 'members'
                ? 'text-gray-900 border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            Membros
          </button>
          <button
            onClick={() => setActiveTab('initiatives')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              activeTab === 'initiatives'
                ? 'text-gray-900 border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            Iniciativas
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="pb-8 w-full" ref={contentRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="pt-8 md:pt-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {/* Informações do Negócio - Visível em todos os dispositivos em desktop, apenas quando selecionado em mobile */}
              <AnimatePresence mode="wait">
                {(activeTab === 'info' || window.innerWidth >= 768) && (
                  <motion.div
                    key="info"
                    className="md:col-span-7 lg:col-span-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BusinessInfo
                      business={business}
                      isOwner={isOwner}
                      isEditingFields={isEditingFields}
                      editedBusiness={editedBusiness}
                      onEditToggle={() => setIsEditingFields(!isEditingFields)}
                      onSaveFields={handleSaveFields}
                      onFieldChange={handleFieldChange}
                    />
                  </motion.div>
                )}

                {/* Coluna da Direita - Membros e Iniciativas */}
                <motion.div
                  className="md:col-span-5 lg:col-span-4 space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Membros do Negócio - Visível em desktop ou quando selecionado em mobile */}
                  {(activeTab === 'members' || window.innerWidth >= 768) && (
                    <motion.div
                      key="members"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MembersSection
                        business={business}
                        isOwner={isOwner}
                        users={users}
                        showInviteDialog={showInviteDialog}
                        setShowInviteDialog={setShowInviteDialog}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        userRoles={userRoles}
                        setUserRoles={setUserRoles}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredUsers={filteredUsers}
                        onInviteUsers={handleInviteUsers}
                        onRemoveMember={handleRemoveMember}
                      />
                    </motion.div>
                  )}

                  {/* Iniciativas do Negócio - Visível em desktop ou quando selecionado em mobile */}
                  {(activeTab === 'initiatives' ||
                    window.innerWidth >= 768) && (
                    <motion.div
                      key="initiatives"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <InitiativesSection business={business} />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de voltar ao topo */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg z-50"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modais */}
      {selectedImage?.file && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          onCropComplete={handleCropComplete}
          imageFile={selectedImage.file}
          aspectRatio={selectedImage.type === 'profile' ? 1 : 16 / 9}
        />
      )}

      {/* Input files ocultos */}
      <input
        type="file"
        ref={profileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'profile')}
      />
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'cover')}
      />
    </div>
  )
}
