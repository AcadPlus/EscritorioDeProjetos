import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NegocioResponse } from '@/lib/types/businessTypes'
import { Lightbulb, ArrowRight, Plus } from 'lucide-react'

interface InitiativesSectionProps {
  business: NegocioResponse
  isOwner: boolean
  isAuthenticated: boolean
}

export const InitiativesSection: React.FC<InitiativesSectionProps> = ({
  business,
  isOwner,
  // isAuthenticated não é usado diretamente, mas é necessário para a interface
}) => {
  const router = useRouter()
  const hasInitiatives = business.id_iniciativas?.length > 0

  // Função para navegar para a página de detalhes da iniciativa
  const navigateToInitiative = (iniciativaId: string) => {
    router.push(`/iniciativas/${iniciativaId}`)
  }

  // Função para navegar para a página de criação de iniciativa
  const navigateToCreateInitiative = () => {
    router.push(`/minhas-iniciativas?negocioId=${business.id}`)
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 pb-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Iniciativas</h2>
          {hasInitiatives && (
            <Badge variant="outline" className="bg-gray-100">
              {business.id_iniciativas?.length}
            </Badge>
          )}
        </div>
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={navigateToCreateInitiative}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova</span>
          </Button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {hasInitiatives ? (
          business.id_iniciativas?.map((iniciativaId, index) => (
            <motion.div
              key={iniciativaId}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigateToInitiative(iniciativaId)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                backgroundColor: 'rgba(0,0,0,0.02)',
                x: 2,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-0.5 p-2 bg-primary/10 rounded-full">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Iniciativa {iniciativaId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Clique para ver os detalhes desta iniciativa
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma iniciativa encontrada
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Iniciativas são projetos específicos dentro do seu negócio.
              {isOwner && ' Crie uma iniciativa para organizar atividades e recursos.'}
            </p>
            {isOwner && (
              <Button
                onClick={navigateToCreateInitiative}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar primeira iniciativa
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
} 