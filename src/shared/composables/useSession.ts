import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/features/auth'
import { useRouter } from 'vue-router'

/**
 * Composable для управления сессией пользователя
 * Реализует лучшие практики для безопасности сессии
 */
export function useSession() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Настройки сессии
  const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 минут
  const WARNING_TIME = 5 * 60 * 1000 // 5 минут до истечения
  const CHECK_INTERVAL = 60 * 1000 // Проверка каждую минуту

  // Состояние сессии
  const isSessionActive = ref(true)
  const sessionWarning = ref(false)
  const lastActivity = ref<number>(Date.now())
  const sessionTimer = ref<NodeJS.Timeout | null>(null)
  const warningTimer = ref<NodeJS.Timeout | null>(null)

  // Обновление активности пользователя
  const updateActivity = () => {
    lastActivity.value = Date.now()
    sessionWarning.value = false

    // Сбрасываем таймеры
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
    }
    if (warningTimer.value) {
      clearTimeout(warningTimer.value)
    }

    // Устанавливаем предупреждение
    warningTimer.value = setTimeout(() => {
      sessionWarning.value = true
    }, SESSION_TIMEOUT - WARNING_TIME)

    // Устанавливаем таймаут сессии
    sessionTimer.value = setTimeout(() => {
      handleSessionTimeout()
    }, SESSION_TIMEOUT)
  }

  // Обработка истечения сессии
  const handleSessionTimeout = async () => {
    isSessionActive.value = false

    // Показываем уведомление
    if (window.confirm('Ваша сессия истекла из-за неактивности. Хотите продолжить работу?')) {
      // Пользователь хочет продолжить - обновляем активность
      updateActivity()
      return
    }

    // Выполняем выход
    await authStore.logout()
    router.push('/')
  }

  // Проверка валидности токена
  const validateSession = async (): Promise<boolean> => {
    if (!authStore.token) {
      isSessionActive.value = false
      return false
    }

    try {
      const isValid = await authStore.validateToken()
      if (!isValid) {
        isSessionActive.value = false
        await authStore.logout()
        router.push('/')
        return false
      }
      return true
    } catch (error) {
      isSessionActive.value = false
      await authStore.logout()
      router.push('/')
      return false
    }
  }

  // Продление сессии
  const extendSession = async (): Promise<boolean> => {
    try {
      const success = await authStore.refreshToken()
      if (success) {
        updateActivity()
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  // Принудительный выход
  const forceLogout = async () => {
    isSessionActive.value = false
    await authStore.logout()
    router.push('/')
  }

  // Обработчики событий для отслеживания активности
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ]

  const handleUserActivity = () => {
    if (isSessionActive.value) {
      updateActivity()
    }
  }

  // Инициализация отслеживания активности
  const startActivityTracking = () => {
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, true)
    })
  }

  // Остановка отслеживания активности
  const stopActivityTracking = () => {
    activityEvents.forEach(event => {
      document.removeEventListener(event, handleUserActivity, true)
    })

    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
    }
    if (warningTimer.value) {
      clearTimeout(warningTimer.value)
    }
  }

  // Периодическая проверка сессии
  const startSessionCheck = () => {
    setInterval(async () => {
      if (isSessionActive.value) {
        await validateSession()
      }
    }, CHECK_INTERVAL)
  }

  // Инициализация сессии
  const initializeSession = async () => {
    if (!authStore.isAuthenticated) {
      isSessionActive.value = false
      return false
    }

    const isValid = await validateSession()
    if (isValid) {
      updateActivity()
      startActivityTracking()
      startSessionCheck()
      return true
    }

    return false
  }

  // Очистка при размонтировании
  onUnmounted(() => {
    stopActivityTracking()
  })

  return {
    isSessionActive,
    sessionWarning,
    lastActivity,
    updateActivity,
    validateSession,
    extendSession,
    forceLogout,
    initializeSession,
    startActivityTracking,
    stopActivityTracking
  }
}
