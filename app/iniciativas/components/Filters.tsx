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

interface FiltersProps {
  selectedType: TipoIniciativa | undefined
  setSelectedType: (type: TipoIniciativa | undefined) => void
  selectedStatus: PublicStatusIniciativa
  setSelectedStatus: (status: PublicStatusIniciativa) => void
}

export const Filters = ({
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus
}: FiltersProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Filtrar por Tipo
      </h3>
      <Select
        value={selectedType || 'NONE'}
        onValueChange={(value) =>
          setSelectedType(
            value === 'NONE' ? undefined : (value as TipoIniciativa),
          )
        }
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent className=" bg-white">
          <SelectItem className="hover:bg-gray-200" value="NONE">
            Todos os tipos
          </SelectItem>
          {Object.values(TipoIniciativa).map((type) => (
            <SelectItem className="hover:bg-gray-200" key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Status das Iniciativas
      </h3>
      <Select
        value={selectedStatus}
        onValueChange={(value) =>
          setSelectedStatus(value as PublicStatusIniciativa)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className=" bg-white">
          {Object.values(PublicStatusIniciativa)
            .map((status) => (
              <SelectItem
                className="hover:bg-gray-200"
                key={status}
                value={status}
              >
                {status}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  </div>
) 