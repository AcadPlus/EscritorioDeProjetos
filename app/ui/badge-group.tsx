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

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>

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
      {' '}
      {/* Flexbox para centralizar */}
      <button
        {...props}
        className={`${button({ color, className })} mb-4`} // Adicionando margem inferior ao botão
        style={{ width: 'auto', whiteSpace: 'nowrap' }} // Previne quebra de linha e ajusta a largura automaticamente
      >
        <p className="inline-flex items-center space-x-2 font-inter bg-white text-xs md:text-base font-normal border-2 px-3 py-1 rounded-full">
          {title}
        </p>
        <p className="text-xs font-medium italic md:text-base">{content}</p>
        <ArrowRight size={15} />
      </button>
      <h2
        className={`${classTexto} text-2xl md:text-5xl font-inter  md:max-w-90 text-center text-secondary font-semibold`}
      >
        {posTexto}
      </h2>
      <p
        className={`${classTexto} md:text-base text-sm md:mt-[24px] mt-2 text-center max-w-72 md:max-w-[768px] font-inter italic text-[#475467] `}
      >
        {textoFinal}
      </p>
    </div>
  )
}
