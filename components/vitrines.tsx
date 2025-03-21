'use client'

import ShowcaseCard from './showcase-card'

export function Vitrines() {
  return (
    <div className="container grid gap-6 md:grid-cols-3 py-8">
      <ShowcaseCard
        title="Vitrine de Competências"
        description="Explore uma ampla gama de habilidades e talentos, desenvolvidos em parceria com a UFC, destacando competências essenciais para impulsionar carreiras e negócios."
        items={[
          {
            icon: '✓',
            text: 'Encontre professores com vasta experiência em TCC, teses e doutorados',
          },
          {
            icon: '✓',
            text: 'Conecte-se com pesquisadores que lideram projetos inovadores',
          },
          {
            icon: '✓',
            text: 'Aproveite o conhecimento de acadêmicos renomados da UFC',
          },
        ]}
        comingSoon={true}
      />

      <ShowcaseCard
        title="Vitrine de Negócios"
        description="Explore oportunidades de negócios inovadores, incluindo startups, spinoffs e empresas externas parceiras da UFC, que estão moldando o futuro com soluções disruptivas."
        items={[
          {
            icon: '✓',
            text: 'Acesso a startups, spinoffs e empresas externas inovadoras',
          },
          {
            icon: '✓',
            text: 'Oportunidades de networking com empreendedores e empresários',
          },
          {
            icon: '✓',
            text: 'Parcerias estratégicas para desenvolvimento e crescimento',
          },
        ]}
      />

      <ShowcaseCard
        title="Vitrine de Laboratórios"
        description="Conheça laboratórios de ponta, parceiros da UFC, onde ciência e tecnologia se encontram para criar avanços revolucionários e promover a inovação."
        items={[
          {
            icon: '✓',
            text: 'Acesso a equipamentos e tecnologias de última geração',
          },
          {
            icon: '✓',
            text: 'Ambiente colaborativo para pesquisa e desenvolvimento',
          },
          {
            icon: '✓',
            text: 'Suporte técnico especializado de profissionais da UFC',
          },
        ]}
        comingSoon={true}
      />
    </div>
  )
}
