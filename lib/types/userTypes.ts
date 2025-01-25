/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UserType {
  ESTUDANTE = 'estudante',
  PESQUISADOR = 'pesquisador',
  EXTERNO = 'externo',
}

export enum UserTypeDomain {
  'estudante' = '@alu.ufc.br',
  'pesquisador' = '@ufc.br',
}

interface RedesSociais {
  linkedin?: string
  twitter?: string
}

export interface UserBaseCreate {
  nome: string
  email: string
  senha: string
  telefone: string
  conexoes: string[]
  negocios: string[]
  redes_sociais?: RedesSociais
  tipo_usuario: UserType
}

export interface PesquisadorCreate extends UserBaseCreate {
  lattes: string
  palavras_chave: string[]
  campus: string
}

export interface EstudanteCreate extends UserBaseCreate {
  curso: string
  campus: string
}

export interface ExternoCreate extends UserBaseCreate {
  empresa?: string
  cargo?: string
}

export type UserCreateData = PesquisadorCreate | EstudanteCreate | ExternoCreate

export interface UserWithType {
  tipo_usuario: UserType
  [key: string]: any // This allows for any additional properties
}

export function isEstudante(user: UserWithType): user is EstudanteCreate {
  return user.tipo_usuario === UserType.ESTUDANTE
}

export function isPesquisador(user: UserWithType): user is PesquisadorCreate {
  return user.tipo_usuario === UserType.PESQUISADOR
}

export function isExterno(user: UserWithType): user is ExternoCreate {
  return user.tipo_usuario === UserType.EXTERNO
}
