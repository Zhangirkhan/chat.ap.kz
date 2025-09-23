import { BaseApi, type PaginatedResponse, type ListParams } from './BaseApi'
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
  address?: string
  phone?: string
  email?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Contractor {
  id: number
  name: string
  phone?: string
  email?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClientsListParams extends ListParams {
  company_id?: number
  contractor_id?: number
  is_active?: boolean
}

export class UnifiedClientsApi extends BaseApi {
  async getClients(params?: ClientsListParams): Promise<PaginatedResponse<Client>> {
    return this.getPaginated<Client>(API_CONFIG.ENDPOINTS.CLIENTS, params)
  }

  async getClient(id: number): Promise<Client> {
    return this.get<Client>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`)
  }

  async createClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    return this.post<Client>(API_CONFIG.ENDPOINTS.CLIENTS, data)
  }

  async updateClient(id: number, data: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>): Promise<Client> {
    return this.put<Client>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`, data)
  }

  async deleteClient(id: number): Promise<void> {
    return this.delete<void>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}`)
  }

  async attachContractor(id: number, contractorId: number): Promise<Client> {
    return this.post<Client>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}/attach-contractor`, { contractor_id: contractorId })
  }

  async detachContractor(id: number): Promise<Client> {
    return this.post<Client>(`${API_CONFIG.ENDPOINTS.CLIENTS}/${id}/detach-contractor`)
  }
}

export const unifiedClientsApi = new UnifiedClientsApi()
