export enum EventStatus {
  ATIVO = 'ativo',
  CANCELADO = 'cancelado',
  CONCLUIDO = 'concluido',
}

export enum ParticipanteStatus {
  INSCRITO = 'inscrito',
  PRESENTE = 'presente',
  AUSENTE = 'ausente',
}

export interface Participante {
  uid_usuario: string
  status: ParticipanteStatus
  data_inscricao: string
  data_presenca?: string
  certificado_url?: string
}

export interface EventBase {
  titulo: string
  descricao: string
  data_inicio: string
  data_fim: string
  local: string
  business_id: string
  uid_owner: string
  logo_url?: string
  fotos?: string[]
}

export interface EventCreate extends EventBase {
  uid?: string
}

export interface EventUpdate extends Partial<EventBase> {
  status?: EventStatus
}

export interface EventResponse extends EventBase {
  uid: string
  status: EventStatus
  participantes: Participante[]
  created_at: string
  updated_at: string
}
