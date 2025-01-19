'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { UserBase } from '../perfil/mockData'
import { UserCheck, Loader2, UserPlus, UserMinus } from 'lucide-react'
import { useEffect } from 'react'

interface NetworkCardProps {
  user: UserBase
  showActions?: boolean
  renderActionButtons: (user: UserBase) => React.ReactNode
  renderStatusTag: (user: UserBase) => React.ReactNode
  onViewProfile: (user: UserBase) => void
}

export function NetworkCard({
  user,
  showActions = true,
  renderActionButtons,
  renderStatusTag,
  onViewProfile,
}: NetworkCardProps) {
  useEffect(() => {
    if (!onViewProfile) {
      console.warn('onViewProfile function is not provided to NetworkCard component');
    }
  }, [onViewProfile]);
  const getUserRole = (user: UserBase) => {
    switch (user.tipo_usuario) {
      case 'estudante':
        return 'Estudante'
      case 'pesquisador':
        return 'Pesquisador'
      case 'externo':
        return 'Externo'
      default:
        return 'Usuário'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={user.nome} src={'/default-avatar.jpg'} />
              <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold mb-1">{user.nome}</h3>
              <p className="text-sm text-gray-500 mb-1">{getUserRole(user)}</p>
              <p className="text-sm text-gray-500">
                {user.campus || user.empresa || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {renderStatusTag(user)}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewProfile(user)}
            >
              Ver Perfil
            </Button>
          </div>
          {showActions && (
            <div className="mt-4">{renderActionButtons(user)}</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

