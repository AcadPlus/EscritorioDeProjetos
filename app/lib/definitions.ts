import { ComponentProps } from 'react'

export type BadgeProps = ComponentProps<'button'> & {
  tittle: string
  content: string
}

export type InputButtonProps = ComponentProps<'input'> & {
  name: string
  className?: string
}

export type TextAreaProps = ComponentProps<'textarea'> & {
  name: string
}

export type ButtonProps = ComponentProps<'button'> & {
  name: string
}

export type CardProps = {
  id?: number
  title: string
  description: string
  items: string[]
}

export type RadioButtomProps = ComponentProps<'input'> & {
  tittle: string
  content: string
}
