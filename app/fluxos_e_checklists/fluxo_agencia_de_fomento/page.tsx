import React from 'react'

export default function Page() {
  return (
    <div className="container mx-auto p-4 mt-32 ">
      <h1 className="text-[#41580F] text-3xl font-bold mb-8">
        Fluxo Agências de Fomento
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 pr-8 mb-4 md:mb-0">
          <p className="mb-4 text-gray-600">
            A equipe do Escritório de Projetos desenvolveu um documento com o
            objetivo de padronizar o fluxo de aprovação e celebração de projetos
            de convênio para Pesquisa, Desenvolvimento e Inovação, com órgãos e
            entidades de fomento que concedam subvenção econômica para o
            desenvolvimento de produtos, processos e/ou serviços inovadores.
          </p>

          <h1 className="text-3xl text-[#41580F] font-bold mb-4">
            Justificativa
          </h1>
          <p className="mb-4 text-gray-600">
            A formalização de convênios é fundamental para o fortalecimento da
            parceria entre a Universidade Federal do Ceará (UFC) e as
            instituições de fomento, uma vez que permite o acesso a recursos
            financeiros e técnicos que são essenciais para impulsionar
            iniciativas inovadoras. A padronização deste fluxo visa não apenas a
            agilidade nas aprovações, mas também a garantia de que todos os
            requisitos legais e administrativos sejam atendidos, promovendo a
            transparência e a conformidade com as normativas vigentes.
          </p>

          <h1 className="text-3xl text-[#41580F] font-bold mb-4">
            Objetivos do Fluxo
          </h1>
          <p className="mb-4 text-gray-600">
            Este documento estabelece um conjunto claro de etapas que orientam
            as partes envolvidas desde a elaboração da proposta até a celebração
            do convênio. Isso inclui a definição de responsabilidades, prazos, e
            a documentação necessária para assegurar que todos os aspectos do
            projeto sejam devidamente considerados. O processo busca facilitar a
            comunicação entre a UFC e os órgãos de fomento, criando um ambiente
            propício para a inovação e a pesquisa colaborativa.
          </p>
        </div>

        {/* Preview do documento do Google Drive */}
        <div className="flex-1">
          <iframe
            src="https://drive.google.com/file/d/1d9crVvu0Kr9F6XOTwD6mgo4y_THBsrwA/preview"
            width="100%"
            height="600"
            className="border border-gray-300 rounded"
            allow="autoplay"
            title="Preview do Documento"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
