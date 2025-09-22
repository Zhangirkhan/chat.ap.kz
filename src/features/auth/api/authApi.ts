import { apiClient } from '@/shared/api/client'
import { API_URLS } from '@/shared/config/api'
import type { AuthResponse } from '../model/authStore'

export class AuthApi {
  // Получение CSRF токена
  async getCsrfToken(): Promise<string> {
    // Получаем CSRF токен из API
    const response = await fetch(API_URLS.CSRF_COOKIE, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Ошибка получения CSRF токена: ${response.status}`)
    }

    const data = await response.json()

    if (!data.csrf_token) {
      throw new Error('CSRF токен не найден в ответе')
    }

    return data.csrf_token
  }


  // Вход в систему
  async login(email: string, password: string): Promise<AuthResponse> {
    // 1. Получить CSRF токен
    const csrfToken = await this.getCsrfToken()

    // 2. Логин через SPA endpoint
    const response = await fetch(API_URLS.AUTH_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка входа в систему')
    }

    return response.json()
  }

  // Регистрация
  async register(userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
    position?: string
    organization_id?: number
  }): Promise<AuthResponse> {
    // 1. Получить CSRF токен
    const csrfToken = await this.getCsrfToken()

    // 2. Регистрация через SPA endpoint
    const response = await fetch(API_URLS.AUTH_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка регистрации')
    }

    return response.json()
  }

  // Выход из системы
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  }

  // Получение данных пользователя
  async getUser(): Promise<AuthResponse> {
    const response = await apiClient.get('/user')

    // Проверяем, что ответ не пустой
    const responseData = response as unknown as Record<string, unknown>
    if (!response || (response.success === undefined && !response.data && !responseData.user)) {
      return {
        success: false,
        message: 'Пустой ответ от сервера',
        data: undefined as unknown as AuthResponse['data']
      }
    }

    // Если API возвращает данные пользователя напрямую
    if (responseData.user) {
      return {
        success: true,
        message: 'Пользователь загружен',
        data: {
          user: responseData.user as AuthResponse['data']['user'],
          token: '', // Токен уже есть в store
          token_type: 'Bearer'
        }
      }
    }

    // Если API возвращает данные в стандартном формате
    return {
      success: response.success,
      message: response.message,
      data: response.data as AuthResponse['data']
    }
  }

  // Обновление профиля
  async updateProfile(profileData: {
    name?: string
    phone?: string
    position?: string
  }): Promise<AuthResponse> {
    const response = await apiClient.put('/auth/profile', profileData)
    return {
      success: response.success,
      message: response.message,
      data: response.data as AuthResponse['data']
    }
  }

  // Смена пароля
  async changePassword(passwordData: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }): Promise<AuthResponse> {
    const response = await apiClient.put('/auth/password', passwordData)
    return {
      success: response.success,
      message: response.message,
      data: response.data as AuthResponse['data']
    }
  }
}

export const authApi = new AuthApi()

