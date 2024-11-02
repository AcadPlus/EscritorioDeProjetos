'use client'
import { useState } from 'react'

export default function Page() {
  const pdfFiles = [
    {
      name: 'Curso de Especialização',
      url: `/pdf/curso-de-especializacao.pdf#page=1&zoom=90`,
    },
    { name: 'Laboratórios', url: `/pdf/laboratorios.pdf#page=1&zoom=90` },
    { name: 'TED', url: `/pdf/ted.pdf#page=1&zoom=90` },
  ]

  const [currentPdf, setCurrentPdf] = useState(pdfFiles[0].url)

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-5 gap-5 mt-32 max-w-7xl mx-auto">
      <div className="flex-1 max-w-md">
        <h1 className="text-3xl font-bold text-[#41580F] ">
          Fluxos de Processos
        </h1>
        <p className="mt-3 text-gray-600">
          Nesta seção, você encontrará informações essenciais sobre os fluxos de
          processos relacionados aos cursos de especialização, laboratórios e
          TED. O gerenciamento eficaz desses processos é fundamental para
          assegurar a qualidade e a conformidade acadêmica, desde a abertura do
          processo até a aprovação final.
        </p>
        <p className="mt-2 text-gray-600">
          Os fluxos de processos abrangem uma série de etapas, cada uma com suas
          respectivas documentações, que são necessárias para garantir que todas
          as exigências legais e normativas sejam atendidas.
        </p>
      </div>

      <div className="flex-1 max-w-3xl">
        <h2 className="text-2xl font-semibold text-[#41580F] ">
          Selecionar PDF
        </h2>
        <select
          onChange={(e) => setCurrentPdf(e.target.value)}
          value={currentPdf}
          className="w-full p-3 mb-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {pdfFiles.map((file, index) => (
            <option key={index} value={file.url}>
              {file.name}
            </option>
          ))}
        </select>

        <div className="overflow-hidden rounded-lg border border-gray-300">
          <iframe
            src={currentPdf}
            className="w-full h-[600px] md:h-[700px] border-0"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  )
}
