export enum UserType {
  ESTUDANTE = 'estudante',
  PESQUISADOR = 'pesquisador',
  EXTERNO = 'externo',
}

export enum UserTypeDomain {
  'estudante' = '@alu.ufc.br',
  'pesquisador' = '@ufc.br',
}

export interface UserBaseCreate {
  nome: string
  email: string
  senha: string
  tipo_usuario: UserType
  telefone: string
  conexoes: string[]
  negocios: string[]
}

export interface PesquisadorCreate extends UserBaseCreate {
  lattes: string
  redes_sociais?: {
    linkedin?: string
    twitter?: string
  }
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
