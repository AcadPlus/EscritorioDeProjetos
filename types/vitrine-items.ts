export type VitrineType = 'startup' | 'competencia' | 'laboratorio'

export interface BaseVitrineItem {
  _id: string
  id: string
  title: string
  description: string
  detailedDescription?: string
  tags: string[]
  logo: string | { data: string; contentType: string }
  email: string
  responsibleUser: string
  creatorId: string
  type: VitrineType
  createdAt: string
  updatedAt: string
}

export interface Startup extends BaseVitrineItem {
  type: 'startup'
  foundationYear: string
  sector: string
  stage: string
  website: string
}

export interface Laboratorio extends BaseVitrineItem {
  type: 'laboratorio'
  department: string
  researchArea: string
  equipment: string[]
  location: string
}

export interface Competencia extends BaseVitrineItem {
  type: 'competencia'
  area: string
  level: string
  experience: number
  curriculum: string
}

export type VitrineItem = Startup | Laboratorio | Competencia

export type SortType = 'recent' | 'oldest' | 'alphabetical'

export interface DecodedToken {
  uid: string
  [key: string]: unknown
}

export interface UserDisplayName {
  uid: string
  displayName: string
}
