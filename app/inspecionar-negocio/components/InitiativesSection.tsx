"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ArrowRight, Plus, Rocket, Target, Calendar } from "lucide-react"

interface InitiativesSectionProps {
  business: any
  isOwner: boolean
  isAuthenticated: boolean
}

// Mock initiatives data
const mockInitiatives = [
  {
    id: "init-1",
    nome: "Sistema de Monitoramento IoT",
    descricao: "Desenvolvimento do sistema principal de monitoramento de energia",
    status: "Em Andamento",
    progresso: 75,
    data_inicio: "2024-01-15",
    data_fim: "2024-06-30",
  },
  {
    id: "init-2",
    nome: "App Mobile",
    descricao: "Aplicativo móvel para visualização de dados em tempo real",
    status: "Planejamento",
    progresso: 25,
    data_inicio: "2024-03-01",
    data_fim: "2024-08-15",
  },
  {
    id: "init-3",
    nome: "Plataforma Web",
    descricao: "Dashboard web para análise avançada de consumo energético",
    status: "Concluído",
    progresso: 100,
    data_inicio: "2023-10-01",
    data_fim: "2024-02-28",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído":
      return "bg-green-100 text-green-700 border-green-200"
    case "Em Andamento":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "Planejamento":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "Pausado":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Concluído":
      return <Target className="h-3 w-3" />
    case "Em Andamento":
      return <Rocket className="h-3 w-3" />
    case "Planejamento":
      return <Calendar className="h-3 w-3" />
    default:
      return <Lightbulb className="h-3 w-3" />
  }
}

export const InitiativesSection: React.FC<InitiativesSectionProps> = ({ business, isOwner }) => {
  const hasInitiatives = business.id_iniciativas?.length > 0

  const navigateToInitiative = (iniciativaId: string) => {
    console.log("Navigate to initiative:", iniciativaId)
  }

  const navigateToCreateInitiative = () => {
    console.log("Navigate to create initiative")
  }

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white border border-purple-100">
      <div className="p-6 pb-4 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Iniciativas</h2>
              <p className="text-sm text-gray-600">
                {hasInitiatives ? `${business.id_iniciativas?.length} projetos ativos` : "Nenhum projeto ainda"}
              </p>
            </div>
          </div>
          {isOwner && (
            <Button
              onClick={navigateToCreateInitiative}
              size="sm"
              className="gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova</span>
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-purple-50">
        {hasInitiatives ? (
          mockInitiatives.map((iniciativa, index) => (
            <motion.div
              key={iniciativa.id}
              className="p-4 hover:bg-purple-50/30 transition-colors cursor-pointer group"
              onClick={() => navigateToInitiative(iniciativa.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="mt-1 p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Lightbulb className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {iniciativa.nome}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{iniciativa.descricao}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(iniciativa.status)} flex items-center gap-1`}
                      >
                        {getStatusIcon(iniciativa.status)}
                        {iniciativa.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 transition-all duration-300"
                            style={{ width: `${iniciativa.progresso}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{iniciativa.progresso}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma iniciativa encontrada</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Iniciativas são projetos específicos dentro do seu negócio.
              {isOwner && " Crie uma iniciativa para organizar atividades e recursos."}
            </p>
            {isOwner && (
              <Button
                onClick={navigateToCreateInitiative}
                className="gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-purple-500/25 hover:shadow-lg"
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
