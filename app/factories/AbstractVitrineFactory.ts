/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'

export interface AbstractVitrineFactory {
  createSchema(): z.ZodObject<any>
  createFields(): Array<{
    name: string
    label: string
    type?: string
    options?: string[]
  }>
  getTitle(): string
  getType(): 'startup'
}
