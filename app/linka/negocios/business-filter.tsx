import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { NegocioType } from '@/lib/types/businessTypes'

interface BusinessFilterProps {
  filter: NegocioType | 'all'
  setFilter: (value: NegocioType | 'all') => void
}

export function BusinessFilter({ filter, setFilter }: BusinessFilterProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Filtrar por tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={filter}
          onValueChange={(value) => setFilter(value as NegocioType | 'all')}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">
              Todos
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={NegocioType.INCUBADO} id="partec" />
            <Label htmlFor="partec" className="cursor-pointer">
              Incubados
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={NegocioType.EXTERNO} id="externo" />
            <Label htmlFor="externo" className="cursor-pointer">
              Externos
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

