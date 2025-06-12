import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchAndSortProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  sortBy: 'recent' | 'oldest' | 'alphabetical'
  handleSortChange: (value: 'recent' | 'oldest' | 'alphabetical') => void
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void
  handleRetry: () => void
}

export const SearchAndSort = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  handleSortChange,
  handleSearch,
  handleRetry
}: SearchAndSortProps) => (
  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
    <div className="flex-1 w-full lg:max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Buscar iniciativas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-2 bg-white"
        />
      </form>
    </div>
    <div className="flex flex-wrap gap-4 items-center">
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="recent">Mais recentes</SelectItem>
          <SelectItem value="oldest">Mais antigos</SelectItem>
          <SelectItem value="alphabetical">Ordem alfabética</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={handleRetry}
        className="h-10 w-10 bg-white"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
    </div>
  </div>
) 