"use client"

import { motion } from "framer-motion"
import { NegocioType } from "@/lib/types/businessTypes"

interface BusinessFilterProps {
  filter: NegocioType | "all"
  setFilter: (filter: NegocioType | "all") => void
}

export function BusinessFilter({ filter, setFilter }: BusinessFilterProps) {
  const filters = [
    { key: "all", label: "Todos" },
    { key: NegocioType.INCUBADO, label: "Incubados" },
    { key: NegocioType.PARCEIRO, label: "Parceiros" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filterOption) => (
        <motion.button
          key={filterOption.key}
          onClick={() => setFilter(filterOption.key as NegocioType | "all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            filter === filterOption.key
              ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25"
              : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {filterOption.label}
        </motion.button>
      ))}
    </div>
  )
}
