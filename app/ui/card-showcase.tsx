import React from 'react'
import { Mail, CircleCheck } from 'lucide-react'
import { CardProps } from '../lib/definitions'

export default function CardShowcase({ description, title, items }: CardProps) {
  return (
    <div className="min-w-80 bg-[#f2ffff] rounded-3xl flex flex-col gap-4 justify-center px-6 py-4 shadow-md">
      <div className="flex items-center">
        <Mail size={20} className="text-gray-600" />
      </div>
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-xs md:text-base text-gray-700 h-16 md:mb-10">
        {description}
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-xs md:text-sm flex items-center gap-2">
            <CircleCheck size={20} className="text-green-600" />
            <p className="text-gray-700">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
