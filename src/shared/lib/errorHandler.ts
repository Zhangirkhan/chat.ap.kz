/**
 * Централизованная обработка ошибок
 */

export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorCallbacks: ((error: AppError) => void)[] = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Обработка ошибок API
   */
  handleApiError(error: unknown): AppError {
    const appError: AppError = {
      code: 'API_ERROR',
      message: 'Произошла ошибка при обращении к серверу',
      details: error,
      timestamp: new Date().toISOString()
    }

    // Определяем тип ошибки
    const errorMessage = (error as { message?: string })?.message || ''
    if (errorMessage.includes('401')) {
      appError.code = 'UNAUTHORIZED'
      appError.message = 'Сессия истекла. Необходимо войти в систему заново.'
    } else if (errorMessage.includes('403')) {
      appError.code = 'FORBIDDEN'
      appError.message = 'Недостаточно прав для выполнения операции'
    } else if (errorMessage.includes('404')) {
      appError.code = 'NOT_FOUND'
      appError.message = 'Запрашиваемый ресурс не найден'
    } else if (errorMessage.includes('500')) {
      appError.code = 'SERVER_ERROR'
      appError.message = 'Внутренняя ошибка сервера'
    } else if (errorMessage.includes('сети')) {
      appError.code = 'NETWORK_ERROR'
      appError.message = 'Ошибка сети. Проверьте подключение к интернету'
    }

    this.notifyError(appError)
    return appError
  }

  /**
   * Обработка ошибок валидации
   */
  handleValidationError(errors: Record<string, string[]>): AppError {
    const appError: AppError = {
      code: 'VALIDATION_ERROR',
      message: 'Ошибка валидации данных',
      details: errors,
      timestamp: new Date().toISOString()
    }

    this.notifyError(appError)
    return appError
  }

  /**
   * Обработка общих ошибок
   */
  handleError(error: unknown): AppError {
    const appError: AppError = {
      code: 'UNKNOWN_ERROR',
      message: (error as { message?: string })?.message || 'Произошла неизвестная ошибка',
      details: error,
      timestamp: new Date().toISOString()
    }

    this.notifyError(appError)
    return appError
  }

  /**
   * Подписка на ошибки
   */
  onError(callback: (error: AppError) => void): () => void {
    this.errorCallbacks.push(callback)

    // Возвращаем функцию для отписки
    return () => {
      const index = this.errorCallbacks.indexOf(callback)
      if (index > -1) {
        this.errorCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Уведомление об ошибке
   */
  private notifyError(error: AppError): void {

    // Уведомляем всех подписчиков
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error)
      } catch (_e) {
      }
    })
  }

  /**
   * Логирование ошибки
   */
  logError(error: AppError, context?: string): void {
    const logData = {
      ...error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // В продакшене можно отправлять логи на сервер
    if (import.meta.env.PROD) {
      // TODO: Отправка логов на сервер
    } else {
    }
  }
}

// Экспортируем singleton
export const errorHandler = ErrorHandler.getInstance()

// Утилиты для работы с ошибками
export const isApiError = (error: unknown): error is AppError => {
  return error && typeof error === 'object' && 'code' in error && 'message' in error
}

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Произошла неизвестная ошибка'
}
