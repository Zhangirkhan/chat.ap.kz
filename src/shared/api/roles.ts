import { apiClient } from './client'
import { API_CONFIG } from '@/shared/config/api'

export interface Role {
  id: number
  name: string
  display_name: string
  description?: string
  permissions: string[]
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface CreateRoleData {
  name: string
  display_name: string
  description?: string
  permissions: string[]
}

export interface UpdateRoleData {
  name?: string
  display_name?: string
  description?: string
  permissions?: string[]
}

export interface RolesListParams {
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

export class RolesApi {
  async getRoles(params?: RolesListParams): Promise<PaginatedResponse<Role>> {
    const response = await apiClient.get<PaginatedResponse<Role>>(API_CONFIG.ENDPOINTS.ROLES, params)
    return response.data
  }

  async getRole(id: number): Promise<{ role: Role }> {
    const response = await apiClient.get<{ role: Role }>(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`)
    return response.data
  }

  async createRole(data: CreateRoleData): Promise<{ role: Role }> {
    const response = await apiClient.post<{ role: Role }>(API_CONFIG.ENDPOINTS.ROLES, data)
    return response.data
  }

  async updateRole(id: number, data: UpdateRoleData): Promise<{ role: Role }> {
    const response = await apiClient.put<{ role: Role }>(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, data)
    return response.data
  }

  async deleteRole(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`)
  }

  // Получение всех разрешений
  async getPermissions(): Promise<{ permissions: string[] }> {
    const response = await apiClient.get<{ permissions: string[] }>(API_CONFIG.ENDPOINTS.PERMISSIONS)
    return response.data
  }
}

export const rolesApi = new RolesApi()

// Предопределенные роли
export const SYSTEM_ROLES = [
  { value: 'super_admin', label: 'Супер администратор', description: 'Полный доступ ко всем функциям системы' },
  { value: 'admin', label: 'Администратор', description: 'Административные права в рамках организации' },
  { value: 'manager', label: 'Менеджер', description: 'Управление отделом и сотрудниками' },
  { value: 'operator', label: 'Оператор', description: 'Работа с чатами и клиентами' },
  { value: 'viewer', label: 'Наблюдатель', description: 'Только просмотр данных' }
]

// Группы разрешений
export const PERMISSION_GROUPS = {
  users: {
    label: 'Пользователи',
    permissions: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'users.activate',
      'users.deactivate'
    ]
  },
  organizations: {
    label: 'Организации',
    permissions: [
      'organizations.view',
      'organizations.create',
      'organizations.edit',
      'organizations.delete'
    ]
  },
  departments: {
    label: 'Отделы',
    permissions: [
      'departments.view',
      'departments.create',
      'departments.edit',
      'departments.delete'
    ]
  },
  positions: {
    label: 'Должности',
    permissions: [
      'positions.view',
      'positions.create',
      'positions.edit',
      'positions.delete'
    ]
  },
  roles: {
    label: 'Роли',
    permissions: [
      'roles.view',
      'roles.create',
      'roles.edit',
      'roles.delete'
    ]
  },
  chats: {
    label: 'Чаты',
    permissions: [
      'chats.view',
      'chats.create',
      'chats.edit',
      'chats.delete',
      'chats.assign',
      'chats.transfer'
    ]
  },
  clients: {
    label: 'Клиенты',
    permissions: [
      'clients.view',
      'clients.create',
      'clients.edit',
      'clients.delete'
    ]
  },
  contractors: {
    label: 'Контрагенты',
    permissions: [
      'contractors.view',
      'contractors.create',
      'contractors.edit',
      'contractors.delete'
    ]
  },
  templates: {
    label: 'Шаблоны',
    permissions: [
      'templates.view',
      'templates.create',
      'templates.edit',
      'templates.delete'
    ]
  },
  broadcasts: {
    label: 'Рассылки',
    permissions: [
      'broadcasts.view',
      'broadcasts.create',
      'broadcasts.edit',
      'broadcasts.delete',
      'broadcasts.send'
    ]
  },
  reports: {
    label: 'Отчеты',
    permissions: [
      'reports.view',
      'reports.export'
    ]
  },
  settings: {
    label: 'Настройки',
    permissions: [
      'settings.view',
      'settings.edit'
    ]
  }
}
