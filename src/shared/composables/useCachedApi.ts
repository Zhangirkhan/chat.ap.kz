import { ref, computed } from 'vue'
import { useSmartCache } from './useSmartCache'
import { useErrorHandler } from './useErrorHandler'

interface ApiCacheConfig {
  ttl?: number
  enableCache?: boolean
  cacheKey?: string
}

export function useCachedApi<T>(
  apiCall: () => Promise<T>,
  config: ApiCacheConfig = {}
) {
  const {
    ttl = 300000, // 5 минут
    enableCache = true,
    cacheKey = 'default'
  } = config

  const cache = useSmartCache<T>({ ttl })
  const { handleApiError } = useErrorHandler()
  
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (forceRefresh: boolean = false): Promise<T | null> => {
    const key = `${cacheKey}-${JSON.stringify({})}` // можно добавить параметры в ключ

    // Проверяем кэш если не принудительное обновление
    if (!forceRefresh && enableCache) {
      const cachedData = cache.get(key)
      if (cachedData) {
        data.value = cachedData
        return cachedData
      }
    }

    try {
      loading.value = true
      error.value = null

      const result = await apiCall()
      
      // Сохраняем в кэш
      if (enableCache) {
        cache.set(key, result)
      }
      
      data.value = result
      return result
    } catch (err) {
      const appError = handleApiError(err, 'CachedApi', false)
      error.value = appError.message
      return null
    } finally {
      loading.value = false
    }
  }

  const invalidateCache = () => {
    cache.invalidatePattern(`${cacheKey}-*`)
  }

  const refresh = () => {
    return execute(true)
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    execute,
    invalidateCache,
    refresh,
    cacheStats: cache.stats,
    hitRate: cache.hitRate
  }
}

// Composable для работы с пагинированными данными
export function useCachedPaginatedApi<T>(
  apiCall: (params?: unknown) => Promise<{ data: T[]; pagination: unknown }>,
  config: ApiCacheConfig = {}
) {
  const {
    ttl = 300000,
    enableCache = true,
    cacheKey = 'paginated'
  } = config

  const cache = useSmartCache<{ data: T[]; pagination: unknown }>({ ttl })
  const { handleApiError } = useErrorHandler()
  
  const data = ref<T[]>([])
  const pagination = ref<unknown>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params?: unknown, forceRefresh: boolean = false): Promise<{ data: T[]; pagination: unknown } | null> => {
    const key = `${cacheKey}-${JSON.stringify(params || {})}`

    // Проверяем кэш если не принудительное обновление
    if (!forceRefresh && enableCache) {
      const cachedData = cache.get(key)
      if (cachedData) {
        data.value = cachedData.data
        pagination.value = cachedData.pagination
        return cachedData
      }
    }

    try {
      loading.value = true
      error.value = null

      const result = await apiCall(params)
      
      // Сохраняем в кэш
      if (enableCache) {
        cache.set(key, result)
      }
      
      data.value = result.data
      pagination.value = result.pagination
      return result
    } catch (err) {
      const appError = handleApiError(err, 'CachedPaginatedApi', false)
      error.value = appError.message
      return null
    } finally {
      loading.value = false
    }
  }

  const invalidateCache = () => {
    cache.invalidatePattern(`${cacheKey}-*`)
  }

  const refresh = (params?: unknown) => {
    return execute(params, true)
  }

  return {
    data: computed(() => data.value),
    pagination: computed(() => pagination.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    execute,
    invalidateCache,
    refresh,
    cacheStats: cache.stats,
    hitRate: cache.hitRate
  }
}
