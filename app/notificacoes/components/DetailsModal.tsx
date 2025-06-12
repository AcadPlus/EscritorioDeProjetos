import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  details?: string
  resourceType?: 'business' | 'initiative'
  resourceId?: string
  resourceName?: string
}

export const DetailsModal = ({
  isOpen,
  onClose,
  title,
  message,
  details,
  resourceType,
  resourceId,
  resourceName,
}: DetailsModalProps) => {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {/* Informações do recurso */}
          {resourceName && (
            <div>
              <h4 className="font-medium text-sm mb-2">
                {resourceType === 'business' ? 'Negócio' : 'Iniciativa'}:
              </h4>
              <div className="bg-gray-50 p-3 rounded-md border text-sm">
                {resourceName}
              </div>
            </div>
          )}
          
          {/* Motivo da rejeição */}
          {details && (
            <div>
              <h4 className="font-medium text-sm mb-2">Motivo da Rejeição:</h4>
              <div className="bg-gray-50 p-3 rounded-md border text-sm whitespace-pre-line">
                {details}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4 flex justify-between">
          <Button 
            onClick={onClose}
            variant="outline"
          >
            Fechar
          </Button>
          {resourceId && (
            <Button
              onClick={() => {
                onClose();
                if (resourceType === 'business') {
                  router.push(`/inspecionar-negocio/${resourceId}`);
                } else if (resourceType === 'initiative') {
                  router.push(`/linka/iniciativas/${resourceId}`);
                }
              }}
            >
              Visualizar {resourceType === 'business' ? 'Negócio' : 'Iniciativa'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 