'use client'

import { useNotificationsApi } from '@/lib/api/notifications'
import { useInitiativesApi } from '@/lib/api/initiatives'
import { useBusinessApi } from '@/lib/api/business'
import { NotificationType, Notification } from '@/lib/types/notificationTypes'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Bell } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useNotifications } from '@/lib/context/NotificationsContext'
import { motion } from 'framer-motion'
import PrivateRoute from '@/components/private_route'

// Import components
import { ConfirmationModal } from './components/ConfirmationModal'
import { NotificationCard } from './components/NotificationCard'
import { DetailsModal } from './components/DetailsModal'
import { Pagination } from './components/Pagination'
import { LoadingState } from './components/LoadingState'

// Interfaces para os dados específicos de notificação
interface BusinessRejectionData {
  business_id: string;
  business_name: string;
  rejecter_id: string;
  rejecter_name: string;
  motivo_rejeicao: string;
}

interface InitiativeRejectionData {
  initiative_id: string;
  initiative_name: string;
  rejecter_id: string;
  rejecter_name: string;
  motivo_rejeicao: string;
}

export default function NotificacoesPage() {
  const router = useRouter()
  const { refetch: refetchGlobal } = useNotifications()
  const {
    useGetNotifications,
    useDeleteNotification,
    useMarkAsRead,
    useMarkAllAsRead,
  } = useNotificationsApi()

  const { useAcceptInvite, useRejectInvite } = useInitiativesApi()
  const { useAcceptBusinessInvite, useRejectBusinessInvite } = useBusinessApi()

  const { data: notificationsData = [], isLoading, refetch } = useGetNotifications()
  const deleteNotification = useDeleteNotification()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  const acceptInvite = useAcceptInvite()
  const rejectInvite = useRejectInvite()
  const acceptBusinessInvite = useAcceptBusinessInvite()
  const rejectBusinessInvite = useRejectBusinessInvite()

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  // Estados para controle dos modais
  const [deleteModalData, setDeleteModalData] = useState<{
    isOpen: boolean
    notificationId: string
  }>({
    isOpen: false,
    notificationId: '',
  })
  const [acceptModalData, setAcceptModalData] = useState<{
    isOpen: boolean
    notificationId: string
    initiativeId: string
    businessId?: string
    type: NotificationType
  }>({
    isOpen: false,
    notificationId: '',
    initiativeId: '',
    type: NotificationType.CONVITE_INICIATIVA,
  })
  const [rejectModalData, setRejectModalData] = useState<{
    isOpen: boolean
    notificationId: string
    initiativeId: string
    businessId?: string
    userId: string
    type: NotificationType
  }>({
    isOpen: false,
    notificationId: '',
    initiativeId: '',
    userId: '',
    type: NotificationType.CONVITE_INICIATIVA,
  })

  // Adicionar novo estado para modal de detalhes
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details?: string;
    resourceType?: 'business' | 'initiative';
    resourceId?: string;
    resourceName?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    details: '',
  });

  // Ordenar notificações do mais recente para o mais antigo
  const notifications = [...notificationsData].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // Calcular total de páginas
  const totalPages = Math.ceil(notifications.length / itemsPerPage)
  
  // Obter notificações da página atual
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Funções de navegação
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Busca inicial e configuração do intervalo de atualização
  useEffect(() => {
    // Busca inicial
    refetch()

    // Configurar intervalo para buscar notificações a cada 30 segundos
    const interval = setInterval(() => {
      refetch()
    }, 30000)

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(interval)
  }, [refetch])

  // Atualizar contador de notificações quando o foco voltar para a página
  useEffect(() => {
    const handleFocus = () => {
      refetch()
      refetchGlobal()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [refetch, refetchGlobal])

  // Handlers para as ações
  const handleDeleteConfirm = async () => {
    try {
      await deleteNotification.mutateAsync(deleteModalData.notificationId)
      setDeleteModalData({ isOpen: false, notificationId: '' })
      toast.success('Notificação excluída com sucesso')
      refetchGlobal()
    } catch (error) {
      toast.error('Erro ao excluir notificação')
    }
  }

  const handleAcceptConfirm = async () => {
    try {
      // Marcar como lida primeiro
      await markAsRead.mutateAsync(acceptModalData.notificationId)
      
      if (acceptModalData.type === NotificationType.CONVITE_INICIATIVA) {
        // Aceitar convite de iniciativa
        await acceptInvite.mutateAsync({
          initiativeId: acceptModalData.initiativeId,
          notificationId: acceptModalData.notificationId,
        })
      } else if (acceptModalData.type === NotificationType.CONVITE_NEGOCIO) {
        // Aceitar convite de negócio
        await acceptBusinessInvite.mutateAsync({
          businessId: acceptModalData.businessId!,
          notificationId: acceptModalData.notificationId,
        })
      }
      
        setAcceptModalData({
          isOpen: false,
          notificationId: '',
          initiativeId: '',
          type: NotificationType.CONVITE_INICIATIVA,
        })
      
      toast.success('Convite aceito com sucesso')
      refetch()
      refetchGlobal()
    } catch (error) {
      toast.error('Erro ao aceitar convite')
    }
  }

  const handleRejectConfirm = async () => {
    try {
      // Marcar como lida primeiro
      await markAsRead.mutateAsync(rejectModalData.notificationId)
      
      if (rejectModalData.type === NotificationType.CONVITE_INICIATIVA) {
        // Rejeitar convite de iniciativa
        await rejectInvite.mutateAsync({
          initiativeId: rejectModalData.initiativeId,
          notificationId: rejectModalData.notificationId,
        })
      } else if (rejectModalData.type === NotificationType.CONVITE_NEGOCIO) {
        // Rejeitar convite de negócio
        await rejectBusinessInvite.mutateAsync({
          businessId: rejectModalData.businessId!,
          notificationId: rejectModalData.notificationId,
        })
      }
      
      setRejectModalData({
        isOpen: false,
        notificationId: '',
        initiativeId: '',
        userId: '',
        type: NotificationType.CONVITE_INICIATIVA,
      })
      
      toast.success('Convite recusado com sucesso')
      refetch()
      refetchGlobal()
    } catch (error) {
      toast.error('Erro ao recusar convite')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync()
      toast.success('Todas as notificações marcadas como lidas')
      refetch()
      refetchGlobal()
    } catch (error) {
      toast.error('Erro ao marcar notificações como lidas')
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id)
      toast.success('Notificação marcada como lida')
      refetch()
      refetchGlobal()
    } catch (error) {
      toast.error('Erro ao marcar notificação como lida')
    }
  }

  const openDetailsModal = (notification: Notification) => {
    // Informações padrão para o modal
    let modalData = {
        isOpen: true,
        title: notification.titulo,
        message: notification.mensagem,
      details: '',
      resourceType: undefined as 'business' | 'initiative' | undefined,
      resourceId: undefined as string | undefined,
      resourceName: undefined as string | undefined,
    };

    // Adicionar detalhes específicos com base no tipo da notificação
    if (notification.tipo === NotificationType.NEGOCIO_RECUSADO) {
      // Processar dados de recusa de negócio
      const rejectionData = notification.data as BusinessRejectionData;
      modalData.details = rejectionData.motivo_rejeicao;
      modalData.resourceType = 'business';
      modalData.resourceId = rejectionData.business_id;
      modalData.resourceName = rejectionData.business_name;
    } 
    else if (notification.tipo === NotificationType.INICIATIVA_RECUSADA) {
      // Processar dados de recusa de iniciativa
      const rejectionData = notification.data as InitiativeRejectionData;
      modalData.details = rejectionData.motivo_rejeicao;
      modalData.resourceType = 'initiative';
      modalData.resourceId = rejectionData.initiative_id;
      modalData.resourceName = rejectionData.initiative_name;
    }
    else if (notification.tipo === NotificationType.NEGOCIO_APROVADO) {
      // Apenas definir o ID e tipo para navegação
      modalData.resourceType = 'business';
      modalData.resourceId = notification.data?.business_id;
      modalData.resourceName = notification.data?.business_name;
    }
    else if (notification.tipo === NotificationType.INICIATIVA_APROVADA) {
      // Apenas definir o ID e tipo para navegação
      modalData.resourceType = 'initiative';
      modalData.resourceId = notification.data?.initiative_id;
      modalData.resourceName = notification.data?.initiative_name;
    }

    setDetailsModal(modalData);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Primeiro marca como lida
    if (!notification.lida) {
      handleMarkAsRead(notification.id);
    }

    // Depois processa a ação com base no tipo
    switch (notification.tipo) {
      case NotificationType.NEGOCIO_APROVADO:
        if (notification.data?.business_id) {
          router.push(`/inspecionar-negocio/${notification.data.business_id}`);
        }
        break;
        
      case NotificationType.NEGOCIO_RECUSADO:
      case NotificationType.INICIATIVA_RECUSADA:
          openDetailsModal(notification);
        break;
        
      case NotificationType.INICIATIVA_APROVADA:
        if (notification.data?.initiative_id) {
          router.push(`/iniciativas/${notification.data.initiative_id}`);
        }
        break;
        
      case NotificationType.CONEXAO_ACEITA:
      case NotificationType.CONEXAO_RECUSADA:
        if (notification.data?.user_id) {
          router.push(`/perfil?id=${notification.data.user_id}&type=${notification.data.user_type}`);
        }
        break;
        
      default:
        break;
    }
  };

  const isClickableNotification = (tipo: NotificationType): boolean => {
    return [
      NotificationType.NEGOCIO_APROVADO,
      NotificationType.NEGOCIO_RECUSADO,
      NotificationType.INICIATIVA_APROVADA, 
      NotificationType.INICIATIVA_RECUSADA,
      NotificationType.CONEXAO_ACEITA,
      NotificationType.CONEXAO_RECUSADA,
    ].includes(tipo)
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <PrivateRoute>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Modais de Confirmação */}
      <ConfirmationModal
        isOpen={deleteModalData.isOpen}
        onClose={() =>
          setDeleteModalData({ isOpen: false, notificationId: '' })
        }
        onConfirm={handleDeleteConfirm}
        title="Excluir Notificação"
        description="Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmVariant="destructive"
      />

      <ConfirmationModal
        isOpen={acceptModalData.isOpen}
        onClose={() =>
          setAcceptModalData({
            isOpen: false,
            notificationId: '',
            initiativeId: '',
            type: NotificationType.CONVITE_INICIATIVA,
          })
        }
        onConfirm={handleAcceptConfirm}
        title="Aceitar Convite"
        description={`Tem certeza que deseja aceitar o convite para participar ${acceptModalData.type === NotificationType.CONVITE_NEGOCIO ? 'deste negócio' : 'desta iniciativa'}?`}
        confirmText="Aceitar"
        confirmVariant="default"
      />

      <ConfirmationModal
        isOpen={rejectModalData.isOpen}
        onClose={() =>
          setRejectModalData({
            isOpen: false,
            notificationId: '',
            initiativeId: '',
            userId: '',
            type: NotificationType.CONVITE_INICIATIVA,
          })
        }
        onConfirm={handleRejectConfirm}
        title="Recusar Convite"
        description={`Tem certeza que deseja recusar o convite para participar ${rejectModalData.type === NotificationType.CONVITE_NEGOCIO ? 'deste negócio' : 'desta iniciativa'}?`}
        confirmText="Recusar"
        confirmVariant="destructive"
      />

      {/* Modal de Detalhes da Rejeição */}
        <DetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({...detailsModal, isOpen: false})}
          title={detailsModal.title}
          message={detailsModal.message}
          details={detailsModal.details}
          resourceType={detailsModal.resourceType}
          resourceId={detailsModal.resourceId}
          resourceName={detailsModal.resourceName}
        />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Cabeçalho e Controles */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-6">
            {/* Título e Botão */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Central de Notificações
                </h2>
                <p className="text-sm text-gray-500">
                  Acompanhe todas as suas notificações e interações no sistema
                </p>
              </div>
              {notifications.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleMarkAllAsRead}
                    className="bg-black text-white hover:bg-black/70"
                  >
                    Marcar todas como lidas
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lista de Notificações */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-600">
                      Nenhuma notificação encontrada
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              {paginatedNotifications.map((notification, index) => (
                  <NotificationCard
                  key={notification.id}
                    notification={notification}
                    index={index}
                    isClickableNotification={isClickableNotification}
                    handleNotificationClick={handleNotificationClick}
                    handleMarkAsRead={handleMarkAsRead}
                    setDeleteModalData={setDeleteModalData}
                    setAcceptModalData={setAcceptModalData}
                    setRejectModalData={setRejectModalData}
                  />
              ))}
              
              {/* Paginação */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToNextPage={goToNextPage}
                  goToPreviousPage={goToPreviousPage}
                />
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
    </PrivateRoute>
  )
}
