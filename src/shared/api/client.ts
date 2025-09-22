// Конфигурация API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://back-chat.ap.kz/api'
const API_TIMEOUT = 60000 // 60 секунд

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
  code?: number
  timestamp?: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

class ApiClient {
  private baseURL: string
  private token: string | null = null
  private activeRequests: Set<AbortController> = new Set()

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = localStorage.getItem('token')
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('token')
  }

  // Отмена всех активных запросов
  cancelAllRequests() {
    this.activeRequests.forEach(controller => {
      controller.abort()
    })
    this.activeRequests.clear()
  }

  // Очистка ресурсов
  destroy() {
    this.cancelAllRequests()
    this.clearToken()
  }

  private getHeaders(isFormData: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json'
    }

    // Не устанавливаем Content-Type для FormData - браузер сделает это автоматически
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: unknown

    try {
      data = await response.json()
    } catch {
      // Если не удается распарсить JSON, возвращаем базовую структуру
      data = {
        success: false,
        message: `HTTP error! status: ${response.status}`,
        data: null
      }
    }

    if (!response.ok) {
      // Если это 401 ошибка, очищаем токен
      if (response.status === 401) {
        this.clearToken()
        // Перенаправляем на главную страницу только если не на ней
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }

      // Создаем объект ошибки с полной информацией
      const errorData = data as { message?: string; errors?: Record<string, string[]> }
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)

      // Добавляем информацию об ошибках валидации
      if (errorData.errors) {
        (error as Error & { errors?: Record<string, string[]> }).errors = errorData.errors
      }

      throw error
    }

    return data as ApiResponse<T>
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Создаем новый контроллер для этого запроса
    const abortController = new AbortController()
    this.activeRequests.add(abortController)

    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, API_TIMEOUT)

    try {
      const isFormData = options.body instanceof FormData
      const headers = {
        ...this.getHeaders(isFormData),
        ...options.headers
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: abortController.signal,
        headers
      })

      clearTimeout(timeoutId)
      return this.handleResponse<T>(response)
    } catch (error: unknown) {
      clearTimeout(timeoutId)

      if ((error as Error).name === 'AbortError') {
        throw new Error('Запрос был отменен или превышено время ожидания')
      }

      // Проверяем, является ли ошибка сетевой
      if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
        throw new Error('Ошибка сети. Проверьте подключение к интернету.')
      }

      // Проверяем, является ли ошибка таймаутом
      if ((error as Error).message.includes('timeout') || (error as Error).message.includes('timeout')) {
        throw new Error('Превышено время ожидания ответа от сервера')
      }

      throw error
    } finally {
      // Удаляем контроллер из активных запросов
      this.activeRequests.delete(abortController)
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    let url = endpoint

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += (endpoint.includes('?') ? '&' : '?') + queryString
      }
    }

    return this.makeRequest<T>(url, {
      method: 'GET'
    })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    let body: BodyInit | undefined

    if (data instanceof FormData) {
      // Для FormData передаем как есть
      body = data
    } else if (data) {
      // Для обычных данных сериализуем в JSON
      body = JSON.stringify(data)
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE'
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export type { ApiResponse, PaginationMeta, PaginatedResponse }
