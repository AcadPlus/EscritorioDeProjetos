import { NegocioType } from '@/lib/types/businessTypes'

interface BusinessFilterProps {
  filter: NegocioType | 'all'
  setFilter: (filter: NegocioType | 'all') => void
}

export function BusinessFilter({ filter, setFilter }: BusinessFilterProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setFilter('all')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          filter === 'all'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Todos
      </button>
      <button
        onClick={() => setFilter(NegocioType.INCUBADO)}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          filter === NegocioType.INCUBADO
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Incubados
      </button>
      <button
        onClick={() => setFilter(NegocioType.PARCEIRO)}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          filter === NegocioType.PARCEIRO
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Parceiros
      </button>
    </div>
  )
}
