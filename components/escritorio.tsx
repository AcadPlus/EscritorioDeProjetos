'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Escritorio() {
  return (
    <div className="container mx-auto flex justify-center">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center gap-24 max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="md:w-1/3 max-w-[300px]">
          <Image
            src="/logo.svg"
            alt="Logo do Escritório de Projetos e Parcerias"
            width={300}
            height={300}
          />
        </div>
        <div className="md:w-3/4">
          <p className="text-base text-gray-600 leading-relaxed mb-4">
            O Escritório de Projetos e Parcerias da Universidade Federal do
            Ceará (UFC) é dedicado a fornecer suporte e assistência em todas as
            etapas do processo de desenvolvimento de projetos de Pesquisa,
            Desenvolvimento e Inovação (PD&I).
          </p>
          <p className="text-base text-gray-600 leading-relaxed mb-6">
            Nossa missão é facilitar a formatação, negociação e implementação de
            parcerias institucionais, garantindo a conformidade com as
            diretrizes da UFC e promovendo a valorização das atividades
            institucionais.
          </p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Suporte Integral
              </h3>
              <p className="text-sm text-gray-600">
                Assistência em todas as etapas de projetos PD&I
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Parcerias Estratégicas
              </h3>
              <p className="text-sm text-gray-600">
                Facilitação e implementação de colaborações institucionais
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
