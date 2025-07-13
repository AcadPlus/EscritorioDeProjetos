import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TipoIniciativa,
  PublicStatusIniciativa,
} from '@/lib/types/initiativeTypes'
import { Tag } from 'lucide-react'

interface FiltersProps {
  selectedType: TipoIniciativa | undefined
  setSelectedType: (type: TipoIniciativa | undefined) => void
  selectedStatus: PublicStatusIniciativa
  setSelectedStatus: (status: PublicStatusIniciativa) => void
}

const formatTipoIniciativa = (tipo: TipoIniciativa) => {
  const formatMap: Record<TipoIniciativa, string> = {
    [TipoIniciativa.PROJETO]: 'Projeto',
    [TipoIniciativa.EVENTO]: 'Evento',
    [TipoIniciativa.CAPACITACAO]: 'Capacitação',
    [TipoIniciativa.CONSULTORIA]: 'Consultoria',
    [TipoIniciativa.MENTORIA]: 'Mentoria',
    [TipoIniciativa.NETWORKING]: 'Networking',
    [TipoIniciativa.PESQUISA]: 'Pesquisa',
    [TipoIniciativa.OUTRO]: 'Outro'
  }
  return formatMap[tipo] || tipo
}

export const Filters = ({
  selectedType,
  setSelectedType,
}: FiltersProps) => (
  <div className="grid grid-cols-1 gap-6">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-purple-500/10 transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
          <Tag className="h-4 w-4 text-purple-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">
          Filtrar por Tipo
        </h3>
      </div>
      <Select
        value={selectedType || 'NONE'}
        onValueChange={(value) =>
          setSelectedType(
            value === 'NONE' ? undefined : (value as TipoIniciativa),
          )
        }
      >
        <SelectTrigger className="w-full bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl shadow-sm transition-all duration-200">
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent className="bg-white border-purple-200 rounded-xl shadow-lg">
          <SelectItem 
            className="hover:bg-purple-50 focus:bg-purple-50 rounded-lg" 
            value="NONE"
          >
            Todos os tipos
          </SelectItem>
          {Object.values(TipoIniciativa).map((type) => (
            <SelectItem 
              className="hover:bg-purple-50 focus:bg-purple-50 rounded-lg" 
              key={type} 
              value={type}
            >
              {formatTipoIniciativa(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
) 