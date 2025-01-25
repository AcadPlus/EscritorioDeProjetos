'use client'
import React from 'react'
import Image from 'next/image'
import Badge from './ui/badge-group'
import Link from 'next/link'

import { Escritorio } from '@/components/escritorio'
import { Vitrines } from '@/components/vitrines'
import { InteractivePartnershipSection } from '@/components/interactive-partnership-section'
import { UniformizationProcess } from '@/components/uniformization-process'

export default function Page() {
  return (
    <main className="min-h-screen">
      <div className="w-full min-h-[80vh] mt-20 flex flex-col md:flex-row">
        <section className="bg-primary w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center order-2 md:order-1">
          <div className="flex flex-col space-y-6 animate-slideIn">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4E690B] leading-tight">
              Conecte-se com
              <br />
              Empresas e Parceiros da Comunidade UFC
            </h1>
            <p className="text-lg md:text-xl max-w-[690px] font-semibold text-[#618506] opacity-0 animate-fadeIn delay-200">
              Promovemos a conexão entre você, iniciativas da UFC e parceiros
              externos!
            </p>
            <div className="flex flex-col items-start text-secondary opacity-0 animate-fadeIn delay-400">
              <p className="font-regular text-base text-[#41580F] mb-4">
                Está procurando conexões com Pesquisadores, startups e
                similares?
              </p>
              <Link
                href={'linka/negocios'}
                className="inline-flex items-center text-sm h-10 bg-[#41580F] text-white rounded px-6 py-2 transform transition duration-200 ease-in-out hover:scale-105"
              >
                Ir para o LINK@
              </Link>
            </div>
          </div>
        </section>

        <div className="w-full md:w-1/2 h-[40vh] md:h-auto relative order-1 md:order-2">
          <Image
            src="/cei_3.jpg"
            alt="Imagem de pessoas conversando"
            fill
            priority
            className="object-cover transform transition duration-700 ease-in-out scale-100 hover:scale-105 opacity-0 animate-fadeIn"
          />
        </div>
      </div>

      <section
        className="w-full flex items-center flex-col my-8 px-4 md:px-6 lg:px-8"
        id="sobre-escritorio"
      >
        <Badge
          content="Entenda do que se trata o escritório!"
          title="O Escritório"
          className="text-secondary"
          posTexto="O que é o Escritório de Projetos e Parcerias?"
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
