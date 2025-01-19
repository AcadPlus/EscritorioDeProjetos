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
  linkedin?: string;
  twitter?: string;
}

export interface UserBaseCreate {
  nome: string
  email: string
  senha: string
  tipo_usuario: UserType
  telefone: string
  conexoes: string[]
  negocios: string[]  
  redes_sociais?: RedesSociais
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
