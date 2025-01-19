import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { UserBaseCreate } from '@/lib/types/userTypes'
import { Mail, MapPin, Briefcase, GraduationCap, Calendar } from 'lucide-react'

interface NetworkModalProps {
  user: UserBaseCreate | null
  isOpen: boolean
  onClose: () => void
}

export function NetworkModal({ user, isOpen, onClose }: NetworkModalProps) {
  if (!user) return null

  const getUserDetails = (user: UserBaseCreate) => {
    const details = [
      { icon: Mail, value: user.email },
      { icon: MapPin, value: (user as any).campus || (user as any).empresa || 'N/A' },
    ]

    if (user.tipo_usuario === 'estudante') {
      details.push({ icon: GraduationCap, value: (user as any).curso || 'N/A' })
    } else if (user.tipo_usuario === 'externo') {
      details.push({ icon: Briefcase, value: (user as any).cargo || 'N/A' })
    }

    if ((user as any).data_cadastro) {
      details.push({
        icon: Calendar,
        value: `Membro desde: ${new Date((user as any).data_cadastro).toLocaleDateString()}`,
      })
    }

    return details
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={'/default-avatar.jpg'} alt={user.nome} />
              <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.nome}</h3>
              <p className="text-sm text-gray-500">{user.tipo_usuario}</p>
            </div>
          </div>
          <div className="grid gap-2">
            {getUserDetails(user).map(({ icon: Icon, value }, index) => (
              <div key={index} className="flex items-center">
                <Icon className="w-4 h-4 mr-2 text-gray-500" />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

