import { apiClient } from './client'
import type { ApiResponse, PaginationMeta } from './client'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface ListParams {
  page?: number
  per_page?: number
  search?: string
  [key: string]: any
}

export abstract class BaseApi {
  protected async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
    // Единая логика обработки всех ответов
    if (response.data !== undefined && response.data !== null) {
      return response.data
    }
    
    // Если ответ уже в правильном формате (прямой массив или объект)
    if (Array.isArray(response) || (typeof response === 'object' && !response.success)) {
      return response as T
    }
    
    throw new Error('Неожиданный формат ответа от сервера')
  }

  protected async handlePaginatedResponse<T>(response: ApiResponse<T[] | PaginatedResponse<T>>): Promise<PaginatedResponse<T>> {
    const data = await this.handleResponse<T[] | PaginatedResponse<T>>(response)
    
    // Если ответ уже в формате PaginatedResponse
    if (data && typeof data === 'object' && 'data' in data && 'pagination' in data) {
      return data as PaginatedResponse<T>
    }
    
    // Если ответ - простой массив
    if (Array.isArray(data)) {
      return {
        data,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: data.length,
          total: data.length
        }
      }
    }
    
    throw new Error('Неожиданный формат ответа для пагинированных данных')
  }

  protected buildQueryParams(params?: ListParams): string {
    if (!params) return ''
    
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })
    
    return queryParams.toString()
  }

  protected async get<T>(endpoint: string, params?: ListParams): Promise<T> {
    const queryString = this.buildQueryParams(params)
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    const response = await apiClient.get<T>(url)
    return this.handleResponse(response)
  }

  protected async getPaginated<T>(endpoint: string, params?: ListParams): Promise<PaginatedResponse<T>> {
    const queryString = this.buildQueryParams(params)
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    const response = await apiClient.get<T[] | PaginatedResponse<T>>(url)
    return this.handlePaginatedResponse(response)
  }

  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient.post<T>(endpoint, data)
    return this.handleResponse(response)
  }

  protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient.put<T>(endpoint, data)
    return this.handleResponse(response)
  }

  protected async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient.patch<T>(endpoint, data)
    return this.handleResponse(response)
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    const response = await apiClient.delete<T>(endpoint)
    return this.handleResponse(response)
  }
}
