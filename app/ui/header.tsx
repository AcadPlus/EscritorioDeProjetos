'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { links } from '../lib/arrays'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const handleSubItemClick = () => {
    setExpandedIndex(null)
    setIsOpen(false)
  }

  return (
    <header className="bg-primary fixed top-0 w-full z-50 shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Image
            src="/projetos_pp.svg"
            priority
            alt="Logo"
            width={140}
            height={65}
          />
        </Link>
        <button
          type="button"
          className="md:hidden p-2 text-[#213102] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>

        <AnimatePresence>
          {(isOpen || !isMobile()) && (
            <motion.ul
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`${
                isOpen
                  ? 'absolute top-full left-0 right-0 bg-primary shadow-lg'
                  : 'hidden md:flex md:space-x-8'
              } flex flex-col md:flex-row items-center py-4 md:py-0`}
            >
              {links.map((item, index) => (
                <li
                  key={item.name}
                  className="relative group"
                  onClick={() => {
                    if (isMobile()) {
                      setExpandedIndex(expandedIndex === index ? null : index)
                    } else {
                      handleLinkClick()
                    }
                  }}
                  onPointerEnter={() => {
                    if (!isMobile() && item.expand) {
                      setExpandedIndex(index)
                    }
                  }}
                  onPointerLeave={() => {
                    if (!isMobile() && item.expand) {
                      setExpandedIndex(null)
                    }
                  }}
                >
                  <Link
                    href={item.expand ? '#' : item.href}
                    className={`text-lg font-regular transition-colors duration-300 flex items-center ${
                      item.special
                        ? 'bg-[#41580F] pt-2 pb-2 pl-4 pr-4 rounded text-white'
                        : 'text-[#41580F] hover:text-[#82AF01]'
                    }`}
                  >
                    {item.name}
                    {item.expand && (
                      <ChevronDown className="ml-1 h-4 w-4 text-[#82AF01] transition-transform duration-300 group-hover:rotate-180" />
                    )}
                  </Link>
                  <AnimatePresence>
                    {expandedIndex === index && item.expand && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 w-full mt-2 bg-white rounded-md shadow-lg py-2 z-10"
                      >
                        {item.expand.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              onClick={handleSubItemClick}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#82AF01] transition-colors duration-200"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}
