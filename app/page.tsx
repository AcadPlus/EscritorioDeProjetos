import React from 'react'
import Image from 'next/image'
import Badge from './ui/badge-group'
import CardShowcase from './ui/card-showcase'

import { CardProps } from './lib/definitions'
import { RadioButton } from './ui/input'

import { HeroSection } from '@/components/hero-section'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const showcases: CardProps[] = [
  {
    id: 1,
    title: 'Vitrine de Startups',
    description:
      'Descubra startups inovadoras, parceiras da UFC, que estão moldando o futuro com soluções disruptivas e transformando ideias em realidade.',
    items: [
      'Acesso a ideias inovadoras e tecnologias emergentes',
      'Oportunidades de networking com empreendedores visionários',
      'Parcerias estratégicas para desenvolvimento e crescimento',
    ],
  },
  {
    id: 2,
    title: 'Vitrine de Competências',
    description:
      'Explore uma ampla gama de habilidades e talentos, desenvolvidos em parceria com a UFC, destacando competências essenciais para impulsionar carreiras e negócios.',
    items: [
      'Encontre professores com vasta experiência em TCC, teses e doutorados',
      'Conecte-se com pesquisadores que lideram projetos inovadores',
      'Aproveite o conhecimento de acadêmicos renomados da UFC',
    ],
  },
  {
    id: 3,
    title: 'Vitrine de Laboratórios',
    description:
      'Conheça laboratórios de ponta, parceiros da UFC, onde ciência e tecnologia se encontram para criar avanços revolucionários e promover a inovação.',
    items: [
      'Acesso a equipamentos e tecnologias de última geração',
      'Ambiente colaborativo para pesquisa e desenvolvimento',
      'Suporte técnico especializado de profissionais da UFC',
    ],
  },
]

export default function page() {
  // return <HeroSection />
  return (
    <main className="">
      <div className="w-full md:h-[80vh] md:flex">
        <Image
          src="/image-home.svg"
          alt="Imagem de pessoas conversando"
          width={40}
          height={40}
          priority
          className="w-full md:w-[40%] md:order-1 sm:h-2/4 md:h-auto object-cover"
        />
        <section className="bg-primary w-full h-[904px] md:w-[1112px] md:h-[904px] flex flex-col gap-3 md:justify-center">
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
                  <Select className="flex-1">
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
                  <Select className="flex-1">
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
        />
        <h2 className="text-xl md:text-2xl max-w-90 text-center text-secondary font-semibold">
          O que é o Escritório de Projetos e Parcerias?
        </h2>
        <div className="flex flex-row mt-5 w-full max-w-80 md:max-w-4xl justify-center md:gap-10 gap-7">
          <div className="self-start justify-center items-center flex flex-col">
            <Image
              src="/logo.svg"
              alt="Logo escritório de projetos"
              width={80}
              height={80}
            />
            <p className="text-xs max-w-40 text-center">
              Escritório de projetos da UFC
            </p>
          </div>
          <div className="">
            <p className="text-xs md:text-base md:text-justify leading-5 text-slate-700">
              O Escritório de Projetos e Parcerias da Universidade Federal do
              Ceará (UFC) é uma entidade dedicada a fornecer suporte e
              assistência em todas as etapas do processo de desenvolvimento de
              projetos de Pesquisa, Desenvolvimento e Inovação (PD&I). Sua
              missão é facilitar a formatação, negociação e implementação de
              parcerias institucionais, garantindo a conformidade com as
              diretrizes da UFC e promovendo a valorização das atividades
              institucionais.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full mt-2 p-1 flex flex-col justify-center">
        <Badge
          color="tertiary"
          title="Nossas Vitrines"
          content="Acesse por categorias!"
          className="text-blueText"
        />
        {/* melhorar */}
        <h2 className="text-xl sm:text-2xl md:text-2xl italic text-center font-semibold">
          Exposição de vitrines
        </h2>
        <div className="flex flex-row gap-5 overflow-y-hidden p-6 container mx-auto">
          {showcases.map((item) => (
            <CardShowcase
              description={item.description}
              title={item.title}
              items={item.items}
              key={item.id}
            />
          ))}
        </div>
      </section>
      <section className="w-full mt-2 p-1 flex flex-col justify-center items-center">
        <Badge
          content="Faça parte da comunidade!"
          title="Link@!"
          className="text-secondary"
        />
        <h2 className="text-xl sm:text-2xl md:text-2xl italic text-center font-semibold">
          Quero ser parceiro
        </h2>
        <p className="text-xs text-center max-w-96 italic leading-3 mt-2">
          Participe da comunidade de pesquisa, startups, projetos e parceiras da
          UFC através do preenchimento de um formulário de acordo com o seu
          cenário atual!
        </p>
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
        />
        <div className="flex items-center flex-col mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-center italic font-semibold mb-4">
            Fluxo de Uniformização
          </h2>
          <p className="text-xs text-center italic md:max-w-96">
            Descubra as etapas envolvidas por trás do processo de uniformização
            de setores implantando na Universidade Federal do Ceará
          </p>
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
