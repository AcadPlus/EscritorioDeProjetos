"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BusinessSortProps {
  handleSortChange: (value: "recent" | "oldest" | "alphabetical") => void
}

export function BusinessSort({ handleSortChange }: BusinessSortProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 w-full sm:w-auto"
        >
          <ArrowUpDown className="" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-purple-100">
        <DropdownMenuItem
          className="hover:bg-purple-50 focus:bg-purple-50 text-gray-700"
          onSelect={() => handleSortChange("recent")}
        >
          Mais Recentes
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-purple-50 focus:bg-purple-50 text-gray-700"
          onSelect={() => handleSortChange("oldest")}
        >
          Mais Antigos
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-purple-50 focus:bg-purple-50 text-gray-700"
          onSelect={() => handleSortChange("alphabetical")}
        >
          Ordem Alfabética
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
