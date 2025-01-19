import { NegocioType } from './businessTypes'

export interface IniciativaBase {
  id_negocio: string
  nome: string
  descricao: string
  tipo_negocio: NegocioType
  membros?: string[]
  data_criacao: string
}

export interface IniciativaCreateAndUpdate extends IniciativaBase {}

export interface IniciativaResponse extends IniciativaBase {
  id: string
  status: 'pendente' | 'aprovado' | 'recusado'
  visivel: boolean
}

export type InitiativeStatus = 'aprovado' | 'pendente' | 'recusado'
