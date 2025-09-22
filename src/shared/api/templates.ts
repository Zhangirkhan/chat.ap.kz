import { apiClient } from './client'
import { API_CONFIG } from '@/shared/config/api'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  position: string
  avatar?: string
  role: string
  department_id?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Organization {
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
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Template {
  id: number
  name: string
  content: string
  type: 'message' | 'email' | 'sms' | 'notification'
  category: 'greeting' | 'farewell' | 'support' | 'sales' | 'technical' | 'general'
  variables?: Record<string, string>
  language: 'ru' | 'en' | 'kk'
  is_active: boolean
  is_system: boolean
  usage_count: number
  created_at: string
  updated_at: string
  creator: User
  organization?: Organization
}

export interface CreateTemplateData {
  name: string
  content: string
  type: 'message' | 'email' | 'sms' | 'notification'
  category: 'greeting' | 'farewell' | 'support' | 'sales' | 'technical' | 'general'
  variables?: Record<string, string>
  language: 'ru' | 'en' | 'kk'
  is_active?: boolean
  organization_id?: number
}

export interface UpdateTemplateData {
  name?: string
  content?: string
  type?: 'message' | 'email' | 'sms' | 'notification'
  category?: 'greeting' | 'farewell' | 'support' | 'sales' | 'technical' | 'general'
  variables?: Record<string, string>
  language?: 'ru' | 'en' | 'kk'
  is_active?: boolean
}

export interface ProcessTemplateData {
  variables?: Record<string, string>
}

export interface ProcessedTemplate {
  template_id: number
  template_name: string
  original_content: string
  processed_content: string
  variables_used: Record<string, string>
}

export interface TemplateStats {
  total_templates: number
  active_templates: number
  system_templates: number
  user_templates: number
  by_type: Record<string, number>
  by_category: Record<string, number>
  most_used: Array<{
    id: number
    name: string
    usage_count: number
  }>
}

export interface TemplateOptions {
  types: string[]
  categories: string[]
  languages: string[]
}

export interface TemplatesListParams {
  per_page?: number
  search?: string
  page?: number
  type?: 'message' | 'email' | 'sms' | 'notification'
  category?: 'greeting' | 'farewell' | 'support' | 'sales' | 'technical' | 'general'
  language?: 'ru' | 'en' | 'kk'
  is_active?: boolean
  is_system?: boolean
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

export class TemplatesApi {
  async getTemplates(params?: TemplatesListParams): Promise<PaginatedResponse<Template>> {
    const response = await apiClient.get<PaginatedResponse<Template>>(API_CONFIG.ENDPOINTS.TEMPLATES, params)
    return response.data
  }

  async getTemplate(id: number): Promise<{ template: Template }> {
    const response = await apiClient.get<{ template: Template }>(`${API_CONFIG.ENDPOINTS.TEMPLATES}/${id}`)
    return response.data
  }

  async createTemplate(data: CreateTemplateData): Promise<{ template: Template }> {
    const response = await apiClient.post<{ template: Template }>(API_CONFIG.ENDPOINTS.TEMPLATES, data)
    return response.data
  }

  async updateTemplate(id: number, data: UpdateTemplateData): Promise<{ template: Template }> {
    const response = await apiClient.put<{ template: Template }>(`${API_CONFIG.ENDPOINTS.TEMPLATES}/${id}`, data)
    return response.data
  }

  async deleteTemplate(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.TEMPLATES}/${id}`)
  }

  // Специализированные эндпоинты
  async getTemplatesByType(type: string, params?: Omit<TemplatesListParams, 'type'>): Promise<PaginatedResponse<Template>> {
    const response = await apiClient.get<PaginatedResponse<Template>>(`${API_CONFIG.ENDPOINTS.TEMPLATES}/type/${type}`, params)
    return response.data
  }

  async getTemplatesByCategory(category: string, params?: Omit<TemplatesListParams, 'category'>): Promise<PaginatedResponse<Template>> {
    const response = await apiClient.get<PaginatedResponse<Template>>(`${API_CONFIG.ENDPOINTS.TEMPLATES}/category/${category}`, params)
    return response.data
  }

  async processTemplate(id: number, data: ProcessTemplateData): Promise<{ template_id: number; template_name: string; original_content: string; processed_content: string; variables_used: Record<string, string> }> {
    const response = await apiClient.post<{ template_id: number; template_name: string; original_content: string; processed_content: string; variables_used: Record<string, string> }>(`${API_CONFIG.ENDPOINTS.TEMPLATES}/${id}/process`, data)
    return response.data
  }

  async getTemplateStats(): Promise<TemplateStats> {
    const response = await apiClient.get<TemplateStats>(`${API_CONFIG.ENDPOINTS.TEMPLATES}/stats`)
    return response.data
  }

  async getTemplateOptions(): Promise<TemplateOptions> {
    const response = await apiClient.get<TemplateOptions>(`${API_CONFIG.ENDPOINTS.TEMPLATES}/options`)
    return response.data
  }
}

export const templatesApi = new TemplatesApi()

// Константы для шаблонов
export const TEMPLATE_TYPES = [
  { value: 'message', label: 'Сообщение', description: 'Сообщения в чате', icon: 'pi pi-comment' },
  { value: 'email', label: 'Email', description: 'Email письма', icon: 'pi pi-envelope' },
  { value: 'sms', label: 'SMS', description: 'SMS сообщения', icon: 'pi pi-mobile' },
  { value: 'notification', label: 'Уведомление', description: 'Системные уведомления', icon: 'pi pi-bell' }
]

export const TEMPLATE_CATEGORIES = [
  { value: 'greeting', label: 'Приветствие', description: 'Приветственные сообщения', color: 'green' },
  { value: 'farewell', label: 'Прощание', description: 'Прощальные сообщения', color: 'blue' },
  { value: 'support', label: 'Поддержка', description: 'Техническая поддержка', color: 'orange' },
  { value: 'sales', label: 'Продажи', description: 'Продажные сообщения', color: 'purple' },
  { value: 'technical', label: 'Технические', description: 'Технические вопросы', color: 'red' },
  { value: 'general', label: 'Общие', description: 'Общие сообщения', color: 'gray' }
]

export const TEMPLATE_LANGUAGES = [
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'kk', label: 'Қазақша', flag: '🇰🇿' }
]

export const TEMPLATE_VARIABLES = [
  { key: 'client_name', label: 'Имя клиента', description: 'Имя клиента' },
  { key: 'client_phone', label: 'Телефон клиента', description: 'Номер телефона клиента' },
  { key: 'client_email', label: 'Email клиента', description: 'Email адрес клиента' },
  { key: 'service_type', label: 'Тип услуги', description: 'Тип предоставляемой услуги' },
  { key: 'contact_phone', label: 'Контактный телефон', description: 'Телефон для связи' },
  { key: 'contact_email', label: 'Контактный email', description: 'Email для связи' },
  { key: 'company_name', label: 'Название компании', description: 'Название компании' },
  { key: 'user_name', label: 'Имя сотрудника', description: 'Имя сотрудника' },
  { key: 'user_position', label: 'Должность сотрудника', description: 'Должность сотрудника' },
  { key: 'current_date', label: 'Текущая дата', description: 'Текущая дата' },
  { key: 'current_time', label: 'Текущее время', description: 'Текущее время' }
]
