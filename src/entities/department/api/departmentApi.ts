import { apiClient } from '@/shared/api/client'
import { API_CONFIG } from '@/shared/config/api'
import type { ApiResponse } from '@/shared/lib/types'
import type {
  Department,
  CreateDepartmentData,
  UpdateDepartmentData,
  AssignDepartmentSupervisorData,
  AssignDepartmentManagerData,
  RemoveDepartmentSupervisorData,
  RemoveDepartmentManagerData
} from '@/shared/lib/types'

export const departmentApi = {
  // Получение списка отделов
  getDepartments: (params?: { page?: number; per_page?: number; search?: string; organization_id?: number }): Promise<ApiResponse<Department[]>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.organization_id) queryParams.append('organization_id', params.organization_id.toString())

    const url = queryParams.toString() ? `${API_CONFIG.ENDPOINTS.DEPARTMENTS}?${queryParams}` : API_CONFIG.ENDPOINTS.DEPARTMENTS
    return apiClient.get(url)
  },

  // Получение отдела по ID
  getDepartmentById: (id: number): Promise<ApiResponse<Department>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`)
  },

  // Создание отдела
  createDepartment: (data: CreateDepartmentData): Promise<ApiResponse<Department>> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.DEPARTMENTS, data)
  },

  // Обновление отдела
  updateDepartment: (id: number, data: UpdateDepartmentData): Promise<ApiResponse<Department>> => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, data)
  },

  // Удаление отдела
  deleteDepartment: (id: number): Promise<ApiResponse<null>> => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`)
  },

  // Получение пользователей отдела
  getDepartmentUsers: (departmentId: number): Promise<ApiResponse<User[]>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${departmentId}/users`)
  },

  // Получение руководителей отдела
  getDepartmentSupervisors: (departmentId: number): Promise<ApiResponse<User[]>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${departmentId}/supervisors`)
  },

  // Получение менеджеров отдела
  getDepartmentManagers: (departmentId: number): Promise<ApiResponse<User[]>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${departmentId}/managers`)
  },

  // Назначение руководителя отдела
  assignSupervisor: (data: AssignDepartmentSupervisorData): Promise<ApiResponse<Department>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.DEPARTMENT_SUPERVISORS}`, data)
  },

  // Назначение менеджера отдела
  assignManager: (data: AssignDepartmentManagerData): Promise<ApiResponse<Department>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.DEPARTMENT_MANAGERS}`, data)
  },

  // Удаление руководителя отдела
  removeSupervisor: (data: RemoveDepartmentSupervisorData): Promise<ApiResponse<null>> => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.DEPARTMENT_SUPERVISORS}`, { data })
  },

  // Удаление менеджера отдела
  removeManager: (data: RemoveDepartmentManagerData): Promise<ApiResponse<null>> => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.DEPARTMENT_MANAGERS}`, { data })
  }
}
