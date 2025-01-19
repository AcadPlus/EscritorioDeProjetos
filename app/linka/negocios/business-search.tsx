import { Input } from '@/components/ui/input'

interface BusinessSearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void
}

export function BusinessSearch({
  searchTerm,
  setSearchTerm,
  handleSearch,
}: BusinessSearchProps) {
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 w-full"
    >
      <Input
        className="w-full bg-white"
        placeholder="Digite aqui!"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  )
}

