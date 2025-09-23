import { ref, computed } from 'vue'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

interface CacheConfig {
  ttl: number // время жизни в миллисекундах
  maxSize: number // максимальный размер кэша
  enableMemoryCleanup: boolean // автоматическая очистка памяти
}

export function useSmartCache<T>(config: Partial<CacheConfig> = {}) {
  const defaultConfig: CacheConfig = {
    ttl: 300000, // 5 минут по умолчанию
    maxSize: 100, // максимум 100 элементов
    enableMemoryCleanup: true
  }

  const finalConfig = { ...defaultConfig, ...config }
  const cache = ref<Map<string, CacheItem<T>>>(new Map())

  // Статистика кэша
  const stats = ref({
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0
  })

  const get = (key: string): T | null => {
    const item = cache.value.get(key)
    
    if (!item) {
      stats.value.misses++
      return null
    }

    // Проверяем TTL
    if (Date.now() - item.timestamp > item.ttl) {
      cache.value.delete(key)
      stats.value.misses++
      stats.value.evictions++
      return null
    }

    stats.value.hits++
    return item.data
  }

  const set = (key: string, data: T, customTtl?: number): void => {
    // Проверяем размер кэша и удаляем старые элементы если нужно
    if (cache.value.size >= finalConfig.maxSize) {
      evictOldest()
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTtl || finalConfig.ttl,
      key
    }

    cache.value.set(key, item)
    stats.value.size = cache.value.size
  }

  const has = (key: string): boolean => {
    const item = cache.value.get(key)
    if (!item) return false

    if (Date.now() - item.timestamp > item.ttl) {
      cache.value.delete(key)
      stats.value.evictions++
      return false
    }

    return true
  }

  const invalidate = (key: string): void => {
    if (cache.value.delete(key)) {
      stats.value.evictions++
      stats.value.size = cache.value.size
    }
  }

  const invalidatePattern = (pattern: string): void => {
    const regex = new RegExp(pattern)
    let deletedCount = 0

    for (const key of cache.value.keys()) {
      if (regex.test(key)) {
        cache.value.delete(key)
        deletedCount++
      }
    }

    stats.value.evictions += deletedCount
    stats.value.size = cache.value.size
  }

  const clear = (): void => {
    const size = cache.value.size
    cache.value.clear()
    stats.value.evictions += size
    stats.value.size = 0
  }

  const evictOldest = (): void => {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, item] of cache.value.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      cache.value.delete(oldestKey)
      stats.value.evictions++
    }
  }

  // Автоматическая очистка устаревших элементов
  const cleanup = (): void => {
    const now = Date.now()
    let deletedCount = 0

    for (const [key, item] of cache.value.entries()) {
      if (now - item.timestamp > item.ttl) {
        cache.value.delete(key)
        deletedCount++
      }
    }

    stats.value.evictions += deletedCount
    stats.value.size = cache.value.size
  }

  // Запускаем периодическую очистку если включена
  if (finalConfig.enableMemoryCleanup) {
    setInterval(cleanup, 60000) // очистка каждую минуту
  }

  const hitRate = computed(() => {
    const total = stats.value.hits + stats.value.misses
    return total > 0 ? (stats.value.hits / total) * 100 : 0
  })

  const size = computed(() => cache.value.size)

  return {
    get,
    set,
    has,
    invalidate,
    invalidatePattern,
    clear,
    cleanup,
    stats: computed(() => stats.value),
    hitRate,
    size
  }
}
