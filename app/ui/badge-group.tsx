import React, { ComponentProps } from 'react'
import { VariantProps, tv } from 'tailwind-variants'
import { ArrowRight } from 'lucide-react'

const button = tv({
  base: 'flex flex-row p-1 rounded-full gap-2 items-center justify-center max-w-110 self-center mt-10 mb-5 md:mt-20 md:mb-10 font-semibold transition duration-500 ease-in-out hover:scale-125',
  variants: {
    color: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      tertiary: 'bg-tertiary',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof button> & {
    posTexto?: string // Custom prop for position text
    classTexto?: string // Custom prop for text class
    textoFinal?: string // Custom prop for final text
    classTextoFinal?: string // Custom prop for final text class
    title: string // Ensure title is part of props
    content: string // Ensure content is part of props
  }

export default function Badge({
  color,
  className,
  content,
  title,
  posTexto,
  classTexto,
  textoFinal,
  classTextoFinal,
  ...props
}: ButtonProps) {
  return (
    <div className="flex flex-col items-center mb-12">
      <button
        {...props}
        className={`${button({ color, className })} mb-4`} // Adding margin bottom to the button
        style={{ width: 'auto', whiteSpace: 'nowrap' }} // Prevent line break and adjust width automatically
      >
        <p className="inline-flex items-center space-x-2 font-inter bg-white text-xs md:text-base font-normal border-2 px-3 py-1 rounded-full">
          {title}
        </p>
        <p className="text-xs font-medium italic md:text-base">{content}</p>
        <ArrowRight size={15} />
      </button>
      <h2
        className={`${classTexto || 'text-secondary'} text-2xl md:text-5xl font-inter md:max-w-90 text-center font-semibold`}
      >
        {posTexto}
      </h2>
      <p
        className={`${classTextoFinal} md:text-base text-sm md:mt-[24px] mt-2 text-center max-w-72 md:max-w-[768px] font-inter italic text-[#475467]`}
      >
        {textoFinal}
      </p>
    </div>
  )
}
