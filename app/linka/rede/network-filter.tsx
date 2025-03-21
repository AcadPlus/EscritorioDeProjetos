import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCampusOptions from '@/hooks/useCampusOptions'

interface NetworkFilterProps {
  roleFilter: string
  setRoleFilter: (value: string) => void
  institutionFilter: string
  setInstitutionFilter: (value: string) => void
}

export function NetworkFilter({
  roleFilter,
  setRoleFilter,
  institutionFilter,
  setInstitutionFilter,
}: NetworkFilterProps) {
  const campusOptions = useCampusOptions()

  return (
    <div className="flex gap-4">
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Função" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem className="hover:bg-gray-200" value="all">
            Todos
          </SelectItem>
          <SelectItem className="hover:bg-gray-200" value="estudante">
            Estudante
          </SelectItem>
          <SelectItem className="hover:bg-gray-200" value="pesquisador">
            Pesquisador
          </SelectItem>
          <SelectItem className="hover:bg-gray-200" value="externo">
            Externo
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Instituição" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem className="bg-gray-200" value="all">
            Todos
          </SelectItem>
          {campusOptions.map((campusName, index) => (
            <SelectItem className="bg-gray-200" key={index} value={campusName}>
              {campusName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
