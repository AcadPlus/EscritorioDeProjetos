export interface IUser {
  uid: string
  displayName: string
  photoURL: string
  role: string
  campus: string
  email: string
  phone: string
  course: string
  createdAt: string
  lastLogin: string
}

export interface IRequest {
  [uid: string]: [string, string, string]
}

export interface UserCardProps {
  user: IUser
  showActions?: boolean
  renderActionButtons: (user: IUser) => React.ReactNode
  renderStatusTag: (user: IUser) => React.ReactNode
  onViewProfile: (user: IUser) => void
}

export interface ProfileModalProps {
  user: IUser
  isOpen: boolean
  onClose: () => void
}
