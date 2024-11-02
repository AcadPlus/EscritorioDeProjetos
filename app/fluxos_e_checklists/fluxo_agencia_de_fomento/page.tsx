import React from 'react'

export default function Page() {
  return (
    <div className="container mx-auto p-4 mt-32">
      <h1 className="text-2xl font-bold mb-8">Fluxo Agências de Fomento</h1>
      <div className="flex">
        {/* Texto à esquerda */}
        <div className="flex-1 pr-8">
          <p>
            A equipe do Escritório de Projetos desenvolveu um documento com o
            objetivo de padronizar o fluxo de aprovação e celebração de projetos
            de convênio para Pesquisa, Desenvolvimento e Inovação, com órgãos e
            entidades de fomento que concedam subvenção econômica para o
            desenvolvimento de produtos, processos e/ou serviços inovadores.
          </p>
        </div>

        {/* Preview do documento do Google Drive */}
        <div className="flex-1">
          <iframe
            src="https://drive.google.com/file/d/1d9crVvu0Kr9F6XOTwD6mgo4y_THBsrwA/preview" // Substitua 'YOUR_DOCUMENT_ID' pelo ID do seu documento
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
