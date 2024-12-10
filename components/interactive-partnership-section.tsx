'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  ChevronDown,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import Link from 'next/link'

const options = [
  {
    id: 'student',
    title: 'Faço parte da UFC',
    description: 'Quero cadastrar meus projetos e competências',
    icon: GraduationCap,
    color: 'bg-[#618506]',
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
    color: 'bg-[#618506]',
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
    console.log(selected)
    setSelected((prev) => (prev === id ? null : id))
  }

  return (
    <section className="lg:w-full md:w-full py-4 md:py-8 lg:py-12 bg-background">
      <div className="grid md:grid-cols-2 md:gap-12 gap-6 max-w-4xl mx-auto">
        {options.map((option) => (
          <Card key={option.id} className="relative overflow-hidden">
            <CardHeader
              className={`cursor-pointer transition-colors ${selected === option.id ? option.color : 'hover:bg-muted'}`}
              onClick={() => handleCardClick(option.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <option.icon
                    className={`h-6 w-6 ${selected === option.id ? 'text-white' : 'text-[#618506]'}`}
                  />
                  <span
                    className={
                      selected === option.id ? 'text-white' : 'text-[#618506]'
                    }
                  >
                    {option.title}
                  </span>
                </CardTitle>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${selected === option.id ? 'rotate-180 text-white' : ''}`}
                />
              </div>
              <CardDescription
                className={
                  selected === option.id ? 'text-white/90' : 'text-[#475467]'
                }
              >
                {option.description}
              </CardDescription>
            </CardHeader>
            <AnimatePresence>
              {option.id === selected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {option.suboptions.map((subopt, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-black" />
                          {subopt}
                        </li>
                      ))}
                    </ul>
                    <Link href="linka/login">
                      <Button className="w-full mt-4 bg-[#618506] hover:bg-[#82AF01] text-white">
                        Saiba mais
                      </Button>
                    </Link>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </section>
  )
}
