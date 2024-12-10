import { JwtPayload } from 'jsonwebtoken'

export type VitrineType = 'startup'

export interface VitrineItem {
  _id: string
  id: string
  title: string
  description: string
  foundationYear: string
  sector: string
  location: string
  website: string | null
  logo: string | { data: string; contentType: string } | null
  email: string
  responsibleUser: string
  creatorId: string
  createdAt: string
  updatedAt: string
  type: VitrineType
  tags: string[]
  problem: string
  solution: string
  strategicArea: string
  potentialImpact: string
}

export type Startup = VitrineItem

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

export type SortType = 'recent' | 'oldest' | 'alphabetical'
