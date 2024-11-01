import React from 'react'
import Image from 'next/image'
import Badge from './ui/badge-group'
import { RadioButton } from './ui/input'

import { Escritorio } from '@/components/escritorio'
import { Vitrines } from '@/components/vitrines'

// import { HeroSection } from '@/components/hero-section'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function page() {
  return (
    <main className="">
      <div className="w-full md:h-[80vh] md:flex">
        <Image
          src="/cei_3.jpg"
          alt="Imagem de pessoas conversando"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="w-full md:w-[45%] md:order-1 sm:h-2/4 md:h-auto"
        />

        <section className="bg-primary w-100 h-[600px] md:w-[1112px] md:h-auto flex flex-col gap-3 md:justify-center">
          {/* Conteúdo da seção */}
          <div className="flex flex-col p-5 space-y-3 sm:space-y-4 xl:pl-28">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4E690B] leading-tight">
              Conecte-se com
              <br />
              Empresas e Parceiros da Comunidade UFC
            </h1>
            <p className="text-lg md:text-lg lg:text-xl  max-w-[690px] bold text-[#618506]">
              Promovemos a conexão entre você, iniciativas da UFC e empresas
              parceiras externas!
            </p>
            <div className="flex flex-col items-center text-secondary">
              <form className="flex flex-col gap-2 items-start w-full">
                <p className="font-regular text-base text-[#41580F]">
                  Estou buscando um(a)
                </p>

                {/* Container para Seleções */}
                <div className="flex flex-col md:flex-row gap-2 w-full md:items-center sm:items-left">
                  {/* Componente de Seleção 1 */}
                  <Select>
                    <SelectTrigger className="w-full md:w-1/3 text-[#41580F]">
                      <SelectValue placeholder="Software" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-[#41580F]" value="software">
                        Solução em Software
                      </SelectItem>
                      <SelectItem className="text-[#41580F]" value="hardware">
                        Solução em Hardware
                      </SelectItem>
                      <SelectItem
                        className="text-[#0e100b]"
                        value="extension_projeto"
                      >
                        Projeto de Extensão
                      </SelectItem>
                      <SelectItem
                        className="text-[#41580F]"
                        value="entrepreneur_project"
                      >
                        Projeto Empreendedor
                      </SelectItem>
                      <SelectItem className="text-[#41580F]" value="docente">
                        Pesquisador(a)
                      </SelectItem>
                      <SelectItem
                        className="text-[#41580F]"
                        value="research_group"
                      >
                        Grupo de Pesquisa
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="font-regular text-sm text-[#41580F]">em...</p>

                  {/* Componente de Seleção 2 */}
                  <Select>
                    <SelectTrigger className="w-full md:w-1/3 text-[#41580F]">
                      <SelectValue placeholder="Startups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startups">Startups</SelectItem>
                      <SelectItem value="laboratorios">Laboratórios</SelectItem>
                      <SelectItem value="competencias">
                        Competências (pesquisa, tcc e etc.)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button className="flex items-center text-sm w-full md:w-24 h-8 md:h-9 bg-[#41580F] text-white rounded px-3 py-1 mt-2">
                  <FontAwesomeIcon icon={faSearch} className="mr-1" />
                  <p>Buscar</p>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full flex items-center flex-col my-2 px-3">
        <Badge
          content="Entenda do que se trata o escritório!"
          title="O Escritório"
          className="text-secondary"
          posTexto="O que é o Escritório de Projetos e Parcerias?"
        />

        <Escritorio />
      </section>
      <section className="w-full mt-2 p-1 flex flex-col justify-center items-center">
        <Badge
          color="tertiary"
          title="Nossas Vitrines"
          content="Acesse por categorias!"
          className="text-blueText"
          posTexto="Exposição de vitrines"
          classTexto="text-[#1A2C32]"
        />
        <Vitrines />
      </section>

      <section className="w-full mt-2 p-1 flex flex-col justify-center items-center">
        <Badge
          content="Faça parte da comunidade!"
          title="Link@!"
          className="text-secondary"
          posTexto="Quero ser parceiro"
          textoFinal="Participe da comunidade de pesquisa, startups, projetos e parceiras da
          UFC através do preenchimento de um formulário de acordo com o seu
          cenário atual!"
        />

        <form action="">
          {/* <label htmlFor=""></label>
          <input type="radio" name="" id="" />
          <label htmlFor=""></label>
          <input type="radio" name="" id="" /> */}
          <div className="flex flex-col space-y-6 mt-5 md:flex-row md:space-x-14 md:space-y-0">
            <RadioButton
              tittle="Quero ser parceiro da UFC"
              content="Não sou da universidade federal do ceará, mas queria conexão"
            />
            <RadioButton
              tittle="Quero ser parceiro da UFC"
              content="Não sou da universidade federal do ceará, mas queria conexão"
            />
          </div>
        </form>
      </section>

      <section className="p-3 flex flex-col gap-3">
        <Badge
          color="tertiary"
          title="Processos Internos"
          content="Nossos processos internos"
          className="text-blueText"
          posTexto="Fluxo de Uniformização"
          classTexto="text-[#1A2C32]"
          textoFinal="Descubra as etapas envolvidas por trás do processo de uniformização
de setores implantando na Universidade Federal do Ceará"
        />
        <div className="flex items-center flex-col mb-10">
          <div className="flex flex-col mt-6">
            <div className="mt-3 flex flex-col gap-3 px-6">
              <p className="text-sm">
                A Universidade reconhece a importância de uma comunicação clara
                e eficiente entre seus setores. Para isso, estamos empenhados em
                uniformizar os fluxos e processos relacionados à definição de
                temas, começando pelo processo de extensão.
              </p>
              <p className="text-sm">
                Este guia detalhado descreve os passos que serão seguidos para
                alcançar a uniformização desejada.
              </p>
              <p className="text-sm">
                Acreditamos que a uniformização dos fluxos e processos de
                definição de temas trará diversos benefícios para a
                Universidade, como:
              </p>
              <ul className="list-disc ml-6">
                <li>
                  <p className="text-sm">
                    Maior clareza e eficiência na comunicação entre os setores.
                  </p>
                </li>
                <li>
                  <p className="text-sm">Redução de tempo e burocracia.</p>
                </li>
                <li>
                  <p className="text-sm">
                    Melhor aproveitamento dos recursos humanos e materiais.
                  </p>
                </li>
                <li>
                  <p className="text-sm">
                    Maior qualidade dos projetos de extensão.
                  </p>
                </li>
                <li>
                  <p className="text-sm">
                    Maior clareza e eficiência na comunicação entre os setores.
                  </p>
                </li>
              </ul>
              <p className="text-sm">
                Agradecemos a participação de todos os setores neste processo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
