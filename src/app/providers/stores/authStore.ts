import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { authApi } from '@/features/auth/api/authApi'
import { apiClient } from '@/shared/api/client'
import { useOrganizationStore } from '@/entities/organization'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  position?: string
  role: string
  organization?: {
    id: number
    name: string
  }
  permissions: string[]
  roles: string[]
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
    token_type: string
    expires_in?: number
  }
  timestamp?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const isInitialized = ref(false)

  // Упрощенная проверка авторизации - только по токену
  const isAuthenticated = computed(() => {
    // Если есть токен, считаем авторизованными
    return !!token.value
  })

  // Проверка, есть ли полные данные пользователя
  const hasUserData = computed(() => !!user.value)

         const login = async (email: string, password: string) => {
           loading.value = true
           try {
             const response = await authApi.login(email, password)

             if (response.success === true) {
               token.value = response.data.token
               user.value = response.data.user
               localStorage.setItem('token', response.data.token)
               // Синхронизируем токен с apiClient
               apiClient.setToken(response.data.token)

               // Загружаем организации в фоне после успешной авторизации
               try {
                 const organizationStore = useOrganizationStore()
                 organizationStore.getOrganizations().catch(err => {
                 })
               } catch (_err) {
               }

               return { success: true, data: response }
             }

             return { success: false, error: response.message || 'Ошибка входа в систему' }
           } catch (error: unknown) {
             return {
               success: false,
               error: (error as Error)?.message || 'Ошибка входа в систему'
             }
           } finally {
             loading.value = false
           }
         }

  const register = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
    position?: string
    organization_id?: number
  }) => {
    loading.value = true
    try {
      const response = await authApi.register(userData)

      if (response.success === true) {
        token.value = response.data.token
        user.value = response.data.user
        localStorage.setItem('token', response.data.token)
        return { success: true, data: response }
      }

      return { success: false, error: response.message || 'Ошибка регистрации' }
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error)?.message || 'Ошибка регистрации'
      }
    } finally {
      loading.value = false
    }
  }

         const logout = async () => {
           loading.value = true
           try {
             if (token.value) {
               await authApi.logout()
             }
           } catch (_error) {
           } finally {
             clearAuth()
             loading.value = false
           }
         }

  const fetchUser = async (silent = false) => {
    if (!token.value) return false

    loading.value = true
    try {
      const response = await authApi.getUser()

      if (response.success === true && response.data && response.data.user) {
        user.value = response.data.user
        isInitialized.value = true
        return true
      }

      // Если ответ пустой или некорректный, но не ошибка сети, не очищаем токен
      if (!silent) {
        // Не очищаем токен при пустом ответе - возможно, это временная проблема сервера
        // Очищаем токен только если явно указано success: false
        if (response.success === false) {
          clearAuth()
        } else {
        }
      }
      return false
    } catch (error) {

      // Если это ошибка таймаута или сети, не очищаем токен сразу
      const errorMessage = (error as Error).message
      if (errorMessage.includes('превышено время ожидания') ||
          errorMessage.includes('Ошибка сети') ||
          errorMessage.includes('fetch')) {

        if (!silent) {
        }
        return false
      }

      // Для других ошибок (401, 403 и т.д.) очищаем токен
      if (!silent) {
        clearAuth()
      }
      return false
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData: {
    name?: string
    phone?: string
    position?: string
  }) => {
    loading.value = true
    try {
      const response = await authApi.updateProfile(profileData)

      if (response.success === true) {
        if (user.value) {
          Object.assign(user.value, response.data)
        }
        return { success: true, data: response }
      }

      return { success: false, error: response.message }
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error)?.message || 'Ошибка обновления профиля'
      }
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) => {
    loading.value = true
    try {
      const response = await authApi.changePassword(passwordData)

      if (response.success === true) {
        return { success: true, data: response }
      }

      return { success: false, error: response.message }
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error)?.message || 'Ошибка смены пароля'
      }
    } finally {
      loading.value = false
    }
  }

  // Проверка валидности токена
  const validateToken = async (): Promise<boolean> => {
    if (!token.value) return false

    try {
      const response = await authApi.getUser()
      return response.success === true
    } catch (error) {
      return false
    }
  }

  // Обновление токена
  const refreshToken = async (): Promise<boolean> => {
    if (!token.value) return false

    try {
      // Здесь можно добавить логику обновления токена
      // Пока что просто проверяем валидность текущего токена
      return await validateToken()
    } catch (error) {
      return false
    }
  }

  // Проверка разрешений пользователя
  const hasPermission = (permission: string): boolean => {
    if (!user.value) return false
    return user.value.permissions?.includes(permission) || user.value.permissions?.includes('*') || false
  }

  // Проверка роли пользователя
  const hasRole = (role: string): boolean => {
    if (!user.value) return false
    return user.value.roles?.includes(role) || user.value.role === role || false
  }

  // Проверка активности сессии
  const isSessionActive = (): boolean => {
    if (!token.value) return false

    // Проверяем, не истек ли токен (если есть информация о времени истечения)
    const tokenExpiry = localStorage.getItem('token_expiry')
    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry).getTime()
      const currentTime = new Date().getTime()
      return currentTime < expiryTime
    }

    return true
  }

  // Автоматический выход при неактивной сессии
  const checkSessionActivity = () => {
    if (!isSessionActive()) {
      logout()
    }
  }

  // Синхронизация токена с apiClient
  watch(token, (newToken) => {
    if (newToken) {
      apiClient.setToken(newToken)
    } else {
      apiClient.clearToken()
    }
  }, { immediate: true })

  // Функция очистки авторизации
  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    apiClient.clearToken()
    isInitialized.value = false

    // Очищаем кэш организаций при выходе
    try {
      const organizationStore = useOrganizationStore()
      organizationStore.clearCache()
    } catch (err) {
    }
  }

  // Инициализация при загрузке store
  const initializeAuth = async () => {

    if (token.value && !user.value && !isInitialized.value) {

      // Устанавливаем токен в apiClient
      apiClient.setToken(token.value)

      // Пытаемся загрузить пользователя
      const success = await fetchUser(true) // silent = true

      if (!success) {
        // Не очищаем токен при сетевых ошибках
      } else {
      }
    }

    // Всегда помечаем как инициализированный
    isInitialized.value = true
  }

  // Вызываем инициализацию при создании store
  initializeAuth().catch(err => {
    isInitialized.value = true
  })

  // Принудительная загрузка пользователя
  const forceFetchUser = async () => {
    if (!token.value) return false

    return await fetchUser(false) // не silent
  }

  return {
    user,
    token,
    loading,
    isInitialized,
    isAuthenticated,
    hasUserData,
    login,
    register,
    logout,
    fetchUser,
    forceFetchUser,
    updateProfile,
    changePassword,
    validateToken,
    refreshToken,
    hasPermission,
    hasRole,
    isSessionActive,
    checkSessionActivity,
    clearAuth
  }
})

