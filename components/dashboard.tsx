'use client'

import { useState } from 'react'
import { Search, Mail, Link as LinkIcon, MapPin, GraduationCap, Rocket, Brain, Flask } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  const vitrines = [
    {
      title: 'Startups',
      icon: <Rocket className="h-6 w-6" />,
      description:
        'Descubra startups inovadoras, parceiras da UFC, que estão moldando o futuro com soluções disruptivas e transformando ideias em realidade.',
      benefits: [
        'Acesso a ideias inovadoras e tecnologias emergentes',
        'Oportunidades de networking com empreendedores visionários',
        'Parcerias estratégicas para desenvolvimento e crescimento',
      ],
      items: [
        {
          title: 'EcoTech',
          description: 'Soluções sustentáveis para empresas',
          tags: ['Sustentabilidade', 'Tecnologia Verde'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Ana Silva',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Tecnologia Ambiental',
          detailedDescription: 'A EcoTech desenvolve soluções tecnológicas inovadoras para ajudar empresas a reduzir seu impacto ambiental e otimizar o uso de recursos naturais. Nossos produtos incluem sistemas de gestão de energia, monitoramento de resíduos e análise de pegada de carbono.',
          email: 'contato@ecotech.com',
          portfolioLink: 'https://ecotech.com.br',
          campus: 'Campus do Pici',
          involvedCourses: ['Engenharia Ambiental', 'Ciência da Computação'],
        },
        {
          title: 'EducaApp',
          description: 'Plataforma de ensino online gamificada',
          tags: ['Educação', 'Gamificação'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Carlos Mendes',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'EdTech',
          detailedDescription: 'O EducaApp é uma plataforma de aprendizagem online que utiliza elementos de gamificação para tornar o processo de estudo mais envolvente e eficaz. Oferecemos cursos em diversas áreas, com foco em habilidades práticas e preparação para o mercado de trabalho.',
          email: 'contato@educaapp.com',
          portfolioLink: 'https://educaapp.com.br',
          campus: 'Campus de Sobral',
          involvedCourses: ['Ciência da Computação', 'Pedagogia'],
        },
        {
          title: 'BioInova',
          description: 'Pesquisa e desenvolvimento de biomateriais',
          tags: ['Biotecnologia', 'Pesquisa'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Dra. Luciana Costa',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Biotecnologia',
          detailedDescription: 'A BioInova é uma startup de biotecnologia focada na pesquisa e desenvolvimento de biomateriais avançados. Nossos projetos incluem o desenvolvimento de scaffolds para engenharia de tecidos, biomateriais para liberação controlada de medicamentos e materiais biodegradáveis para embalagens.',
          email: 'contato@bioinova.com',
          portfolioLink: 'https://bioinova.com.br',
          campus: 'Campus do Porangabussu',
          involvedCourses: ['Biotecnologia', 'Engenharia de Materiais'],
        },
      ],
    },
    {
      title: 'Competências',
      icon: <Brain className="h-6 w-6" />,
      description:
        'Explore uma ampla gama de habilidades e talentos, desenvolvidos em parceria com a UFC, destacando competências essenciais para impulsionar carreiras e negócios.',
      benefits: [
        'Encontre professores com vasta experiência em TCC, teses e doutorados',
        'Conecte-se com pesquisadores que lideram projetos inovadores',
        'Aproveite o conhecimento de acadêmicos renomados da UFC',
      ],
      items: [
        {
          title: 'Inteligência Artificial',
          description: 'Pesquisa em aprendizado de máquina e redes neurais',
          tags: ['IA', 'Machine Learning'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Prof. Dr. Ricardo Almeida',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Ciência da Computação',
          detailedDescription: 'Especialização em desenvolvimento e aplicação de técnicas de aprendizado de máquina e redes neurais para solução de problemas complexos. Experiência em projetos de visão computacional, processamento de linguagem natural e sistemas de recomendação.',
          email: 'ricardo.almeida@ufc.br',
          portfolioLink: 'https://cc.ufc.br/docente/ricardo-almeida',
          campus: 'Campus do Pici',
          involvedCourses: ['Ciência da Computação', 'Engenharia de Software'],
        },
        {
          title: 'Desenvolvimento Web',
          description: 'Experiência em React, Node.js e bancos de dados',
          tags: ['Frontend', 'Backend'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Profa. Dra. Mariana Santos',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Engenharia de Software',
          detailedDescription: 'Especialista em desenvolvimento web full-stack, com foco em tecnologias modernas como React, Node.js, e bancos de dados NoSQL. Experiência em arquitetura de microsserviços, desenvolvimento de APIs RESTful e implementação de práticas de DevOps.',
          email: 'mariana.santos@ufc.br',
          portfolioLink: 'https://es.ufc.br/docente/mariana-santos',
          campus: 'Campus de Quixadá',
          involvedCourses: ['Engenharia de Software', 'Sistemas de Informação'],
        },
        {
          title: 'Direito Digital',
          description: 'Especialização em legislação cibernética e proteção de dados',
          tags: ['LGPD', 'Direito Digital'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Prof. Dr. João Oliveira',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Direito',
          detailedDescription: 'Especialista em direito digital, com foco em legislação cibernética, proteção de dados e propriedade intelectual no ambiente digital. Experiência em consultoria para empresas de tecnologia e startups sobre conformidade com a LGPD e regulamentações internacionais.',
          email: 'joao.oliveira@ufc.br',
          portfolioLink: 'https://direito.ufc.br/docente/joao-oliveira',
          campus: 'Campus do Benfica',
          involvedCourses: ['Direito'],
        },
      ],
    },
    {
      title: 'Laboratórios',
      icon: <Flask className="h-6 w-6" />,
      description:
        'Conheça laboratórios de ponta, parceiros da UFC, onde ciência e tecnologia se encontram para criar avanços revolucionários e promover a inovação.',
      benefits: [
        'Acesso a equipamentos e tecnologias de última geração',
        'Ambiente colaborativo para pesquisa e desenvolvimento',
        'Suporte técnico especializado de profissionais da UFC',
      ],
      items: [
        {
          title: 'Laboratório de Tecnologias Inovadoras',
          description: 'Pesquisa em Industria 4.0 e 5.0; Atuação em sistemas de otimização e inteligência artificial.',
          tags: ['Indústria 4.0', 'IA'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Prof. Dr. André Martins',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Engenharia e Tecnologia',
          detailedDescription: 'O Laboratório de Tecnologias Inovadoras é um centro de excelência em pesquisa aplicada, focado no desenvolvimento de soluções para a Indústria 4.0 e 5.0. Nossos projetos incluem sistemas de manufatura inteligente, Internet das Coisas (IoT) industrial e algoritmos de otimização baseados em IA para processos produtivos.',
          email: 'lab.techinov@ufc.br',
          portfolioLink: 'https://techinov.ufc.br',
          campus: 'Campus do Pici',
          involvedCourses: ['Engenharia de Computação', 'Ciência da Computação', 'Engenharia de Software'],
        },
        {
          title: 'Laboratório de Sociodrama e de Desenvolvimento do Pensamento Crítico Social',
          description: 'Aplicações em escolas, clínicas psicológicas, organizações sociais e empresas!',
          tags: ['Psicologia', 'Sociologia'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Profa. Dra. Camila Rocha',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Ciências Sociais',
          detailedDescription: 'Este laboratório interdisciplinar combina técnicas de sociodrama com metodologias de desenvolvimento do pensamento crítico para abordar questões sociais complexas. Realizamos pesquisas e intervenções em diversos contextos, desde escolas até organizações empresariais, promovendo a reflexão crítica e a transformação social.',
          email: 'lab.sociodrama@ufc.br',
          portfolioLink: 'https://sociodrama.ufc.br',
          campus: 'Campus do Benfica',
          involvedCourses: ['Psicologia', 'Ciências Sociais'],
        },
        {
          title: 'Insight Lab',
          description: 'Laboratório de pesquisa em Ciência de Dados e Inteligência Artificial',
          tags: ['Data Science', 'IA'],
          image: '/placeholder.svg?height=200&width=300',
          responsibleUser: {
            name: 'Prof. Dr. Lucas Ferreira',
            avatar: '/placeholder-avatar.jpg',
          },
          category: 'Ciência da Computação',
          detailedDescription: 'O Insight Lab é um centro de pesquisa avançada em Ciência de Dados e Inteligência Artificial. Nossos projetos abrangem áreas como análise preditiva, processamento de big data, aprendizado profundo e visualização de dados. Trabalhamos em colaboração com empresas e instituições para desenvolver soluções inovadoras baseadas em dados.',
          email: 'insightlab@ufc.br',
          portfolioLink: 'https://insightlab.ufc.br',
          campus: 'Campus do Pici',
          involvedCourses: ['Ciência da Computação', 'Engenharia de Software', 'Estatística'],
        },
      ],
    },
  ]

  const filteredVitrines = vitrines.map(vitrine => ({
    ...vitrine,
    items: vitrine.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }))

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Linka Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Explore as Vitrines</h2>
            <div className="flex items-center space-x-2">
              <Input
                className="w-64"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Descubra oportunidades em Startups, Competências e Laboratórios da UFC.
          </p>
        </div>

        <Tabs defaultValue="startups">
          <TabsList className="mb-4">
            {vitrines.map((vitrine) => (
              <TabsTrigger
                key={vitrine.title}
                value={vitrine.title.toLowerCase()}
              >
                <div className="flex items-center">
                  {vitrine.icon}
                  <span  className="ml-2">{vitrine.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredVitrines.map((vitrine) => (
            <TabsContent
              key={vitrine.title}
              value={vitrine.title.toLowerCase()}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{vitrine.title}</h3>
                <p className="text-gray-600 mb-4">{vitrine.description}</p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  {vitrine.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vitrine.items.map((item, itemIndex) => (
                  <Card
                    key={itemIndex}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />
                      <CardDescription>{item.description}</CardDescription>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.responsibleUser.avatar} alt={item.responsibleUser.name} />
                          <AvatarFallback>{item.responsibleUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{item.responsibleUser.name}</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Detalhes</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>{item.title}</DialogTitle>
                            <DialogDescription>
                              {item.category}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg" />
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                              <p>{item.detailedDescription}</p>
                            </ScrollArea>
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <h4 className="font-semibold">Informações de Contato</h4>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${item.email}`} className="text-sm text-blue-600 hover:underline">{item.email}</a>
                              </div>
                              <div className="flex items-center space-x-2">
                                <LinkIcon className="h-4 w-4" />
                                <a href={item.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Portfolio</a>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">{item.campus}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <GraduationCap className="h-4 w-4" />
                                <span className="text-sm">{item.involvedCourses.join(', ')}</span>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={item.responsibleUser.avatar} alt={item.responsibleUser.name} />
                                <AvatarFallback>{item.responsibleUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold">{item.responsibleUser.name}</p>
                                <p className="text-sm text-gray-600">Responsável</p>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="secondary">
                              Entrar em contato
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}