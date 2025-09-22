import { apiClient } from '@/shared/api/client'
import { API_CONFIG } from '@/shared/config/api'
import type { ApiResponse } from '@/shared/lib/types'
import type { User, UserStats } from '@/shared/lib/types'

import type {
  CreateUserData,
  UpdateUserData
} from '@/shared/lib/types'

export const userApi = {
  // Получение списка пользователей
  getUsers: (params?: { page?: number; per_page?: number; search?: string; organization_id?: number; department_id?: number; role?: string }): Promise<ApiResponse<User[]>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.organization_id) queryParams.append('organization_id', params.organization_id.toString())
    if (params?.department_id) queryParams.append('department_id', params.department_id.toString())
    if (params?.role) queryParams.append('role', params.role)

    const url = queryParams.toString() ? `${API_CONFIG.ENDPOINTS.USERS}?${queryParams}` : API_CONFIG.ENDPOINTS.USERS
    return apiClient.get(url)
  },

  // Получение пользователя по ID
  getUserById: (id: number): Promise<ApiResponse<User>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)
  },

  // Создание пользователя
  createUser: (data: CreateUserData): Promise<ApiResponse<User>> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.USERS, data)
  },

  // Обновление пользователя
  updateUser: (id: number, data: UpdateUserData): Promise<ApiResponse<User>> => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, data)
  },

  // Удаление пользователя
  deleteUser: (id: number): Promise<ApiResponse<null>> => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)
  },

  // Получение статистики пользователя
  getUserStats: (): Promise<ApiResponse<UserStats>> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.AUTH.STATS)
  }
}
