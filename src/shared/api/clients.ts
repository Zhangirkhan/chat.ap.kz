import { apiClient } from './client'
import { API_CONFIG } from '@/shared/config/api'

export interface Client {
  id: number
  name: string
  phone: string
  email?: string
  uuid_wazzup?: string
  comment?: string
  avatar?: string
  is_active: boolean
  company_id?: number
  company?: Company
  contractor_id?: number
  contractor?: Contractor
  created_at: string
  updated_at: string
}

export interface Company {
  id: number
  name: string
  inn?: string
  is_active: boolean
}

export interface Contractor {
  id: number
  name: string
  type: 'legal' | 'individual'
  is_active: boolean
}

export interface CreateClientData {
  name: string
  phone: string
  email?: string
  uuid_wazzup?: string
  comment?: string
  avatar?: string
  company_id?: number
  contractor_id?: number
  is_active?: boolean
}

export interface UpdateClientData {
  name?: string
  phone?: string
  email?: string
  uuid_wazzup?: string
  comment?: string
  avatar?: string
  company_id?: number
  contractor_id?: number
  is_active?: boolean
}

export interface ClientsListParams {
  per_page?: number
  search?: string
  page?: number
  company_id?: number
  contractor_id?: number
  is_individual?: boolean
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

export class ClientsApi {
  async getClients(params?: ClientsListParams): Promise<PaginatedResponse<Client>> {
    const response = await apiClient.get<PaginatedResponse<Client>>(API_CONFIG.ENDPOINTS.CLIENTS, params)

    // Проверяем формат ответа и возвращаем данные
    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: params?.per_page || 50,
          total: response.data.length
        }
      }
    }

    // Если ответ уже в правильном формате
    return response.data || response
  }

  async getClient(id: number): Promise<{ client: Client }> {
    const response = await apiClient.get<{ client: Client }>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`)
    return response.data
  }

  async createClient(data: CreateClientData): Promise<{ client: Client }> {
    const response = await apiClient.post<{ client: Client }>(API_CONFIG.ENDPOINTS.CLIENTS, data)
    return response.data
  }

  async updateClient(id: number, data: UpdateClientData): Promise<{ client: Client }> {
    const response = await apiClient.put<{ client: Client }>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`, data)
    return response.data
  }

  async deleteClient(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`)
  }

  async getIndividualClients(params?: ClientsListParams): Promise<PaginatedResponse<Client>> {
    const response = await apiClient.get<PaginatedResponse<Client>>(`${API_CONFIG.ENDPOINTS.CLIENTS}/individuals`, params)
    return response.data || response
  }

  async getCorporateClients(params?: ClientsListParams): Promise<PaginatedResponse<Client>> {
    const response = await apiClient.get<PaginatedResponse<Client>>(`${API_CONFIG.ENDPOINTS.CLIENTS}/corporate`, params)
    return response.data || response
  }

  async attachContractor(id: number, contractorId: number): Promise<{ client: Client }> {
    const response = await apiClient.post<{ client: Client }>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}/attach-contractor`, { contractor_id: contractorId })
    return response.data
  }

  async detachContractor(id: number): Promise<{ client: Client }> {
    const response = await apiClient.post<{ client: Client }>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}/detach-contractor`)
    return response.data
  }
}

export const clientsApi = new ClientsApi()
