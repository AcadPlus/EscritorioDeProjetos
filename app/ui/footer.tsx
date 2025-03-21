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
    <footer className="bg-gray-50 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div className="col-span-1 md:col-span-2" {...fadeInUp}>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/projetos_pp.svg"
                alt="Logo do escritório de projetos"
                width={120}
                height={120}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-sm mb-4">
              Promovendo conexões entre a UFC, iniciativas acadêmicas e
              parceiros externos.
            </p>
            <ul className="flex space-x-4">
              {social.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    aria-label={item.name}
                    className="text-gray-400 hover:text-secondary transition-colors"
                  >
                    <item.icon className="w-6 h-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp}>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Links Rápidos
            </h2>
            <ul className="space-y-2">
              {links.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-secondary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp}>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Legal</h2>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item?.href || ''}
                    className="text-sm hover:text-secondary transition-colors"
                  >
                    {item.name}
                  </Link>
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
            © {new Date().getFullYear()} Escritório de Projetos e Parcerias da
            Universidade Federal do Ceará. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
