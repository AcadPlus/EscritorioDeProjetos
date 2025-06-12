/* eslint-disable @typescript-eslint/no-unused-vars */
import { NegocioResponse, NegocioType } from '@/lib/types/businessTypes'

interface BusinessStatusProps {
  activeBusinesses: NegocioResponse[]
  pendingBusinesses: NegocioResponse[]
}

export function BusinessStatus({
  activeBusinesses,
  pendingBusinesses,
}: BusinessStatusProps) {
  const incubadosCount = activeBusinesses.filter(
    (b) => b.tipo_negocio === NegocioType.INCUBADO,
  ).length
  const parceirosCount = activeBusinesses.filter(
    (b) => b.tipo_negocio === NegocioType.PARCEIRO,
  ).length

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">Incubados:</div>
        <div className="font-medium text-gray-900">{incubadosCount}</div>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">Parceiros:</div>
        <div className="font-medium text-gray-900">{parceirosCount}</div>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">Total:</div>
        <div className="font-medium text-gray-900">{activeBusinesses.length}</div>
      </div>
    </div>
  )
}
