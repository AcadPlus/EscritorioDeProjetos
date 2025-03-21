'use client'
import React from 'react'
import Badge from './ui/badge-group'

import Hero from '@/components/hero'
import { Escritorio } from '@/components/escritorio'
import { Vitrines } from '@/components/vitrines'
import { InteractivePartnershipSection } from '@/components/interactive-partnership-section'
import { UniformizationProcess } from '@/components/uniformization-process'

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      <section
        className="w-full flex items-center flex-col my-8 px-4 md:px-6 lg:px-8"
        id="sobre-escritorio"
      >
        <Badge
          content="Entenda do que se trata o escritório!"
          title="O Escritório"
          className="text-secondary"
          posTexto="Sobre o Escritório"
        />
        <Escritorio />
      </section>

      <section
        className="w-full mt-8 p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center"
        id="vitrines"
      >
        <Badge
          color="tertiary"
          title="Nossas Vitrines"
          content="Acesse por categorias!"
          className="text-blueText"
          posTexto="Exposição de vitrines"
          classTexto="text-[#1A2C32]"
          textoFinal="Conheça as vitrines disponíveis na nossa plataforma LINK@, conecte-se e faça parte dessa rede!"
        />
        <Vitrines />
      </section>

      <section className="w-full mt-8 p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center">
        <Badge
          content="Faça parte da comunidade!"
          title="Link@!"
          className="text-secondary"
          posTexto="Quero ser parceiro"
          textoFinal="Participe da comunidade de pesquisa, startups, projetos e parceiras da
          UFC através de cadastro na plataforma, integre seus dados e conecte-se!"
        />
        <InteractivePartnershipSection />
      </section>

      <section id="comite" className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        <Badge
          color="tertiary"
          title="Processos Internos"
          content="Nossos processos internos"
          className="text-blueText"
          posTexto="Comitê de Uniformização"
          classTexto="text-[#1A2C32]"
          textoFinal="Descubra as etapas envolvidas por trás do processo de uniformização
            de setores implantando na Universidade Federal do Ceará"
        />
        <div className="flex items-center flex-col mb-10">
          <UniformizationProcess />
        </div>
      </section>
    </main>
  )
}
