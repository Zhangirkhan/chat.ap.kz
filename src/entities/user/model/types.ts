export interface User {
  id: number
  name: string
  email: string
  phone?: string
  position?: string
  role: string
  organization?: {
    id: number
    name: string
  }
  permissions: string[]
  roles: string[]
  created_at: string
}

export interface UserStats {
  total_chats: number
  active_chats: number
  messages_sent: number
  unread_notifications: number
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  position?: string
  organization_id?: number
  role?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  position?: string
  role?: string
  organization_id?: number
}
