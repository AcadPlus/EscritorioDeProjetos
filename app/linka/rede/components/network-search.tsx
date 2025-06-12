import { Input } from '@/components/ui/input'

interface NetworkSearchProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
}

export function NetworkSearch({
  searchQuery,
  setSearchQuery,
}: NetworkSearchProps) {
  return (
    <div className="flex-1 min-w-[200px]">
      <Input
        type="search"
        placeholder="Buscar usuários..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-white"
      />
    </div>
  )
}
