export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
  code?: number
  timestamp?: string
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  position?: string
  role: 'admin' | 'supervisor' | 'manager' | 'operator' | 'user'
  organization_id?: number
  organization?: Organization
  department_id?: number
  department?: Department
  position_id?: number
  user_position?: Position
  permissions: string[]
  roles: string[]
  status: 'active' | 'inactive' | 'blocked'
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
  token_type: string
  expires_in?: number
}

export interface UserStats {
  total_chats: number
  active_chats: number
  messages_sent: number
  unread_notifications: number
}

export interface Chat {
  id: number
  client_name: string
  client_phone: string
  client_email?: string
  status: 'active' | 'closed' | 'transferred'
  created_at: string
  updated_at: string
  user?: User
  assigned_user?: User
  messages: Message[]
  messages_count?: number
  unread_count: number
  last_message?: Message
}

export interface Message {
  id: number
  message: string
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'system'
  is_from_client: boolean
  file_path?: string
  file_name?: string
  file_size?: number
  created_at: string
  is_read: boolean
  read_at?: string
  user?: User
}

// Типы для создания и обновления чатов
export interface CreateChatData {
  client_name: string
  client_phone: string
  client_email?: string
  message: string
  department_id?: number
}

export interface UpdateChatData {
  client_name?: string
  client_phone?: string
  client_email?: string
  status?: 'active' | 'closed' | 'transferred'
  assigned_to?: number
}

// Типы для сообщений
export interface SendMessageData {
  message: string
  type?: 'text' | 'image' | 'video' | 'audio' | 'file'
  file?: File
}

export interface SystemMessageData {
  message: string
}

// WebSocket события
export interface WebSocketEvent {
  type: 'message' | 'chat_update' | 'user_typing' | 'user_online' | 'user_offline'
  data: any
  timestamp: string
}

export interface TypingEvent {
  chat_id: number
  user_id: number
  user_name: string
  is_typing: boolean
}

export interface OnlineStatusEvent {
  user_id: number
  is_online: boolean
  last_seen?: string
}

export interface Organization {
  id: number
  name: string
  slug?: string
  email?: string
  phone?: string
  address?: string
  description?: string
  users_count: number
  departments_count: number
  status: 'active' | 'inactive' | 'blocked'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  name: string
  description?: string
  organization_id: number
  organization?: Organization
  users_count: number
  supervisors_count: number
  managers_count: number
  supervisors?: User[] // Руководители отдела
  managers?: User[] // Менеджеры отдела
  status: 'active' | 'inactive'
  show_in_chatbot: boolean // Показывать в чат-боте
  chatbot_order: number // Порядок в чат-боте
  created_at: string
  updated_at: string
}

export interface Position {
  id: number
  name: string
  description?: string
  department_id?: number
  department?: Department
  status: 'active' | 'inactive'
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}


export interface UpdateProfileData {
  name?: string
  phone?: string
  position?: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

// Типы для создания и обновления
export interface CreateOrganizationData {
  name: string
  email?: string
  phone?: string
  address?: string
  description?: string
}

export interface UpdateOrganizationData {
  name?: string
  email?: string
  phone?: string
  address?: string
  description?: string
  status?: 'active' | 'inactive' | 'blocked'
}

export interface CreateDepartmentData {
  name: string
  description?: string
  organization_id: number
  status?: 'active' | 'inactive'
  show_in_chatbot?: boolean
  chatbot_order?: number
  manager?: string
}

export interface UpdateDepartmentData {
  name?: string
  description?: string
  organization_id?: number
  status?: 'active' | 'inactive'
  show_in_chatbot?: boolean
  chatbot_order?: number
  manager?: string
}

export interface CreatePositionData {
  name: string
  description?: string
  department_id?: number
}

export interface UpdatePositionData {
  name?: string
  description?: string
  department_id?: number
  status?: 'active' | 'inactive'
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  position?: string
  role: 'admin' | 'supervisor' | 'manager' | 'operator' | 'user'
  organization_id?: number
  department_id?: number
  position_id?: number
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  position?: string
  role?: 'admin' | 'supervisor' | 'manager' | 'operator' | 'user'
  organization_id?: number
  department_id?: number
  position_id?: number
  status?: 'active' | 'inactive' | 'blocked'
}

// Типы для управления руководителями и менеджерами отделов
export interface AssignDepartmentSupervisorData {
  user_id: number
  department_id: number
}

export interface AssignDepartmentManagerData {
  user_id: number
  department_id: number
}

export interface RemoveDepartmentSupervisorData {
  user_id: number
  department_id: number
}

export interface RemoveDepartmentManagerData {
  user_id: number
  department_id: number
}

// Типы для ролей и разрешений
export interface Role {
  id: number
  name: string
  display_name: string
  description?: string
  permissions: string[]
  level: number // Уровень доступа (1-5)
}

export interface Permission {
  id: number
  name: string
  display_name: string
  description?: string
  category: string
}
