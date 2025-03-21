'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  CheckCircle,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import Link from 'next/link'

const options = [
  {
    id: 'student',
    title: 'Sou da UFC',
    description: 'Quero cadastrar meus projetos e competências',
    icon: GraduationCap,
    color: 'bg-blue-600',
    suboptions: [
      'Laboratórios',
      'Projetos de Extensão',
      'Startups e muito mais!',
    ],
  },
  {
    id: 'external',
    title: 'Sou externo à UFC',
    description: 'Quero estabelecer parcerias e conexões',
    icon: Briefcase,
    color: 'bg-green-600',
    suboptions: [
      'Parcerias Empresariais',
      'Projetos de Inovação',
      'Público-geral',
    ],
  },
]

export function InteractivePartnershipSection() {
  const [selected, setSelected] = useState<string | null>(null)

  const handleCardClick = (id: string) => {
    setSelected((prev) => (prev === id ? null : id))
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {options.map((option) => (
        <motion.div
          key={option.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`p-6 cursor-pointer transition-colors ${
              selected === option.id ? option.color : 'hover:bg-gray-50'
            }`}
            onClick={() => handleCardClick(option.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-xl font-semibold flex items-center gap-2 ${
                  selected === option.id ? 'text-white' : 'text-gray-800'
                }`}
              >
                <option.icon className="h-6 w-6" />
                <span>{option.title}</span>
              </h3>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  selected === option.id
                    ? 'rotate-180 text-white'
                    : 'text-gray-500'
                }`}
              />
            </div>
            <p
              className={`${selected === option.id ? 'text-white' : 'text-gray-600'}`}
            >
              {option.description}
            </p>
          </div>
          <AnimatePresence>
            {selected === option.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 bg-gray-50">
                  <ul className="space-y-2 mb-4">
                    {option.suboptions.map((subopt, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        {subopt}
                      </li>
                    ))}
                  </ul>
                  <Link href="linka/negocios" className="block">
                    <button
                      className={`w-full py-2 px-4 rounded ${option.color} text-white font-medium hover:opacity-90 transition-opacity`}
                    >
                      Saiba mais
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
