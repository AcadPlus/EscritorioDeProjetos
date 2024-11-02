import React from 'react'

export default function Page() {
  return (
    <div className="container mx-auto p-4 mt-32">
      <h1 className="text-2xl font-bold mb-8">
        Fluxo de Termo de Confidencialidade (NDA)
      </h1>
      <div className="flex">
        {/* Texto à esquerda */}
        <div className="flex-1 pr-8">
          <p className="mb-4">
            A equipe do Escritório de Projetos desenvolveu este documento com o
            objetivo de padronizar o fluxo de aprovação de Termo de
            Confidencialidade (Non Disclosure Agreement – NDA) na Universidade
            Federal do Ceará (UFC).
          </p>
        </div>

        {/* Preview do documento do Google Drive */}
        <div className="flex-1">
          <iframe
            src="https://condominio.ufc.br/wp-content/uploads/2022/07/Fluxo-NDA-1.pdf" // Substitua 'YOUR_DOCUMENT_ID' pelo ID do seu documento
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
