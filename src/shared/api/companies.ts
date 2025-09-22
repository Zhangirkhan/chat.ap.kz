import { apiClient } from './client'
import { API_CONFIG } from '@/shared/config/api'

export interface Company {
  id: number
  name: string
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
  is_active: boolean
  clients_count?: number
  clients?: Client[]
  created_at: string
  updated_at: string
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
  company_id?: number
  company?: Company
  created_at: string
  updated_at: string
}

export interface CreateCompanyData {
  name: string
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
  is_active?: boolean
}

export interface UpdateCompanyData {
  name?: string
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
  is_active?: boolean
}

export interface CompaniesListParams {
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

export class CompaniesApi {
  async getCompanies(params?: CompaniesListParams): Promise<PaginatedResponse<Company>> {
    const response = await apiClient.get<PaginatedResponse<Company>>(API_CONFIG.ENDPOINTS.COMPANIES, params)

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

  async getCompany(id: number): Promise<{ company: Company }> {
    const response = await apiClient.get<{ company: Company }>(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`)
    return response.data
  }

  async createCompany(data: CreateCompanyData): Promise<{ company: Company }> {
    const response = await apiClient.post<{ company: Company }>(API_CONFIG.ENDPOINTS.COMPANIES, data)
    return response.data
  }

  async updateCompany(id: number, data: UpdateCompanyData): Promise<{ company: Company }> {
    const response = await apiClient.put<{ company: Company }>(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`, data)
    return response.data
  }

  async deleteCompany(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`)
  }

  async getCompanyClients(id: number): Promise<{ clients: Client[] }> {
    const response = await apiClient.get<{ clients: Client[] }>(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}/clients`)
    return response.data
  }
}

export const companiesApi = new CompaniesApi()
