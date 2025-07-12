"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface BusinessSearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export function BusinessSearch({ searchTerm, setSearchTerm }: BusinessSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        className="w-full h-10 pl-10 pr-4 py-2 text-sm bg-white border border-purple-200 focus:border-purple-300 rounded-md shadow-sm focus:ring-1 focus:ring-purple-300 focus:outline-none transition-all duration-300"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
