import { BaseApi, type PaginatedResponse, type ListParams } from './BaseApi'
import { API_CONFIG } from '@/shared/config/api'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  position?: string
  department_id?: number
  department?: Department
  organization_id?: number
  organization?: Organization
  role: 'admin' | 'manager' | 'user'
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  name: string
  description?: string
  organization_id: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Organization {
  id: number
  name: string
  slug?: string
  is_active: boolean
}

export interface UsersListParams extends ListParams {
  department_id?: number
  organization_id?: number
  role?: string
  is_active?: boolean
}

export class UnifiedUsersApi extends BaseApi {
  async getUsers(params?: UsersListParams): Promise<PaginatedResponse<User>> {
    return this.getPaginated<User>(API_CONFIG.ENDPOINTS.USERS, params)
  }

  async getUser(id: number): Promise<User> {
    return this.get<User>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)
  }

  async createUser(data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at' | 'department' | 'organization'>): Promise<User> {
    return this.post<User>(API_CONFIG.ENDPOINTS.USERS, data)
  }

  async updateUser(id: number, data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at' | 'department' | 'organization'>>): Promise<User> {
    return this.put<User>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, data)
  }

  async deleteUser(id: number): Promise<void> {
    return this.delete<void>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)
  }

  async changePassword(id: number, password: string): Promise<void> {
    return this.post<void>(`${API_CONFIG.ENDPOINTS.USERS}/${id}/change-password`, { password })
  }

  async getUserStats(): Promise<{ total: number; active: number; inactive: number }> {
    return this.get<{ total: number; active: number; inactive: number }>(`${API_CONFIG.ENDPOINTS.USERS}/stats`)
  }
}

export const unifiedUsersApi = new UnifiedUsersApi()
