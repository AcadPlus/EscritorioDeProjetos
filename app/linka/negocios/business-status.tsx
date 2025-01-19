import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NegocioResponse } from '@/lib/types/businessTypes'

interface BusinessStatusProps {
  activeBusinesses: NegocioResponse[]
  pendingBusinesses: NegocioResponse[]
}

export function BusinessStatus({
  activeBusinesses,
}: BusinessStatusProps) {
  const businessPartec = activeBusinesses.filter(
    (item) => item.tipo_negocio === 'partec'
  )
  const businessExternal = activeBusinesses.filter(
    (item) => item.tipo_negocio !== 'partec'
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Status dos Negócios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
          <div>Ativos (Partec): {businessPartec.length}</div>
          <div>Ativos (Externos): {businessExternal.length}</div>
        </div>
      </CardContent>
    </Card>
  )
}

