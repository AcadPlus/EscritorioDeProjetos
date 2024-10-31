'use client'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative bg-[#FFFDF7] min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <rect width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="40" x2="40" y2="0" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="text-sm leading-tight">
              <div>Escritório</div>
              <div>de Projetos</div>
              <div>da UFC</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/sobre" className="hover:text-primary">Sobre</Link>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-primary">
                Vitrines
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-primary">
                LINK@
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-primary">
                Fluxos
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <Link href="/contato" className="hover:text-primary">Contato</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 py-12">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4A6B19] leading-tight">
            Conecte-se com Empresas e Parceiros da Comunidade UFC
          </h1>
          <p className="text-lg text-[#4A6B19]">
            Promovemos a conexão entre você, iniciativas da UFC e empresas parceiras externas!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                type="text" 
                placeholder="Ex: I.A, Software, Saúde"
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Startups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startups">Startups</SelectItem>
                  <SelectItem value="laboratorios">Laboratórios</SelectItem>
                  <SelectItem value="competencias">Competências</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="relative h-[400px] lg:h-auto">
          <Image
            src="/placeholder.svg"
            alt="Pessoas colaborando em um ambiente de trabalho moderno"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  )
}