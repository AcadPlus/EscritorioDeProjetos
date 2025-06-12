import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface PaginationProps {
  currentPage: number
  totalPages: number
  goToNextPage: () => void
  goToPreviousPage: () => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage
}: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center mt-6 gap-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
      </motion.div>
      <span className="text-sm text-gray-500">
        Página {currentPage} de {totalPages}
      </span>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
} 