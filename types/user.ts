// types/user.ts
export interface IUserProfile {
  _id: string
  uid: string
  email: string
  displayName: string
  role: string
  campus: string
  emailDomain: string
  siape?: string
  matricula?: string
  course?: string
  profilePicture?: {
    contentType: string
    data: Buffer
  }
  connections?: Record<string, boolean>
  favorites?: Record<string, boolean>
  createdAt: Date
  lastLogin?: Date
}
