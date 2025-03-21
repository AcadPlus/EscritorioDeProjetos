import React from 'react'
import { motion } from 'framer-motion'
import {
  Edit,
  Save,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Tag,
  Award,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  NegocioResponse,
  NegocioUpdate,
  AreaAtuacao,
  EstagioNegocio,
} from '@/lib/types/businessTypes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BusinessInfoProps {
  business: NegocioResponse
  isOwner: boolean
  isEditingFields: boolean
  editedBusiness: NegocioUpdate
  onEditToggle: () => void
  onSaveFields: () => void
  onFieldChange: (field: keyof NegocioUpdate, value: string) => void
}

interface InfoItemProps {
  icon: React.ElementType
  label: string
  value: string
  isEditing: boolean
  onChange: (value: string) => void
  options?: string[]
}

// Componente para exibir informações com ícones
const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  isEditing,
  onChange,
  options = [],
}) => {
  const Icon = icon

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 p-2 bg-primary/10 rounded-full">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        {isEditing ? (
          options.length > 0 ? (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1"
            />
          )
        ) : (
          <p className="text-sm text-gray-700">{value || 'Não informado'}</p>
        )}
      </div>
    </div>
  )
}

export const BusinessInfo: React.FC<BusinessInfoProps> = ({
  business,
  isOwner,
  isEditingFields,
  editedBusiness,
  onEditToggle,
  onSaveFields,
  onFieldChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho com informações básicas */}
      <Card className="p-6 shadow-md overflow-hidden relative">
        {/* Fundo decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12" />

        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <motion.h1
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {business.nome}
              </motion.h1>
              <motion.div
                className="flex items-center gap-2 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {business.area_atuacao}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-200"
                >
                  {business.estagio}
                </Badge>
              </motion.div>
            </div>

            {isOwner && !isEditingFields && (
              <motion.button
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onEditToggle}
              >
                <Edit className="h-5 w-5" />
              </motion.button>
            )}

            {isOwner && isEditingFields && (
              <div className="flex gap-2">
                <motion.button
                  className="p-2 text-green-500 hover:text-green-700 rounded-full hover:bg-green-50"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: 'rgba(0,128,0,0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSaveFields}
                >
                  <Save className="h-5 w-5" />
                </motion.button>
                <motion.button
                  className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: 'rgba(255,0,0,0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEditToggle}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Informações de contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            <InfoItem
              icon={Mail}
              label="Email"
              value={editedBusiness.email ?? business.email}
              isEditing={isEditingFields}
              onChange={(value) => onFieldChange('email', value)}
            />

            <InfoItem
              icon={Phone}
              label="Telefone"
              value={editedBusiness.telefone ?? business.telefone}
              isEditing={isEditingFields}
              onChange={(value) => onFieldChange('telefone', value)}
            />

            <InfoItem
              icon={Tag}
              label="Área de Atuação"
              value={editedBusiness.area_atuacao ?? business.area_atuacao}
              isEditing={isEditingFields}
              onChange={(value) => onFieldChange('area_atuacao', value)}
              options={Object.values(AreaAtuacao)}
            />

            <InfoItem
              icon={TrendingUp}
              label="Estágio"
              value={editedBusiness.estagio ?? business.estagio}
              isEditing={isEditingFields}
              onChange={(value) => onFieldChange('estagio', value)}
              options={Object.values(EstagioNegocio)}
            />
          </div>
        </div>
      </Card>

      {/* Detalhes do Negócio */}
      <Card className="overflow-hidden">
        <Tabs defaultValue="sobre" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-50 p-0 h-auto">
            <TabsTrigger
              value="sobre"
              className="py-3 data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Sobre
            </TabsTrigger>
            <TabsTrigger
              value="solucao"
              className="py-3 data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Solução
            </TabsTrigger>
            <TabsTrigger
              value="modelo"
              className="py-3 data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Modelo
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="sobre" className="mt-0">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Problema Identificado
              </h3>
              {isEditingFields ? (
                <Textarea
                  value={
                    editedBusiness.descricao_problema ??
                    business.descricao_problema
                  }
                  onChange={(e) =>
                    onFieldChange('descricao_problema', e.target.value)
                  }
                  className="mt-2"
                  placeholder="Descreva o problema que seu negócio resolve..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {business.descricao_problema ||
                    'Nenhuma descrição de problema fornecida.'}
                </p>
              )}
            </TabsContent>

            <TabsContent value="solucao" className="mt-0">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Solução Proposta
              </h3>
              {isEditingFields ? (
                <Textarea
                  value={
                    editedBusiness.solucao_proposta ?? business.solucao_proposta
                  }
                  onChange={(e) =>
                    onFieldChange('solucao_proposta', e.target.value)
                  }
                  className="mt-2"
                  placeholder="Descreva a solução que seu negócio oferece..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {business.solucao_proposta ||
                    'Nenhuma solução proposta fornecida.'}
                </p>
              )}
            </TabsContent>

            <TabsContent value="modelo" className="mt-0">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Modelo de Negócio
              </h3>
              {isEditingFields ? (
                <Textarea
                  value={
                    editedBusiness.modelo_negocio ??
                    business.modelo_negocio ??
                    ''
                  }
                  onChange={(e) =>
                    onFieldChange('modelo_negocio', e.target.value)
                  }
                  className="mt-2"
                  placeholder="Descreva o modelo de negócio..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {business.modelo_negocio ||
                    'Nenhum modelo de negócio fornecido.'}
                </p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
