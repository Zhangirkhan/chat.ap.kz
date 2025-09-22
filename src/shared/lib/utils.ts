/**
 * Утилиты для работы с данными
 */

import { USER_ROLE_LABELS, USER_STATUS_LABELS, CHAT_STATUS_LABELS, MESSAGE_TYPE_LABELS, ORGANIZATION_STATUS_LABELS, PERMISSION_LABELS } from './constants'

/**
 * Форматирование даты
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Intl.DateTimeFormat('ru-RU', { ...defaultOptions, ...options }).format(dateObj)
}

/**
 * Форматирование времени
 */
export const formatTime = (date: string | Date): string => {
  return formatDate(date, { hour: '2-digit', minute: '2-digit' })
}

/**
 * Относительное время (например, "2 часа назад")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'только что'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин. назад`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ч. назад`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} дн. назад`
  }
  
  return formatDate(dateObj, { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/**
 * Форматирование размера файла
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Б'
  
  const k = 1024
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Получение лейбла роли пользователя
 */
export const getUserRoleLabel = (role: string): string => {
  return USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS] || role
}

/**
 * Получение лейбла статуса пользователя
 */
export const getUserStatusLabel = (status: string): string => {
  return USER_STATUS_LABELS[status as keyof typeof USER_STATUS_LABELS] || status
}

/**
 * Получение лейбла статуса чата
 */
export const getChatStatusLabel = (status: string): string => {
  return CHAT_STATUS_LABELS[status as keyof typeof CHAT_STATUS_LABELS] || status
}

/**
 * Получение лейбла типа сообщения
 */
export const getMessageTypeLabel = (type: string): string => {
  return MESSAGE_TYPE_LABELS[type as keyof typeof MESSAGE_TYPE_LABELS] || type
}

/**
 * Получение лейбла статуса организации
 */
export const getOrganizationStatusLabel = (status: string): string => {
  return ORGANIZATION_STATUS_LABELS[status as keyof typeof ORGANIZATION_STATUS_LABELS] || status
}

/**
 * Получение лейбла разрешения
 */
export const getPermissionLabel = (permission: string): string => {
  return PERMISSION_LABELS[permission as keyof typeof PERMISSION_LABELS] || permission
}

/**
 * Дебаунс функция
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Троттлинг функция
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Генерация уникального ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Клонирование объекта
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * Проверка на пустое значение
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true
  }
  
  if (typeof value === 'string') {
    return value.trim() === ''
  }
  
  if (Array.isArray(value)) {
    return value.length === 0
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  
  return false
}

/**
 * Валидация email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Валидация телефона
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Форматирование телефона
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
  }
  
  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`
  }
  
  return phone
}

/**
 * Получение инициалов
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

/**
 * Сортировка массива объектов
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) {
      return direction === 'asc' ? -1 : 1
    }
    
    if (aVal > bVal) {
      return direction === 'asc' ? 1 : -1
    }
    
    return 0
  })
}

/**
 * Группировка массива объектов
 */
export const groupBy = <T>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Фильтрация массива объектов
 */
export const filterBy = <T>(
  array: T[],
  filters: Partial<T>
): T[] => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return true
      }
      
      const itemValue = item[key as keyof T]
      
      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }
      
      return itemValue === value
    })
  })
}