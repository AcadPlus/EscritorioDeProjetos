import React from 'react'
import Image from 'next/image'
import { legal, links, social } from '../lib/arrays'

export default function Footer() {
  return (
    <footer className="w-full bg-primary">
      <div className="flex flex-col justify-evenly md:w-full space-y-5 p-5 md:flex-row md:justify-around">
        <div className="space-y-4 flex justify-center items-center flex-col">
          <Image
            src="/logo.svg"
            alt="Logo do escritório de projetos"
            width={40}
            height={40}
          />
          <p className="max-w-80 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit, blanditiis iusto?
          </p>
          <ul className="flex space-x-7">
            {social.map((item) => (
              <li key={item.name}>
                {<item.icon color="gray" width={30} height={30} />}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-gray-500 font-semibold text-lg">Home</p>
          <ul className="flex flex-col space-y-3 mt-1">
            {links.map((item) => (
              <li className="font-bold text-xl" key={item.name}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-gray-500 font-semibold text-lg">Legal</p>
          <ul className="flex flex-col space-y-3 mt-1">
            {legal.map((item) => (
              <li className="font-bold text-xl" key={item.name}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col space-y-5 py-5">
        <p className="text-center">
          © 2024 Escritório de Projetos e Parcerias. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
