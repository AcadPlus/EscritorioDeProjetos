import React from 'react'
import { Book } from 'lucide-react'

import {
  ButtonProps,
  InputButtonProps,
  TextAreaProps,
  RadioButtomProps,
} from '../lib/definitions'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export function Input({ name, className, ...rest }: InputButtonProps) {
  return (
    <div className={twMerge('flex flex-col space-y-2 w-full', className)}>
      <label className="text-xs" htmlFor="">
        {name}
      </label>
      <input
        {...rest}
        className="border-2 rounded-md text-black p-2 h-10 text-xs"
      />
    </div>
  )
}

export function TextArea({ name, ...rest }: TextAreaProps) {
  return (
    <div className="flex flex-col space-y-2 w-full ">
      <label className="text-sm" htmlFor="">
        {name}
      </label>
      <textarea
        className="border-2 rounded-md text-black p-2 h-16"
        {...rest}
      ></textarea>
    </div>
  )
}

export function Button({ name }: ButtonProps) {
  return (
    <Link
      className=" bg-blueText w-56 p-2 font-bold text-center rounded-lg text-white mt-4 md:w-full"
      href="/"
    >
      {name}
    </Link>
  )
}

export function RadioButton({ tittle, content }: RadioButtomProps) {
  return (
    <div className="rounded-md border-2 border-primary text-secondary flex items-center space-x-2 p-3 max-w-96 transition duration-500 ease-in-out hover:scale-110 hover:bg-primary hover:text-black">
      <Book className="rounded-full bg-secondary p-1" size={30} color="white" />
      <div>
        <p className="text-sm font-medium">{tittle}</p>
        <p className="text-xs">{content}</p>
      </div>
    </div>
  )
}
