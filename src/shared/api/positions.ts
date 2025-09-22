import { apiClient } from './client'

export interface Position {
  id: number
  name: string
  slug: string
  description?: string
  permissions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  users_count?: number
  organization_id?: number
  department_id?: number
}

export interface CreatePositionData {
  name: string
  slug?: string
  description?: string
  permissions?: string[]
  is_active?: boolean
}

export interface UpdatePositionData {
  name?: string
  slug?: string
  description?: string
  permissions?: string[]
  is_active?: boolean
}

export interface PositionsListParams {
  per_page?: number
  search?: string
  page?: number
  [key: string]: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export class PositionsApi {
  async getPositions(params?: PositionsListParams): Promise<PaginatedResponse<Position>> {
    return apiClient.get<PaginatedResponse<Position>>('/positions', params)
  }

  async getPosition(id: number): Promise<{ position: Position }> {
    return apiClient.get<{ position: Position }>(`/positions/${id}`)
  }

  async createPosition(data: CreatePositionData): Promise<{ position: Position }> {
    return apiClient.post<{ position: Position }>('/positions', data)
  }

  async updatePosition(id: number, data: UpdatePositionData): Promise<{ position: Position }> {
    return apiClient.put<{ position: Position }>(`/positions/${id}`, data)
  }

  async deletePosition(id: number): Promise<null> {
    return apiClient.delete<null>(`/positions/${id}`)
  }
}

export const positionsApi = new PositionsApi()

// Доступные разрешения
export const AVAILABLE_PERMISSIONS = [
  // Базовые разрешения
  { value: 'read_chats', label: 'Чтение чатов' },
  { value: 'write_messages', label: 'Написание сообщений' },
  { value: 'manage_own_profile', label: 'Управление собственным профилем' },

  // Расширенные разрешения
  { value: 'manage_clients', label: 'Управление клиентами' },
  { value: 'view_reports', label: 'Просмотр отчетов' },
  { value: 'manage_team', label: 'Управление командой' },
  { value: 'view_analytics', label: 'Просмотр аналитики' },
  { value: 'manage_organizations', label: 'Управление организациями' },
  { value: 'manage_departments', label: 'Управление отделами' },
  { value: 'manage_positions', label: 'Управление должностями' },
  { value: 'manage_users', label: 'Управление пользователями' },

  // Административные разрешения
  { value: 'admin_access', label: 'Административный доступ' },
  { value: 'system_settings', label: 'Настройки системы' },
  { value: 'view_logs', label: 'Просмотр логов' }
]
