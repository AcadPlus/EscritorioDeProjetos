import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Camera, Share2 } from 'lucide-react'
import { NegocioResponse } from '@/lib/types/businessTypes'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface BusinessHeaderProps {
  business: NegocioResponse
  isOwner: boolean
  onProfilePhotoClick: () => void
  onCoverPhotoClick: () => void
}

export const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  business,
  isOwner,
  onProfilePhotoClick,
  onCoverPhotoClick,
}) => {
  const [showActions, setShowActions] = React.useState(false)

  // Função para compartilhar (implementação básica)
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: business.nome,
          text: `Confira o negócio ${business.nome}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error('Erro ao compartilhar:', err)
        })
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <div className="relative">
      {/* Foto de Capa */}
      <div
        className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full overflow-hidden"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {business.foto_capa ? (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Image
              src={business.foto_capa}
              alt="Capa do negócio"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-700 to-gray-900 text-white">
            <span className="text-lg font-medium">
              {business.nome || 'Negócio'}
            </span>
          </div>
        )}

        {/* Botão de compartilhar */}
        <motion.div
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: showActions || window.innerWidth < 768 ? 1 : 0.5,
            y: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white/90 hover:bg-white shadow-md"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5 text-gray-700" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compartilhar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Botão de edição da capa (apenas para proprietários) */}
        {isOwner && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity z-10"
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              className="p-3 bg-white rounded-full shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCoverPhotoClick}
            >
              <Camera className="h-6 w-6 text-gray-800" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Container para a foto de perfil */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Foto de Perfil */}
        <div className="absolute md:relative top-[-60px] sm:top-[-70px] md:top-[-60px] left-4 md:left-0 z-20">
          <motion.div
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-xl group"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {business.foto_perfil ? (
                <Image
                  src={business.foto_perfil}
                  alt="Logo do negócio"
                  fill
                  sizes="(max-width: 128px) 100vw, 128px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="text-gray-500 font-medium text-xl">
                  {business.nome?.charAt(0) || 'N'}
                </div>
              )}
            </div>
            {isOwner && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                whileHover={{ opacity: 1 }}
              >
                <motion.button
                  className="p-2 bg-white rounded-full shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onProfilePhotoClick}
                >
                  <Camera className="h-4 w-4 text-gray-800" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
