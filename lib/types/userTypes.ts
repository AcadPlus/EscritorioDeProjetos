/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UserType {
  ESTUDANTE = 'estudante',
  PESQUISADOR = 'pesquisador',
  EXTERNO = 'externo',
  ADMIN = 'admin',
}

export enum PublicUserType {
  ESTUDANTE = 'estudante',
  PESQUISADOR = 'pesquisador',
  EXTERNO = 'externo',
}

export type SelectableUserType = Exclude<UserType, UserType.ADMIN>

export const userTypeLabels: Record<UserType, string> = {
  [UserType.ESTUDANTE]: 'Estudante',
  [UserType.PESQUISADOR]: 'Pesquisador',
  [UserType.EXTERNO]: 'Externo',
  [UserType.ADMIN]: 'Administrador',
}

export enum UserTypeDomain {
  'estudante' = '@alu.ufc.br',
  'pesquisador' = '@ufc.br',
}

export enum CampusType {
  RUSSAS = 'Russas',
  PICI = 'Pici',
  PORANGABUSSU = 'Porangabussu',
  CRATEUS = 'Crateús',
  QUIXADA = 'Quixadá',
  BENFICA = 'Benfica',
  ITAPAJE = 'Itapajé',
  SOBRAL = 'Sobral',
}

export const campusOptions = Object.values(CampusType)

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
  tipo_usuario: PublicUserType
  foto_url?: string
}

export interface PesquisadorCreate extends UserBaseCreate {
  lattes: string
  siape: string
  palavras_chave: string[]
  campus: CampusType
}

export interface EstudanteCreate extends UserBaseCreate {
  curso: string
  campus: CampusType
  matricula: string
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
