import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BusinessSortProps {
  handleSortChange: (value: 'recent' | 'oldest' | 'alphabetical') => void
}

export function BusinessSort({ handleSortChange }: BusinessSortProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Ordenar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem
          className="hover:bg-gray-200"
          onSelect={() => handleSortChange('recent')}
        >
          Mais Recentes
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-gray-200"
          onSelect={() => handleSortChange('oldest')}
        >
          Mais Antigos
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-gray-200"
          onSelect={() => handleSortChange('alphabetical')}
        >
          Ordem Alfabética
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
