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
import { 
  Trash2,
  Check,
  X,
  Bell,
  MailOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useNotifications } from '@/lib/context/NotificationsContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { motion } from 'framer-motion'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  confirmVariant?: 'default' | 'destructive' | 'outline'
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmVariant = 'default',
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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

    // Limpa o intervalo quando o componente é desmontado
    return () => {}
  }, [refetch])

  // Atualiza quando o usuário volta para a página
  useEffect(() => {
    // Variável para controlar o throttling
    let lastFocusTime = 0;
    const throttleDelay = 10000; // 10 segundos

    const handleFocus = () => {
      const now = Date.now();
      // Só atualiza se passaram pelo menos 10 segundos desde a última atualização
      if (now - lastFocusTime >= throttleDelay) {
        lastFocusTime = now;
        refetch();
        // Não precisamos chamar refetchGlobal() aqui, pois refetch() já atualiza os dados
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleFocus()
      }
    })

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [refetch])

  const handleDeleteConfirm = async () => {
    try {
      await deleteNotification.mutateAsync(deleteModalData.notificationId)
      refetchGlobal()
      toast.success('Notificação excluída com sucesso')
      setDeleteModalData({ isOpen: false, notificationId: '' })
    } catch (error) {
      toast.error('Erro ao excluir notificação')
    }
  }

  const handleAcceptConfirm = async () => {
    try {
      if (acceptModalData.type === NotificationType.CONVITE_INICIATIVA) {
        await acceptInvite.mutateAsync(acceptModalData.initiativeId)
        await markAsRead.mutateAsync(acceptModalData.notificationId)
        refetchGlobal()
        refetch()
        toast.success('Convite aceito com sucesso')
        setAcceptModalData({
          isOpen: false,
          notificationId: '',
          initiativeId: '',
          type: NotificationType.CONVITE_INICIATIVA,
        })
        router.push(`/linka/iniciativas/${acceptModalData.initiativeId}`)
      } else if (acceptModalData.type === NotificationType.CONVITE_NEGOCIO && acceptModalData.businessId) {
        await acceptBusinessInvite.mutateAsync({ businessId: acceptModalData.businessId })
        await markAsRead.mutateAsync(acceptModalData.notificationId)
        refetchGlobal()
        refetch()
        toast.success('Convite para negócio aceito com sucesso')
        setAcceptModalData({
          isOpen: false,
          notificationId: '',
          initiativeId: '',
          type: NotificationType.CONVITE_INICIATIVA,
        })
        router.push(`/linka/inspecionar-negocio/${acceptModalData.businessId}`)
      }
    } catch (error) {
      toast.error('Erro ao aceitar convite')
    }
  }

  const handleRejectConfirm = async () => {
    try {
      if (rejectModalData.type === NotificationType.CONVITE_INICIATIVA) {
        await rejectInvite.mutateAsync({
          initiativeId: rejectModalData.initiativeId,
          userId: rejectModalData.userId,
        })
        await markAsRead.mutateAsync(rejectModalData.notificationId)
        refetchGlobal()
        refetch()
        toast.success('Convite recusado com sucesso')
      } else if (rejectModalData.type === NotificationType.CONVITE_NEGOCIO && rejectModalData.businessId) {
        await rejectBusinessInvite.mutateAsync({
          businessId: rejectModalData.businessId,
        })
        await markAsRead.mutateAsync(rejectModalData.notificationId)
        refetchGlobal()
        refetch()
        toast.success('Convite para negócio recusado com sucesso')
      }
      
      setRejectModalData({
        isOpen: false,
        notificationId: '',
        initiativeId: '',
        userId: '',
        type: NotificationType.CONVITE_INICIATIVA,
      })
    } catch (error) {
      toast.error('Erro ao recusar convite')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync()
      refetchGlobal() // Atualiza o contador global
      toast.success('Todas as notificações foram marcadas como lidas')
    } catch (error) {
      toast.error('Erro ao marcar notificações como lidas')
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id)
      refetchGlobal() // Atualiza o contador global
      toast.success('Notificação marcada como lida')
    } catch (error) {
      toast.error('Erro ao marcar notificação como lida')
    }
  }

  // Função para abrir modal de detalhes
  const openDetailsModal = (notification: Notification) => {
    // Se for uma notificação de rejeição de negócio
    if (notification.tipo === NotificationType.NEGOCIO_RECUSADO) {
      const data = notification.data as unknown as BusinessRejectionData;
      setDetailsModal({
        isOpen: true,
        title: notification.titulo,
        message: notification.mensagem,
        details: data?.motivo_rejeicao || 'Nenhum motivo especificado',
        resourceType: 'business',
        resourceId: data?.business_id,
        resourceName: data?.business_name
      });
      // Marcar como lida se ainda não estiver
      if (!notification.lida) {
        handleMarkAsRead(notification.id);
      }
    } 
    // Se for uma notificação de rejeição de iniciativa
    else if (notification.tipo === NotificationType.INICIATIVA_RECUSADA) {
      const data = notification.data as unknown as InitiativeRejectionData;
      setDetailsModal({
        isOpen: true,
        title: notification.titulo,
        message: notification.mensagem,
        details: data?.motivo_rejeicao || 'Nenhum motivo especificado',
        resourceType: 'initiative',
        resourceId: data?.initiative_id,
        resourceName: data?.initiative_name
      });
      // Marcar como lida se ainda não estiver
      if (!notification.lida) {
        handleMarkAsRead(notification.id);
      }
    }
  };

  // Função para navegar para o recurso relacionado a notificação
  const handleNotificationClick = (notification: Notification) => {
    // Marcar como lida, se ainda não foi lida
    if (!notification.lida) {
      handleMarkAsRead(notification.id);
    }

    // Navegar ou abrir detalhes com base no tipo de notificação
    const data = notification.data || {};
    
    switch (notification.tipo) {
      case NotificationType.NEGOCIO_APROVADO:
        if (data.business_id) {
          router.push(`/linka/meus-negocios/${data.business_id as string}`);
        }
        break;
        
      case NotificationType.NEGOCIO_RECUSADO:
        if (data.business_id) {
          openDetailsModal(notification);
        }
        break;
        
      case NotificationType.INICIATIVA_APROVADA:
        if (data.initiative_id) {
          router.push(`/linka/minhas-iniciativas/${data.initiative_id as string}`);
        }
        break;
        
      case NotificationType.INICIATIVA_RECUSADA:
        if (data.initiative_id) {
          openDetailsModal(notification);
        }
        break;
        
      case NotificationType.CONEXAO_ACEITA:
        // Redirecionar para o perfil do usuário que aceitou a conexão
        if (data.target_id) {
          router.push(`/linka/perfil/${data.target_id as string}`);
        }
        break;
        
      case NotificationType.CONEXAO_RECUSADA:
        // Abrir detalhes da notificação
        openDetailsModal(notification);
        break;
        
      default:
        // Apenas marcar como lida
        break;
    }
  };

  // Verificar se uma notificação é clicável
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando notificações...</p>
        </div>
      </div>
    )
  }

  return (
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
      <Dialog open={detailsModal.isOpen} onOpenChange={() => setDetailsModal({...detailsModal, isOpen: false})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailsModal.title}</DialogTitle>
            <DialogDescription>{detailsModal.message}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {/* Informações do recurso */}
            {detailsModal.resourceName && (
              <div>
                <h4 className="font-medium text-sm mb-2">
                  {detailsModal.resourceType === 'business' ? 'Negócio' : 'Iniciativa'}:
                </h4>
                <div className="bg-gray-50 p-3 rounded-md border text-sm">
                  {detailsModal.resourceName}
                </div>
              </div>
            )}
            
            {/* Motivo da rejeição */}
            <div>
              <h4 className="font-medium text-sm mb-2">Motivo da Rejeição:</h4>
              <div className="bg-gray-50 p-3 rounded-md border text-sm whitespace-pre-line">
                {detailsModal.details}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-between">
            <Button 
              onClick={() => setDetailsModal({...detailsModal, isOpen: false})}
              variant="outline"
            >
              Fechar
            </Button>
            {detailsModal.resourceId && (
              <Button
                onClick={() => {
                  setDetailsModal({...detailsModal, isOpen: false});
                  if (detailsModal.resourceType === 'business') {
                    router.push(`/linka/inspecionar-negocio/${detailsModal.resourceId}`);
                  } else if (detailsModal.resourceType === 'initiative') {
                    router.push(`/linka/iniciativas/${detailsModal.resourceId}`);
                  }
                }}
              >
                Visualizar {detailsModal.resourceType === 'business' ? 'Negócio' : 'Iniciativa'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card
                    className={`${
                      notification.lida ? 'bg-gray-50' : 'bg-white border-blue-200'
                    } transition-all duration-200 hover:shadow-md`}
                  >
                    {notification.tipo === NotificationType.CONVITE_INICIATIVA || notification.tipo === NotificationType.CONVITE_NEGOCIO ? (
                      // Layout para convites
                      <div className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-base font-medium">
                                {notification.titulo}
                                {!notification.lida && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {format(
                                  new Date(notification.created_at),
                                  "d 'de' MMMM 'às' HH:mm",
                                  {
                                    locale: ptBR,
                                  },
                                )}
                              </p>
                              <p className="text-sm text-gray-700 mt-2">
                                {notification.mensagem}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.lida ? (
                                <>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      onClick={() => {
                                        if (notification.tipo === NotificationType.CONVITE_INICIATIVA) {
                                          setAcceptModalData({
                                            isOpen: true,
                                            notificationId: notification.id,
                                            initiativeId: notification.data?.initiative_id,
                                            type: NotificationType.CONVITE_INICIATIVA,
                                          });
                                        } else if (notification.tipo === NotificationType.CONVITE_NEGOCIO) {
                                          setAcceptModalData({
                                            isOpen: true,
                                            notificationId: notification.id,
                                            initiativeId: '',
                                            businessId: notification.data?.business_id,
                                            type: NotificationType.CONVITE_NEGOCIO,
                                          });
                                        }
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Aceitar
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      onClick={() => {
                                        if (notification.tipo === NotificationType.CONVITE_INICIATIVA) {
                                          setRejectModalData({
                                            isOpen: true,
                                            notificationId: notification.id,
                                            initiativeId: notification.data?.initiative_id,
                                            userId: notification.user_id,
                                            type: NotificationType.CONVITE_INICIATIVA,
                                          });
                                        } else if (notification.tipo === NotificationType.CONVITE_NEGOCIO) {
                                          setRejectModalData({
                                            isOpen: true,
                                            notificationId: notification.id,
                                            initiativeId: '',
                                            businessId: notification.data?.business_id,
                                            userId: notification.user_id,
                                            type: NotificationType.CONVITE_NEGOCIO,
                                          });
                                        }
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Recusar
                                    </Button>
                                  </motion.div>
                                </>
                              ) : (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Check className="w-4 h-4 mr-1" />
                                  {notification.tipo_resposta === 'ACEITO'
                                    ? 'Convite aceito'
                                    : 'Convite recusado'}
                                </div>
                              )}
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  onClick={() =>
                                    setDeleteModalData({
                                      isOpen: true,
                                      notificationId: notification.id,
                                    })
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-red-600 h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Layout para notificações regulares (padronizado com o mesmo estilo dos convites)
                      <div 
                        className={`p-4 ${
                          isClickableNotification(notification.tipo)
                            ? 'cursor-pointer hover:bg-gray-50' 
                            : ''
                        }`}
                        onClick={() => {
                          if (isClickableNotification(notification.tipo)) {
                            handleNotificationClick(notification);
                          }
                        }}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-base font-medium">
                                {notification.titulo}
                                {!notification.lida && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {format(
                                  new Date(notification.created_at),
                                  "d 'de' MMMM 'às' HH:mm",
                                  {
                                    locale: ptBR,
                                  },
                                )}
                              </p>
                              <p className="text-sm text-gray-700 mt-2">
                                {notification.mensagem}
                                {(notification.tipo === NotificationType.NEGOCIO_RECUSADO || 
                                  notification.tipo === NotificationType.INICIATIVA_RECUSADA) && (
                                  <span className="text-blue-500 ml-1 text-xs">Clique para ver o motivo</span>
                                )}
                                {(notification.tipo === NotificationType.NEGOCIO_APROVADO || 
                                  notification.tipo === NotificationType.INICIATIVA_APROVADA) && (
                                  <span className="text-blue-500 ml-1 text-xs">Clique para visualizar</span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {notification.lida ? (
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Check className="w-4 h-4 mr-1" />
                                  Lido
                                </span>
                              ) : (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Evita que o clique dispare o onClick do container
                                      handleMarkAsRead(notification.id);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-600"
                                  >
                                    <MailOpen className="w-4 h-4 mr-1" />
                                    Marcar como lido
                                  </Button>
                                </motion.div>
                              )}
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Evita que o clique dispare o onClick do container
                                    setDeleteModalData({
                                      isOpen: true,
                                      notificationId: notification.id,
                                    });
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-red-600 h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
              
              {/* Paginação */}
              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="text-sm text-gray-500">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, notifications.length)} de {notifications.length} notificações
                  </div>
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        Próxima
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
