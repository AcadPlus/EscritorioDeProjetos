'use client'
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { LinkIcon } from '@heroicons/react/outline'

interface LinkCardProps {
  title: string
  subtitle: string
  url: string
  isLast?: boolean // isLast é opcional
}

const links1 = [
  {
    title: 'Fluxo de PD&I',
    subtitle: 'Mapeamento do processo, com descrição das etapas e fluxograma.',
    url: 'https://drive.google.com/file/d/1hwIAld38E8HAbYoLr70XQAFBqXBHOEXV/view?usp=sharing',
  },
  {
    title: 'Acordo de Parceria PD&I - Com Repasse de Recursos',
    subtitle:
      'Esta minuta deve ser utilizada para acordos de parceria para pd&i quando houver repasse de recursos privados para o projeto de pesquisa. Este repasse tanto pode ser feito diretamente à ICT ou Agência de Fomento, com ou sem por intermédio de Fundação de Apoio Lei no 8.958/94',
    url: 'https://drive.google.com/file/d/1NxAt4kfqUmQze-b0LFQgve4f2HbTczrE/view',
  },
  {
    title: 'Acordo de Parceria PD&I - Não Repasse de Recursos',
    subtitle:
      'Esta minuta deve ser utilizada para acordos de parceria para pd&i quando não houver repasse de recursos entre os parceiros. Este tipo de Acordo é apropriado para ser utilizado na construção de ambientes inovadores como parques tecnológicos, co-working, entre outras possibilidades, servindo como instrumento que estabelece as regras de interação entre os parceiros. Pode tanto ser usado em relações bilaterais como multilaterais.',
    url: 'https://drive.google.com/file/d/1HTZnKxYUYJrG6-BF7oI1zOYvzMCxunIZ/view',
  },
  {
    title: 'Checklist AGU Documentos Acordo de Parceria',
    subtitle:
      'Acordo de Parceria é o instrumento jurídico envolvendo instituições públicas e privadas para realização de atividades conjuntas de pesquisa científica e tecnológica e de desenvolvimento de tecnologia, produto, serviço ou processo para inovação (Artigo 9o da Lei no 10.973/04). Também pode ser utilizado quando houver transferência de recursos financeiros do parceiro privado para o público, facultada a intermediação por Fundação de Apoio §§ 6o e 7o do Artigo 35 do Decreto no 9.283/18.',
    url: 'https://drive.google.com/file/d/1nRQk71jaBgHq_NCwOH7H_hcPgFX5inRF/view',
  },
]

const links2 = [
  {
    title: 'Novo Fluxo de PD&I',
    subtitle: 'Descrição do novo processo e suas etapas.',
    url: '#',
  },
  {
    title: 'Novo Acordo de Parceria - Com Repasse',
    subtitle: 'Detalhes sobre acordos de parceria com repasse.',
    url: '#',
  },
  {
    title: 'Novo Acordo de Parceria - Sem Repasse',
    subtitle: 'Informações sobre acordos de parceria sem repasse.',
    url: '#',
  },
  {
    title: 'Novo Checklist AGU',
    subtitle: 'Checklist atualizado para acordos de parceria.',
    url: '#',
  },
]

const links3 = [
  {
    title: 'Fluxo de STE em PD&I',
    subtitle: 'Mapeamento do processo, com descrição das etapas e fluxograma.',
    url: 'https://drive.google.com/file/d/1S3SMpnV4bzESz2qBJLBC4Mvxv-At7tx0/view?usp=share_link',
  },
  {
    title: 'Modelo de Contrato de STE em PD&I - Com Fundação de Apoio',
    subtitle:
      'Este modelo deve ser utilizado para serviços técnicos especializados em PD&I quando houver intermediação de Fundação de Apoio.',
    url: 'https://docs.google.com/document/d/1dvR5VTucJzmcF5Qhxo2HbGtUSlLf44V2/edit?usp=share_link&ouid=117215402178974826776&rtpof=true&sd=true',
  },
  {
    title: 'Parecer da AGU sobre os STE em PD&I',
    subtitle:
      'PARECER n. 00001/2022 AGU - Trata sobre CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS ESPECIALIZADOS NAS ATIVIDADES VOLTADAS À INOVAÇÃO E À PESQUISA CIENTÍFICA E TECNOLÓGICA',
    url: 'https://drive.google.com/file/d/1Ip5WPw2LtJLFjN8UJY1PiGs_MMKsLErr/view?usp=share_link',
  },
]

const LinkCard: React.FC<LinkCardProps> = ({
  title,
  subtitle,
  url,
  isLast,
}) => (
  <div className={`relative ${!isLast ? 'pb-10' : ''}`}>
    <Card
      className="cursor-pointer hover:bg-gray-100 hover:shadow-lg transition-shadow duration-300"
      onClick={() => window.open(url, '_blank')}
    >
      <CardHeader className="flex items-center">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-2">{subtitle}</CardDescription>
        </div>
        <LinkIcon className="h-5 w-5 mr-2 text-gray-500" />
      </CardHeader>
    </Card>
    {!isLast && (
      <div className="absolute left-1/2 w-px h-10 bg-gray-400 transform -translate-x-1/2" />
    )}
  </div>
)

const LinksPage = () => (
  <div className="container mx-auto p-4 mt-32">
    <h1 className="text-2xl font-semibold mb-20">
      Documentos de Acordos de Parceria e Serviços Técnicos Especializados
    </h1>

    {/* Container para as colunas */}
    <div className="flex justify-between space-x-6">
      {/* Renderizando a primeira seção */}
      <div className="flex flex-col items-center max-w-sm">
        <h2 className="text-xl font-semibold mb-4 ">
          Links de acordo e parceria PD&I
        </h2>
        {links1.map((link, index) => (
          <LinkCard
            key={index}
            title={link.title}
            subtitle={link.subtitle}
            url={link.url}
            isLast={index === links1.length - 1}
          />
        ))}
      </div>

      {/* Renderizando a segunda seção */}
      <div className="flex flex-col items-center max-w-xs">
        <h2 className="text-xl font-semibold mb-4 ">
          Prestação de Serviços Técnicos Especializados (STE)
        </h2>
        {links2.map((link, index) => (
          <LinkCard
            key={index}
            title={link.title}
            subtitle={link.subtitle}
            url={link.url}
            isLast={index === links2.length - 1}
          />
        ))}
      </div>

      {/* Renderizando a terceira seção */}
      <div className="flex flex-col items-center max-w-xs">
        <h2 className="text-xl font-semibold mb-4">
          Prestação de Serviços Técnicos Especializados em PD&I
        </h2>
        {links3.map((link, index) => (
          <LinkCard
            key={index}
            title={link.title}
            subtitle={link.subtitle}
            url={link.url}
            isLast={index === links3.length - 1}
          />
        ))}
      </div>
    </div>
  </div>
)

export default LinksPage
