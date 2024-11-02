import React from 'react'

export default function Page() {
  return (
    <div className="container mx-auto p-4 mt-32">
      <h1 className="text-3xl text-[#41580F]  font-bold mb-12">
        Fluxo de Termo de Confidencialidade (NDA)
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 pr-8 mb-4 md:mb-0">
          <p className="mb-4 text-gray-600">
            A equipe do Escritório de Projetos desenvolveu este documento com o
            objetivo de padronizar o fluxo de aprovação de Termo de
            Confidencialidade (Non Disclosure Agreement – NDA) na Universidade
            Federal do Ceará (UFC).
          </p>
          <h1 className="text-3xl text-[#41580F]  font-bold mb-4">Objetivo</h1>

          <p className="mb-4 text-gray-600">
            Padronizar o fluxo de aprovação de Termo de Confidencialidade (Non
            Disclosure Agreement - NDA) na Universidade Federal do Ceará (UFC).
          </p>

          <h1 className="text-3xl text-[#41580F]  font-bold mb-4">Definição</h1>
          <p className="mb-4 text-gray-600">
            Este processo consiste no conjunto de tarefas desenvolvidas visando
            à celebração de instrumento legal entre a Universidade e a entidade
            externa (empresa, órgão, instituição pública, etc.) para a
            assinatura de acordo de confidencialidade, visando a proteger os
            ativos intelectuais e industriais nas tratativas e no projeto a ser
            desenvolvido.
          </p>

          <h1 className="text-3xl text-[#41580F]  font-bold mb-4">
            Importância do NDA
          </h1>
          <p className="mb-4 text-gray-600">
            A assinatura de um NDA é essencial para garantir que informações
            sensíveis, como pesquisas em andamento, inovações tecnológicas e
            dados estratégicos, permaneçam protegidas durante as interações
            entre a UFC e as partes externas. Ao formalizar essas obrigações de
            confidencialidade, a Universidade não apenas preserva seu patrimônio
            intelectual, mas também constrói uma relação de confiança com seus
            parceiros, facilitando colaborações futuras.
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
