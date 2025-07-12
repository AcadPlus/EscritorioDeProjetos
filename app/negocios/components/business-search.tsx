"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface BusinessSearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void
}

export function BusinessSearch({ searchTerm, setSearchTerm, handleSearch }: BusinessSearchProps) {
  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
        <Input
          className="text-purple-800 w-full h-full pl-12 pr-4 py-4 text-lg bg-white border-2 border-purple-100 focus:border-purple-400 rounded-2xl shadow-lg focus:shadow-purple-500/10 transition-all duration-300"
          placeholder="Busque por nome, área de atuação ou palavras-chave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </form>
  )
}
