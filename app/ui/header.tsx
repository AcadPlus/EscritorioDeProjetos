'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { links } from '../lib/arrays'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isLandingPage, setIsLandingPage] = useState(false)
  const pathname = usePathname() // Obtém o caminho atual da rota
  const [timeChecking, setTimeChecking] = useState(false)
  const [choosingItems, setChoosingItems] = useState<boolean | null>(null)

  useEffect(() => {
    if (pathname === '/') {
      setIsLandingPage(true)
    } else {
      setIsLandingPage(false)
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = () => {
    setIsOpen(false)
    setExpandedIndex(null)
  }

  const nullifyExpandItem = () => {
    if (timeChecking) return
    if (expandedIndex === null) return
    setTimeChecking(true)

    if (choosingItems === true) {
      return
    } else if (choosingItems === null) {
      console.log('não ta botou o mouse nas opções ainda')
      return
    } else {
      setTimeout(() => {
        setExpandedIndex(null)
        setChoosingItems(null)
        setTimeChecking(false)
      }, 5000)
    }

    nullifyExpandItem()
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={140}
              height={65}
              className="h-12 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {links.map((item, index) => (
              <div key={item.name} className="relative group">
                {item.expand ? (
                  <button
                    className={`text-sm font-medium ${isLandingPage ? (scrolled ? 'text-gray-600' : 'text-white') : 'text-gray-600 hover:text-gray-900'}  flex items-center`}
                    onMouseEnter={() => setExpandedIndex(index)}
                    onMouseLeave={() => nullifyExpandItem()}
                  >
                    {item.name}
                    <ChevronDown
                      onMouseEnter={() => setChoosingItems(true)}
                      onMouseLeave={() => setChoosingItems(false)}
                      className={`ml-1 h-4 w-4 ${isLandingPage ? (scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white') : 'text-gray-600 hover:text-gray-900'} transition-transform duration-300 group-hover:rotate-180`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      item.special
                        ? 'bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary/90'
                        : ` ${isLandingPage ? (scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white') : 'text-gray-600 hover:text-gray-900'}`
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
                {item.expand && expandedIndex === index && (
                  <div
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    onMouseEnter={() => setExpandedIndex(index)}
                    onMouseLeave={() => setExpandedIndex(null)}
                  >
                    {item.expand.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLinkClick}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4"
            >
              {links.map((item, index) => (
                <div key={item.name}>
                  {item.expand ? (
                    <button
                      className="w-full text-left py-2 text-base font-medium text-gray-600 hover:text-gray-900 flex items-center justify-between"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block py-2 text-base font-medium ${
                        item.special
                          ? 'text-secondary'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  )}
                  {item.expand && expandedIndex === index && (
                    <div className="pl-4">
                      {item.expand.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                          onClick={handleLinkClick}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
