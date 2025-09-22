import { apiClient } from './client'
import { API_CONFIG } from '@/shared/config/api'

export interface Contractor {
  id: number
  name: string
  type: 'legal' | 'individual'
  inn?: string
  kpp?: string
  ogrn?: string
  legal_address?: string
  actual_address?: string
  phone?: string
  email?: string
  website?: string
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  bank_name?: string
  bank_account?: string
  bik?: string
  // Поля для физических лиц
  passport_series?: string
  passport_number?: string
  passport_issued_by?: string
  passport_issued_date?: string
  address?: string
  organization_id?: number
  status?: string
  is_active: boolean
  created_at: string
  updated_at: string
  clients_count?: number
  clients?: Client[]
}

export interface Client {
  id: number
  name: string
  phone: string
  email?: string
  uuid_wazzup?: string
  comment?: string
  avatar?: string
  is_active: boolean
  contractor_id?: number
  contractor?: Contractor
  created_at: string
  updated_at: string
}

export interface CreateContractorData {
  name: string
  type: 'legal' | 'individual'
  inn?: string
  kpp?: string
  ogrn?: string
  legal_address?: string
  actual_address?: string
  phone?: string
  email?: string
  website?: string
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  bank_name?: string
  bank_account?: string
  bik?: string
  // Поля для физических лиц
  passport_series?: string
  passport_number?: string
  passport_issued_by?: string
  passport_issued_date?: string
  address?: string
  is_active?: boolean
}

export interface UpdateContractorData {
  name?: string
  type?: 'legal' | 'individual'
  inn?: string
  kpp?: string
  ogrn?: string
  legal_address?: string
  actual_address?: string
  phone?: string
  email?: string
  website?: string
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  bank_name?: string
  bank_account?: string
  bik?: string
  // Поля для физических лиц
  passport_series?: string
  passport_number?: string
  passport_issued_by?: string
  passport_issued_date?: string
  address?: string
  is_active?: boolean
}

export interface ContractorsListParams {
  per_page?: number
  search?: string
  page?: number
  type?: 'legal' | 'individual'
  organization_id?: number
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

export class ContractorsApi {
  async getContractors(params?: ContractorsListParams): Promise<PaginatedResponse<Contractor>> {
    const response = await apiClient.get<PaginatedResponse<Contractor>>(API_CONFIG.ENDPOINTS.CONTRACTORS, params)

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

  async getContractor(id: number): Promise<{ contractor: Contractor }> {
    const response = await apiClient.get<{ contractor: Contractor }>(`${API_CONFIG.ENDPOINTS.CONTRACTORS}/${id}`)
    return response.data
  }

  async createContractor(data: CreateContractorData): Promise<{ contractor: Contractor }> {
    const response = await apiClient.post<{ contractor: Contractor }>(API_CONFIG.ENDPOINTS.CONTRACTORS, data)
    return response.data
  }

  async updateContractor(id: number, data: UpdateContractorData): Promise<{ contractor: Contractor }> {
    const response = await apiClient.put<{ contractor: Contractor }>(`${API_CONFIG.ENDPOINTS.CONTRACTORS}/${id}`, data)
    return response.data
  }

  async deleteContractor(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.CONTRACTORS}/${id}`)
  }

  async getContractorClients(id: number): Promise<{ clients: Client[] }> {
    const response = await apiClient.get<{ clients: Client[] }>(`${API_CONFIG.ENDPOINTS.CONTRACTORS}/${id}/clients`)
    return response.data
  }

  async addClientToContractor(contractorId: number, clientId: number): Promise<{ contractor_client: any }> {
    const response = await apiClient.post<{ contractor_client: any }>(`${API_CONFIG.ENDPOINTS.CONTRACTORS}/${contractorId}/clients`, { client_id: clientId })
    return response.data
  }

  async removeClientFromContractor(contractorId: number, clientId: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.CONTRACTORS}/${contractorId}/clients/${clientId}`)
  }
}

export const contractorsApi = new ContractorsApi()

// Типы контрагентов
export const CONTRACTOR_TYPES = [
  { value: 'legal', label: 'Юридическое лицо', description: 'Организация с полными реквизитами' },
  { value: 'individual', label: 'Физическое лицо', description: 'Частное лицо с паспортными данными' }
]
