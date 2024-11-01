/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { links } from '../lib/arrays'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  return (
    <header className="bg-primary flex flex-row fixed top-0 w-full  transition duration-500 items-center">
      <nav className="flex items-center justify-between p-4 md:w-full px-7 w-full xl:pl-28">
        <div className="flex items-center space-x-4">
          <Image
            src="/logo_svg.svg"
            alt="Logo"
            className=""
            width={140}
            height={65}
          />
          <div>
            <h1 className="text-sm max-w-20 text-left hidden">
              Escritório de projetos da UFC
            </h1>
          </div>
        </div>
        <div className="md:hidden">
          <button
            type="button"
            className="rounded-md bg-primary p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div
          data-isopen={isOpen}
          className="data-[isopen=true]:block hidden absolute top-[6rem] left-0 z-10 w-full bg-primary px-4 py-2 md:static
          md:block md:w-auto md:px-0 md:py-0"
        >
          <ul className="space-y-2 md:flex md:space-x-10 md:space-y-0 text-center">
            {links.map((item) => (
              <li
                key={item.name}
                className="hover:underline hover:ease-in duration-300 transition-all"
              >
                <a
                  href={item.href}
                  className="text-lg font-regular text-[#213102] flex items-center"
                >
                  {item.name}
                  {item.expand ? (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-[#82AF01] ml-2 text-base md:text-lg lg:text-sm" // Tamanhos responsivos
                    />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
