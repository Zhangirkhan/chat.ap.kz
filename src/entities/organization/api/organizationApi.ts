import { apiClient } from '@/shared/api/client'
import { API_CONFIG } from '@/shared/config/api'
import type { ApiResponse } from '@/shared/lib/types'
import type {
  Organization,
  CreateOrganizationData,
  UpdateOrganizationData
} from '@/shared/lib/types'

export const organizationApi = {
  // Получение списка организаций
  getOrganizations: (params?: { page?: number; per_page?: number; search?: string }): Promise<ApiResponse<Organization[]>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)

    const url = queryParams.toString() ? `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}?${queryParams}` : API_CONFIG.ENDPOINTS.ORGANIZATIONS
    return apiClient.get(url)
  },

  // Получение организации по ID
  getOrganizationById: (id: number): Promise<ApiResponse<Organization>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`)
  },

  // Создание организации
  createOrganization: (data: CreateOrganizationData): Promise<ApiResponse<Organization>> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.ORGANIZATIONS, data)
  },

  // Обновление организации
  updateOrganization: (id: number, data: UpdateOrganizationData): Promise<ApiResponse<Organization>> => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`, data)
  },

  // Удаление организации
  deleteOrganization: (id: number): Promise<ApiResponse<null>> => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`)
  },

  // Получение отделов организации
  getOrganizationDepartments: (organizationId: number): Promise<ApiResponse<Department[]>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${organizationId}/departments`)
  },

  // Получение пользователей организации
  getOrganizationUsers: (organizationId: number): Promise<ApiResponse<User[]>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${organizationId}/users`)
  },

  // Тестирование подключения к Wazzup24
  testWazzupConnection: (organizationId: number): Promise<ApiResponse<{success: boolean, error?: string, data?: unknown}>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${organizationId}/wazzup24/test-connection`, {})
  },

  // Получение каналов Wazzup24
  getWazzupChannels: (organizationId: number): Promise<ApiResponse<{success: boolean, channels?: unknown[], error?: string}>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${organizationId}/wazzup24/channels`)
  },

  // Настройка webhook'ов Wazzup24
  setupWazzupWebhooks: (organizationId: number): Promise<ApiResponse<{success: boolean, error?: string}>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${organizationId}/wazzup24/setup-webhooks`, {})
  }
}
