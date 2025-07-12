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
import { AlertCircle, Eye, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {/* Informações do recurso */}
          {resourceName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-sm text-gray-900">
                  {resourceType === 'business' ? 'Negócio' : 'Iniciativa'}:
                </h4>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-100 text-sm text-gray-800">
                {resourceName}
              </div>
            </motion.div>
          )}
          
          {/* Motivo da rejeição */}
          {details && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h4 className="font-medium text-sm text-gray-900">Motivo da Rejeição:</h4>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-800 whitespace-pre-line">
                {details}
              </div>
            </motion.div>
          )}
        </div>
        
        <DialogFooter className="mt-6 flex justify-between">
          <Button 
            onClick={onClose}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
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
                  router.push(`/iniciativas/${resourceId}`);
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar {resourceType === 'business' ? 'Negócio' : 'Iniciativa'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 