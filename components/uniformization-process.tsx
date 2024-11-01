'use client'

import React, { useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  ReactFlowProvider,
  Node,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UniformizationProcess() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const flowSteps = [
    {
      title: 'Reunião inicial',
      description: 'Encontro com o setor a ser uniformizado',
    },
    {
      title: 'Validação interna',
      description: 'Revisão e aprovação dos documentos',
    },
    {
      title: 'Envio de fluxos',
      description: 'Distribuição para unidades relevantes',
    },
    { title: 'Análises', description: 'Avaliação detalhada dos processos' },
    { title: 'Ajustes', description: 'Implementação de melhorias sugeridas' },
    { title: 'Uniformização', description: 'Alinhamento final com o comitê' },
    {
      title: 'Consolidação',
      description: 'Formalização das mudanças aprovadas',
    },
  ]

  const committeeMembers = [
    'PROINTER - Pró-Reitoria de Inovação e Relações Interinstitucionais',
    'PREX - Pró-Reitoria de Extensão',
    'PRPPG - Pró-Reitoria de Pesquisa e Pós-Graduação',
    'PF - Procuradoria Federal',
    'COLEG - Coordenadoria de Legislação',
    'Fundações de Apoio',
  ]

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index)
  }

  const nodes: Node[] = flowSteps.map((step, index) => ({
    id: `${index}`,
    type: 'customNode',
    position: { x: 100, y: index * 150 },
    data: { title: step.title, description: step.description, index },
  }))

  const edges: Edge[] = flowSteps.slice(0, -1).map((_, index) => ({
    id: `e${index}-${index + 1}`,
    source: `${index}`,
    target: `${index + 1}`,
  }))

  const CustomNode = ({
    data,
  }: {
    data: { title: string; description: string; index: number }
  }) => (
    <div className="p-4 rounded-lg bg-white shadow-lg border border-gray-200 text-muted-foreground relative w-60">
      <Button
        variant="ghost"
        className="w-full justify-between text-left font-medium"
        onClick={() => toggleStep(data.index)}
        aria-expanded={expandedStep === data.index}
      >
        {data.title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expandedStep === data.index ? 'rotate-180' : ''}`}
        />
      </Button>
      <AnimatePresence>
        {expandedStep === data.index && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 bg-gray-100 p-2 rounded-lg"
          >
            <p className="text-sm">{data.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        style={{ background: '#555' }}
      />
    </div>
  )

  return (
    <section className="md:max-w-[1200px] sm:max-w-[400px] py-4 md:py-8 lg:py-12 bg-background">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Text Content */}
        <div className="space-y-6">
          <div className="space-y-4 text-slate-700">
            <h3 className="text-xl font-semibold mb-3 text-[#1A2C32] ">
              Proposta
            </h3>

            <p className="text-muted-foreground ">
              A Universidade reconhece a importância de uma comunicação clara e
              eficiente entre seus setores. Para isso, estamos empenhados em
              uniformizar os fluxos e processos relacionados à definição de
              temas específicos relacionados ao novo Marco Legal de Ciência,
              Tecnologia e Inovação - MLCTI.
            </p>
            <p className="text-muted-foreground">
              Este guia detalhado descreve os passos que serão seguidos para
              alcançar a uniformização desejada.
            </p>
            <p className="text-muted-foreground">
              Acreditamos que a uniformização dos fluxos e processos de
              definição de temas trará diversos benefícios para a Universidade,
              como:
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>
                Maior clareza e eficiência na comunicação entre os setores.
              </li>
              <li>Redução de tempo e burocracia.</li>
              <li>Melhor aproveitamento dos recursos humanos e materiais.</li>
              <li>Maior efetividade na consolidação dos projetos.</li>
            </ul>

            <div className="pt-6">
              <h3 className="text-xl font-semibold mb-3 text-[#1A2C32]">
                Membros do Comitê
              </h3>
              <ul className="space-y-2 list-none">
                {committeeMembers.map((member, index) => (
                  <li
                    key={index}
                    className="flex items-center text-muted-foreground"
                  >
                    <span className="w-2 h-2 bg-slate-700 rounded-full mr-2" />
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Flowchart */}
        <div className="h-[700px] w-full ">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={{ customNode: CustomNode }}
              nodesConnectable={true}
              nodesDraggable={false}
              className="bg-gray-50 rounded-lg shadow-lg"
              defaultViewport={{ x: -10, y: 0, zoom: 0.7 }}
            >
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </section>
  )
}

export default UniformizationProcess
