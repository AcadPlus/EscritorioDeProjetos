import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
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

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmVariant = 'default',
}: ConfirmationModalProps) => {
  const getIcon = () => {
    switch (confirmVariant) {
      case 'destructive':
        return <XCircle className="h-6 w-6 text-red-500" />
      case 'default':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    }
  }

  const getConfirmButtonClass = () => {
    switch (confirmVariant) {
      case 'destructive':
        return 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300 text-white'
      case 'default':
        return 'bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300 text-white'
      default:
        return 'border-purple-200 text-purple-600 hover:bg-purple-50'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            {getIcon()}
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </motion.div>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button 
            variant={confirmVariant === 'outline' ? 'outline' : 'default'}
            onClick={onConfirm}
            className={getConfirmButtonClass()}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 