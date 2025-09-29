"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft, Edit, Users, MapPin, Mail, Phone, Globe, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/context/AuthContext"
import { useLaboratorioApi } from "@/lib/api/laboratorio"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { LaboratorioResponse } from "@/lib/types/laboratorioTypes"

interface LaboratorioDetailPageProps {
  params: Promise<{ id: string }>
}

export default function LaboratorioDetailPage({ params }: LaboratorioDetailPageProps) {
  const { id } = React.use(params)
  const router = useRouter()
  const { useGetLaboratorio } = useLaboratorioApi()
  const auth = useAuth()
  const { toast } = useToast()

  // States
  const [activeTab, setActiveTab] = useState<"info" | "pesquisadores">("info")

  // API Hooks
  const { data: laboratorio, isLoading, error, refetch } = useGetLaboratorio(id)

  const isOwner = laboratorio?.uid_admin === auth.userId

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    } catch {
      return "Data inválida"
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ATIVO: {
        className: "bg-green-100 text-green-800",
        text: "Ativo",
      },
      INATIVO: {
        className: "bg-red-100 text-red-800",
        text: "Inativo",
      },
      MANUTENCAO: {
        className: "bg-yellow-100 text-yellow-800",
        text: "Manutenção",
      },
    }

    const config = statusConfig[status] || statusConfig.ATIVO
    return (
      <Badge variant="outline" className={config.className}>
        {config.text}
      </Badge>
    )
  }

  const getTipoBadge = (tipo: string) => {
    const tipoConfig = {
      PESQUISA: {
        className: "bg-blue-100 text-blue-800",
        text: "Pesquisa",
      },
      ENSINO: {
        className: "bg-purple-100 text-purple-800",
        text: "Ensino",
      },
      EXTENSAO: {
        className: "bg-green-100 text-green-800",
        text: "Extensão",
      },
      DESENVOLVIMENTO: {
        className: "bg-orange-100 text-orange-800",
        text: "Desenvolvimento",
      },
      MULTIDISCIPLINAR: {
        className: "bg-indigo-100 text-indigo-800",
        text: "Multidisciplinar",
      },
    }

    const config = tipoConfig[tipo] || { className: "bg-gray-100 text-gray-800", text: tipo }
    return (
      <Badge variant="outline" className={config.className}>
        {config.text}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-purple-600" />
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse" />
          </div>
          <motion.div
            className="text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <p className="text-gray-800 text-lg font-medium">Carregando laboratório...</p>
            <p className="text-gray-500 text-sm mt-1">Preparando informações</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (error || !laboratorio) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-gray-600 mb-4">Laboratório não encontrado</p>
        <Button variant="outline" onClick={() => router.back()} className="border-purple-200 text-purple-600 hover:bg-purple-50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{laboratorio.nome}</h1>
                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/20"
                    onClick={() => {
                      // TODO: Implementar edição
                      toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "A edição de laboratórios estará disponível em breve.",
                      })
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {getTipoBadge(laboratorio.tipo)}
                {getStatusBadge(laboratorio.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{laboratorio.unidade}</p>
                      {laboratorio.subunidade && (
                        <p className="text-sm opacity-90">{laboratorio.subunidade}</p>
                      )}
                      {laboratorio.campus && (
                        <p className="text-sm opacity-90">Campus: {laboratorio.campus}</p>
                      )}
                      {laboratorio.sala && (
                        <p className="text-sm opacity-90">Sala: {laboratorio.sala}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{laboratorio.responsavel}</p>
                      <p className="text-sm opacity-90">Responsável</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <p>{laboratorio.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <p>{laboratorio.telefone}</p>
                  </div>

                  {laboratorio.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      <a
                        href={laboratorio.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm md:hidden border-b border-purple-100">
        <div className="flex justify-between">
          {[
            { key: "info", label: "Informações" },
            { key: "pesquisadores", label: "Pesquisadores" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 py-4 text-center font-medium text-sm transition-all ${
                activeTab === key
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50"
                  : "text-gray-500 hover:text-purple-600 hover:bg-purple-50/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* Informações */}
              {(activeTab === "info" || window.innerWidth >= 1024) && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Sobre o Laboratório</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {laboratorio.descricao && (
                        <div>
                          <h3 className="font-semibold mb-2">Descrição</h3>
                          <p className="text-gray-700">{laboratorio.descricao}</p>
                        </div>
                      )}

                      {laboratorio.areas_pesquisa && laboratorio.areas_pesquisa.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Áreas de Pesquisa</h3>
                          <div className="flex flex-wrap gap-2">
                            {laboratorio.areas_pesquisa.map((area, index) => (
                              <Badge key={index} variant="secondary">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {laboratorio.equipamentos && laboratorio.equipamentos.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Equipamentos</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {laboratorio.equipamentos.map((equipamento, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                                <span className="text-sm">{equipamento}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {laboratorio.endereco && (
                        <div>
                          <h3 className="font-semibold mb-2">Endereço</h3>
                          <p className="text-gray-700">{laboratorio.endereco}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Criado em {formatDate(laboratorio.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Atualizado em {formatDate(laboratorio.updated_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Pesquisadores */}
              {(activeTab === "pesquisadores" || window.innerWidth >= 1024) && (
                <motion.div
                  key="pesquisadores"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Equipe de Pesquisa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {laboratorio.pesquisadores && laboratorio.pesquisadores.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-gray-600">
                            {laboratorio.pesquisadores.length} pesquisador{laboratorio.pesquisadores.length !== 1 ? 'es' : ''} associado{laboratorio.pesquisadores.length !== 1 ? 's' : ''}
                          </p>
                          {/* TODO: Implementar lista detalhada de pesquisadores */}
                          <div className="text-center py-8 text-gray-500">
                            Lista detalhada de pesquisadores em desenvolvimento
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Nenhum pesquisador associado ainda
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pesquisadores</span>
                  <span className="font-semibold">{laboratorio.pesquisadores?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Equipamentos</span>
                  <span className="font-semibold">{laboratorio.equipamentos?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Áreas de Pesquisa</span>
                  <span className="font-semibold">{laboratorio.areas_pesquisa?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {laboratorio.redes_sociais && Object.keys(laboratorio.redes_sociais).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(laboratorio.redes_sociais).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="capitalize">{platform}</span>
                      </a>
                    )
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
