export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  description?: string
  created_at: string
  updated_at: string
}

export interface UserFormData {
  name: string
  email: string
  role: UserRole
  is_active: boolean
  description: string
}

export type UserRole = 'admin' | 'user' | 'manager'

export interface UserFormErrors {
  name?: string
  email?: string
  role?: string
  is_active?: string
  description?: string
}

export interface UserFormOptions {
  userId?: string
  initialData?: Partial<UserFormData>
  onSuccess?: (user: UserFormData) => void
  onCancel?: () => void
}
