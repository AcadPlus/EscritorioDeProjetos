'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { legal, links, social } from '../lib/arrays'

export default function Footer() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <footer className="w-full bg-primary text-[#213102]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="flex flex-col items-center md:items-start space-y-4"
            {...fadeInUp}
          >
            <Image
              src="/logo.svg"
              alt="Logo do escritório de projetos"
              width={60}
              height={60}
              className="hover:opacity-80 transition-opacity"
            />
            <p className="max-w-xs text-center md:text-left text-sm">
              Escritório de Projetos e Parcerias da Universidade Federal do
              Ceará
            </p>
            <ul className="flex space-x-4">
              {social.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} aria-label={item.name}>
                    <item.icon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp}>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Home</h2>
            <ul className="space-y-2">
              {links.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:underline transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp}>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Legal</h2>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.name}>
                  <div
                    className="text-sm transition-all"
                  >
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Escritório de Projetos e Parcerias.
            Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
