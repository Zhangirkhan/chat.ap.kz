import type { Router } from 'vue-router'
import { useAuthStore } from '@/features/auth'

export const setupRouterGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Ждем инициализации authStore если она еще не завершена
    if (!authStore.isInitialized) {

      // Ждем максимум 10 секунд
      let attempts = 0
      const maxAttempts = 20 // 20 попыток по 500мс = 10 секунд

      while (!authStore.isInitialized && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }

      // Если пользователь все еще не загружен, но есть токен, пытаемся принудительно загрузить
      if (authStore.token && !authStore.user && authStore.isInitialized) {
        try {
          await authStore.forceFetchUser()
        } catch (error) {
        }
      }

    }

    // Дополнительная проверка: если есть токен в localStorage, но store не инициализирован
    const tokenFromStorage = localStorage.getItem('token')
    if (tokenFromStorage && !authStore.token) {
      // Принудительно устанавливаем токен
      authStore.token = tokenFromStorage
    }

    // Если токен был очищен из-за ошибки загрузки пользователя, но есть в localStorage - восстанавливаем
    if (!authStore.token && tokenFromStorage) {
      authStore.token = tokenFromStorage
    }

    // Проверка аутентификации для защищенных маршрутов
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/')
      return
    }

    // Перенаправление аутентифицированных пользователей с гостевых страниц
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/dashboard')
      return
    }

    next()
  })
}
