export enum StatusIniciativa {
  PENDENTE = 'PENDENTE',
  ATIVA = 'ATIVA',
  PAUSADA = 'PAUSADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  RECUSADA = 'RECUSADA',
}

export enum PublicStatusIniciativa {
  ATIVA = 'ATIVA',
  CONCLUIDA = 'CONCLUIDA',
}

export enum TipoIniciativa {
  PESQUISA = 'PESQUISA',
  INOVACAO = 'INOVACAO',
  EMPREENDEDORISMO = 'EMPREENDEDORISMO',
  EXTENSAO = 'EXTENSAO',
  OUTROS = 'OUTROS',
}

export enum StatusVinculo {
  PENDENTE = 'PENDENTE',
  ACEITO = 'ACEITO',
  RECUSADO = 'RECUSADO',
}

export enum PapelIniciativa {
  COORDENADOR = 'COORDENADOR',
  PESQUISADOR = 'PESQUISADOR',
  DESENVOLVEDOR = 'DESENVOLVEDOR',
  COLABORADOR = 'COLABORADOR',
  MEMBRO = 'MEMBRO',
}

export enum TipoNotificacao {
  CONVITE_INICIATIVA = 'CONVITE_INICIATIVA',
  CONVITE_ACEITO = 'CONVITE_ACEITO',
  CONVITE_RECUSADO = 'CONVITE_RECUSADO',
  NOVO_SEGUIDOR = 'NOVO_SEGUIDOR',
  REMOCAO_INICIATIVA = 'REMOCAO_INICIATIVA',
}

export interface MembroIniciativa {
  user_id: string
  papel: PapelIniciativa
  status: StatusVinculo
  data_vinculo: string
}

export interface Participante {
  uid: string
  papel: PapelIniciativa
  status_vinculo: StatusVinculo
  data_inicio: string
  data_fim?: string
  dedicacao_horas?: number
  data_ultima_atualizacao: string
}

export interface IniciativaBase {
  id: any
  created_at: number
  uid: string
  titulo: string
  descricao: string
  tipo: TipoIniciativa
  status: StatusIniciativa
  data_inicio: string
  data_fim?: string
  visivel: boolean
  participantes: Participante[]
  seguidores: string[]
  recursos_necessarios?: string
  resultados_esperados?: string
  laboratorios?: string[]
  palavras_chave?: string[]
  data_cadastro: string
  data_ultima_atualizacao: string
  uid_owner: string
  business_id?: string
}

export interface IniciativaCreate {
  titulo: string
  descricao: string
  tipo: TipoIniciativa
  data_inicio: string
  data_fim?: string
  visivel?: boolean
}

export interface IniciativaUpdate {
  titulo?: string
  descricao?: string
  tipo?: TipoIniciativa
  status?: StatusIniciativa
  data_inicio?: string
  data_fim?: string
  visivel?: boolean
}

export interface IniciativaResponse {
  data: IniciativaBase
  message: string
}

export interface IniciativasResponse {
  data: IniciativaBase[]
  message: string
}

export interface IniciativasByStatus {
  pendentes: IniciativaBase[]
  ativas: IniciativaBase[]
  recusadas: IniciativaBase[]
}
