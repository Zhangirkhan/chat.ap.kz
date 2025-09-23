import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

export interface AppError {
  message: string
  code?: string | number
  context?: string
  timestamp: number
  stack?: string
}

export function useErrorHandler() {
  const toast = useToast()
  const errors = ref<AppError[]>([])
  const isOnline = ref(navigator.onLine)

  // Следим за состоянием сети
  window.addEventListener('online', () => {
    isOnline.value = true
  })

  window.addEventListener('offline', () => {
    isOnline.value = false
  })

  const handleError = (
    error: Error | string,
    context?: string,
    showToast: boolean = true
  ): AppError => {
    const appError: AppError = {
      message: typeof error === 'string' ? error : error.message,
      code: typeof error === 'object' && 'code' in error ? error.code : undefined,
      context,
      timestamp: Date.now(),
      stack: typeof error === 'object' ? error.stack : undefined
    }

    // Добавляем ошибку в список
    errors.value.unshift(appError)

    // Показываем уведомление если нужно
    if (showToast) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: appError.message,
        life: 5000,
        group: 'main'
      })
    }

    // Логируем ошибку в консоль
    console.error(`[${context || 'Unknown'}]`, appError)

    // Отправляем в систему мониторинга (если есть)
    if (typeof error === 'object' && error.stack) {
      // Здесь можно добавить отправку в Sentry, LogRocket и т.д.
      // sendToMonitoring(appError)
    }

    return appError
  }

  const handleApiError = (
    error: any,
    context?: string,
    showToast: boolean = true
  ): AppError => {
    let message = 'Произошла ошибка'
    let code: string | number | undefined

    if (error.response) {
      // Ошибка HTTP
      const status = error.response.status
      const data = error.response.data

      code = status

      switch (status) {
        case 400:
          message = data?.message || 'Неверный запрос'
          break
        case 401:
          message = 'Необходима авторизация'
          break
        case 403:
          message = 'Доступ запрещен'
          break
        case 404:
          message = 'Ресурс не найден'
          break
        case 422:
          message = data?.message || 'Ошибка валидации'
          break
        case 500:
          message = 'Внутренняя ошибка сервера'
          break
        default:
          message = data?.message || `Ошибка ${status}`
      }
    } else if (error.request) {
      // Ошибка сети
      message = isOnline.value ? 'Ошибка сети' : 'Нет подключения к интернету'
      code = 'NETWORK_ERROR'
    } else {
      // Другая ошибка
      message = error.message || 'Неизвестная ошибка'
    }

    return handleError(message, context, showToast)
  }

  const clearErrors = () => {
    errors.value = []
  }

  const removeError = (index: number) => {
    errors.value.splice(index, 1)
  }

  const getErrorsByContext = (context: string) => {
    return errors.value.filter(error => error.context === context)
  }

  const getRecentErrors = (count: number = 10) => {
    return errors.value.slice(0, count)
  }

  const hasErrors = computed(() => errors.value.length > 0)

  const errorCount = computed(() => errors.value.length)

  return {
    errors: computed(() => errors.value),
    isOnline: computed(() => isOnline.value),
    hasErrors,
    errorCount,
    handleError,
    handleApiError,
    clearErrors,
    removeError,
    getErrorsByContext,
    getRecentErrors
  }
}

// Composable для работы с ошибками в формах
export function useFormErrorHandler() {
  const { handleError, handleApiError } = useErrorHandler()
  const formErrors = ref<Record<string, string>>({})

  const setFieldError = (field: string, error: string) => {
    formErrors.value[field] = error
  }

  const clearFieldError = (field: string) => {
    delete formErrors.value[field]
  }

  const clearAllErrors = () => {
    formErrors.value = {}
  }

  const setFormErrors = (errors: Record<string, string>) => {
    formErrors.value = { ...errors }
  }

  const getFieldError = (field: string) => {
    return formErrors.value[field] || ''
  }

  const hasFieldError = (field: string) => {
    return !!formErrors.value[field]
  }

  const hasAnyError = computed(() => Object.keys(formErrors.value).length > 0)

  return {
    formErrors: computed(() => formErrors.value),
    hasAnyError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setFormErrors,
    getFieldError,
    hasFieldError,
    handleError,
    handleApiError
  }
}
