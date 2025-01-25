export enum NegocioType {
  INCUBADO = 'partec',
  EXTERNO = 'externo',
}

interface NegocioBase {
  nome: string
  email: string
  telefone: string
  tipo_negocio: NegocioType
  palavras_chave: string[]
  midias_sociais?: Record<string, string>
}

interface NegocioIncubadoFields {
  id_iniciativas?: string[]
  descricao_problema?: string
  area_estrategica?: string
  campus?: string
}

interface NegocioExternoFields {
  cnae?: string
  area_de_atuacao?: string
  demanda?: string
}

export interface NegocioIncubado extends NegocioBase, NegocioIncubadoFields {
  tipo_negocio: NegocioType.INCUBADO
}

export interface NegocioExterno extends NegocioBase, NegocioExternoFields {
  tipo_negocio: NegocioType.EXTERNO
}

export type NegocioCreate = NegocioIncubado | NegocioExterno

export type NegocioUpdate = Partial<
  NegocioBase & NegocioIncubadoFields & NegocioExternoFields
>

export interface NegocioResponse extends NegocioBase {
  data_cadastro: string | number | Date
  id: string
  logo: string
  uid_admin: string
  status: string
  visivel: boolean
  tipo_negocio: NegocioType
  id_iniciativas?: string[]
  descricao_problema?: string
  area_estrategica?: string
  campus?: string
  cnae?: string
  area_de_atuacao?: string
  demanda?: string
}

export type BusinessesByAdminResponse = {
  all: NegocioResponse[]
  aprovados: NegocioResponse[]
  recusados: NegocioResponse[]
  pendentes: NegocioResponse[]
}

export type BusinessStatus = 'aprovado' | 'pendente' | 'recusado'
