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
    <motion.div 
      className="flex justify-center items-center mt-8 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
      </motion.div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">
          Página {currentPage} de {totalPages}
        </span>
      </div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
} 