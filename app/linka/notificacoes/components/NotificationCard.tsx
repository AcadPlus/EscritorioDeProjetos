import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, MailOpen, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Notification, NotificationType } from '@/lib/types/notificationTypes'

interface NotificationCardProps {
  notification: Notification
  index: number
  isClickableNotification: (tipo: NotificationType) => boolean
  handleNotificationClick: (notification: Notification) => void
  handleMarkAsRead: (id: string) => void
  setDeleteModalData: (data: { isOpen: boolean; notificationId: string }) => void
  setAcceptModalData: (data: {
    isOpen: boolean
    notificationId: string
    initiativeId: string
    businessId?: string
    type: NotificationType
  }) => void
  setRejectModalData: (data: {
    isOpen: boolean
    notificationId: string
    initiativeId: string
    businessId?: string
    userId: string
    type: NotificationType
  }) => void
}

export const NotificationCard = ({
  notification,
  index,
  isClickableNotification,
  handleNotificationClick,
  handleMarkAsRead,
  setDeleteModalData,
  setAcceptModalData,
  setRejectModalData
}: NotificationCardProps) => {
  return (
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
          // Layout para notificações regulares
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
                          e.stopPropagation();
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
                        e.stopPropagation();
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
  )
} 