import { JwtPayload } from 'jsonwebtoken'

export type VitrineType = 'startup' | 'competencia' | 'laboratorio'
export type SortType = 'recent' | 'oldest' | 'alphabetical'

export interface VitrineItem {
  _id: string
  id: string
  title: string
  description: string
  tags: string[]
  type: VitrineType
  responsibleUser: string
  creatorId: string
  createdAt: string
  updatedAt: string
}

export interface DecodedToken extends JwtPayload {
  uid: string
}

export interface UserDisplayName {
  uid: string
  displayName: string
}

export interface VitrineDataResponse {
  data: VitrineItem[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
}
