import { computed } from 'vue'
import { useAuthStore } from '@/features/auth'
import { useRouter } from 'vue-router'

/**
 * Composable для работы с авторизацией
 * Предоставляет единый интерфейс для всех компонентов
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Состояние авторизации
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isInitialized = computed(() => authStore.isInitialized)
  const hasUserData = computed(() => authStore.hasUserData)
  const user = computed(() => authStore.user)
  const token = computed(() => authStore.token)
  const loading = computed(() => authStore.loading)

  // Проверка готовности системы авторизации
  const isReady = computed(() => authStore.isInitialized)

  // Вход в систему
  const login = async (email: string, password: string) => {
    const result = await authStore.login(email, password)

    if (result.success) {
      // Перенаправляем на dashboard после успешного входа
      await router.push('/dashboard')
    }

    return result
  }

  // Выход из системы
  const logout = async () => {
    await authStore.logout()
    await router.push('/')
  }

  // Обновление данных пользователя
  const refreshUser = async () => {
    if (authStore.token) {
      return await authStore.fetchUser(true) // silent = true
    }
    return false
  }

  // Проверка разрешений
  const hasPermission = (permission: string) => {
    return authStore.hasPermission(permission)
  }

  // Проверка роли
  const hasRole = (role: string) => {
    return authStore.hasRole(role)
  }

  // Проверка активности сессии
  const isSessionActive = () => {
    return authStore.isSessionActive()
  }

  // Валидация токена
  const validateToken = async () => {
    return await authStore.validateToken()
  }

  return {
    // State
    isAuthenticated,
    isInitialized,
    hasUserData,
    isReady,
    user,
    token,
    loading,

    // Actions
    login,
    logout,
    refreshUser,
    hasPermission,
    hasRole,
    isSessionActive,
    validateToken
  }
}
