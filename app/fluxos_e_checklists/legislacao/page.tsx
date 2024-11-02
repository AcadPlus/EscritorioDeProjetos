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
    title: 'Constituição Federal, Art. 218, XVI',
    subtitle:
      'Nós, representantes do povo brasileiro, reunidos em Assembléia Nacional Constituinte para instituir um Estado Democrático, destinado a assegurar o exercício dos direitos sociais e individuais, a liberdade, a segurança, o bem-estar, o desenvolvimento, a igualdade e a justiça como valores supremos de uma sociedade fraterna, pluralista e sem preconceitos, fundada na harmonia social e comprometida, na ordem interna e internacional, com a solução pacífica das controvérsias, promulgamos, sob a proteção de Deus, a seguinte CONSTITUIÇÃO DA REPÚBLICA FEDERATIVA DO BRASIL.',
    url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
  },
  {
    title: 'Lei da Propriedade Industrial – Lei. 9.279/1996',
    subtitle:
      'Regula direitos e obrigações relativos à propriedade industrial.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L9279.htm',
  },
  {
    title: 'Lei de Proteção de Cultivares – Lei 9.456/1997',
    subtitle:
      'Institui a Lei de Proteção de Cultivares e dá outras providências.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L9456.htm',
  },
  {
    title:
      'Lei de proteção da Propriedade Intelectual de Programa de Computador – Lei 9.609/1998',
    subtitle:
      'Dispõe sobre a proteção da propriedade intelectual de programa de computador, sua comercialização no País, e dá outras providências.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L9609.htm',
  },
  {
    title: 'Lei de Direitos Autorais – Lei 9.610/1998',
    subtitle:
      'Altera, atualiza e consolida a legislação sobre direitos autorais e dá outras providências.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L9610.htm',
  },
  {
    title: 'Lei de Inovação – Lei 10.973/2004',
    subtitle:
      'Dispõe sobre incentivos à inovação e à pesquisa científica e tecnológica no ambiente produtivo e dá outras providências.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L10973.htm',
  },
  {
    title:
      'Lei sobre a proteção à propriedade intelectual das topografias de circuitos integrados – Lei 11.484/2007',
    subtitle:
      'Dispõe sobre os incentivos às indústrias de equipamentos para TV Digital e de componentes eletrônicos semicondutores e sobre a proteção à propriedade intelectual das topografias de circuitos integrados, instituindo o Programa de Apoio ao Desenvolvimento Tecnológico da Indústria de Semicondutores – PADIS e o Programa de Apoio ao Desenvolvimento Tecnológico da Indústria de Equipamentos para a TV Digital – PATVD; altera a Lei no 8.666, de 21 de junho de 1993; e revoga o art. 26 da Lei no 11.196, de 21 de novembro de 2005.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L11484.htm',
  },
  {
    title:
      'Lei de acesso ao patrimônio genético e proteção ao conhecimento tradicional – Lei 13.123/2015',
    subtitle:
      'Regulamenta o inciso II do § 1º e o § 4º do art. 225 da Constituição Federal, o Artigo 1, a alínea j do Artigo 8, a alínea c do Artigo 10, o Artigo 15 e os §§ 3º e 4º do Artigo 16 da Convenção sobre Diversidade Biológica, promulgada pelo Decreto nº 2.519, de 16 de março de 1998; dispõe sobre o acesso ao patrimônio genético, sobre a proteção e o acesso ao conhecimento tradicional associado e sobre a repartição de benefícios para conservação e uso sustentável da biodiversidade; revoga a Medida Provisória nº 2.186-16, de 23 de agosto de 2001; e dá outras providências.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L13123.htm',
  },
  {
    title: 'Marco Legal da Ciência e Tecnologia – Lei 13.243/2016',
    subtitle:
      'Dispõe sobre estímulos ao desenvolvimento científico, à pesquisa, à capacitação científica e tecnológica e à inovação e altera a Lei nº 10.973, de 2 de dezembro de 2004, a Lei nº 6.815, de 19 de agosto de 1980, a Lei nº 8.666, de 21 de junho de 1993, a Lei nº 12.462, de 4 de agosto de 2011, a Lei nº 8.745, de 9 de dezembro de 1993, a Lei nº 8.958, de 20 de dezembro de 1994, a Lei nº 8.010, de 29 de março de 1990, a Lei nº 8.032, de 12 de abril de 1990, e a Lei nº 12.772, de 28 de dezembro de 2012, nos termos da Emenda Constitucional nº 85, de 26 de fevereiro de 2015.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L13243.htm',
  },
  {
    title:
      'Política de propriedade intelectual da UFC – Resolução CONSUNI 38/2017',
    subtitle:
      'Dispõe sobre a definição, geração e gestão de direitos relativos à Propriedade Intelectual e à Inovação Tecnológica no âmbito da Universidade Federal do Ceará, delega competências e dá outras providências.',
    url: 'https://www.ufc.br/sobre/propriedade-intelectual',
  },
  {
    title:
      'Decreto Nº 9.283 de 2018 – Regulamenta os dispositivos do Marco Legal de Ciência, Tecnologia e Inovação',
    subtitle:
      "Regulamenta a Lei nº 10.973, de 2 de dezembro de 2004, a Lei nº 13.243, de 11 de janeiro de 2016, o art. 24, § 3º, e o art. 32, § 7º, da Lei nº 8.666, de 21 de junho de 1993, o art. 1º da Lei nº 8.010, de 29 de março de 1990, e o art. 2º, caput, inciso I, alínea 'g', da Lei nº 8.032, de 12 de abril de 1990, e altera o Decreto nº 6.759, de 5 de fevereiro de 2009, para estabelecer medidas de incentivo à inovação e à pesquisa científica e tecnológica no ambiente produtivo, com vistas à capacitação tecnológica, ao alcance da autonomia tecnológica e ao desenvolvimento do sistema produtivo nacional e regional.",
    url: 'https://www.planalto.gov.br/ccivil_03/leis/L9283.htm',
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
    <h1 className="text-2xl font-semibold mb-20">Legislação</h1>

    {/* Container para as colunas */}
    <div className="flex justify-between space-x-6">
      {/* Renderizando a primeira seção */}
      <div className="flex flex-col items-center">
        {/* <h2 className="text-xl font-semibold mb-4 ">
          Links de acordo e parceria PD&I
        </h2> */}
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
    </div>
  </div>
)

export default LinksPage
