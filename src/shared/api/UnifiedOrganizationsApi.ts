import { BaseApi, type PaginatedResponse, type ListParams } from './BaseApi'
import { API_CONFIG } from '@/shared/config/api'

export interface Organization {
  id: number
  name: string
  slug?: string
  description?: string
  domain?: string
  phone: string
  webhook_url?: string
  webhook_token?: string
  wazzup24_enabled?: boolean
  wazzup24_api_key?: string
  wazzup24_channel_id?: string
  wazzup24_webhook_url?: string
  wazzup24_settings?: Record<string, unknown>
  is_active: boolean
  departments_count?: number
  users_count?: number
  created_at: string
  updated_at: string
}

export interface OrganizationsListParams extends ListParams {
  is_active?: boolean
  wazzup24_enabled?: boolean
}

export class UnifiedOrganizationsApi extends BaseApi {
  async getOrganizations(params?: OrganizationsListParams): Promise<PaginatedResponse<Organization>> {
    return this.getPaginated<Organization>(API_CONFIG.ENDPOINTS.ORGANIZATIONS, params)
  }

  async getOrganization(id: number): Promise<Organization> {
    return this.get<Organization>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`)
  }

  async createOrganization(data: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'departments_count' | 'users_count'>): Promise<Organization> {
    return this.post<Organization>(API_CONFIG.ENDPOINTS.ORGANIZATIONS, data)
  }

  async updateOrganization(id: number, data: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'departments_count' | 'users_count'>>): Promise<Organization> {
    return this.put<Organization>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`, data)
  }

  async deleteOrganization(id: number): Promise<void> {
    return this.delete<void>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`)
  }

  async getWazzupChannels(id: number): Promise<{ success: boolean; channels?: any[]; error?: string }> {
    return this.get<{ success: boolean; channels?: any[]; error?: string }>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}/wazzup-channels`)
  }

  async setupWazzupWebhooks(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.post<{ success: boolean; message?: string; error?: string }>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}/setup-wazzup-webhooks`)
  }
}

export const unifiedOrganizationsApi = new UnifiedOrganizationsApi()
