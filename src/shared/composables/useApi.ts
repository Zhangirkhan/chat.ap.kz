/**
 * Композабл для работы с API
 */
import { ref, computed } from 'vue'
import { errorHandler, type AppError } from '@/shared/lib/errorHandler'

export interface UseApiOptions {
  immediate?: boolean
  onError?: (error: AppError) => void
  onSuccess?: (data: any) => void
}

export function useApi<T = any>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<AppError | null>(null)

  const isSuccess = computed(() => !loading.value && !error.value && data.value !== null)
  const isError = computed(() => !loading.value && error.value !== null)

  const execute = async (): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      data.value = result

      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (err: any) {
      const appError = errorHandler.handleApiError(err)
      error.value = appError

      if (options.onError) {
        options.onError(appError)
      }

      return null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  // Выполняем сразу если указано
  if (options.immediate) {
    execute()
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    isSuccess,
    isError,
    execute,
    reset
  }
}

/**
 * Композабл для работы с формами
 */
export function useFormApi<T = any>(
  submitApiCall: (data: T) => Promise<any>,
  options: UseApiOptions = {}
) {
  const { data, loading, error, isSuccess, isError, execute: baseExecute, reset } = useApi(submitApiCall, options)

  const submit = async (formData: T): Promise<boolean> => {
    const result = await baseExecute()
    return result !== null
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    isSuccess,
    isError,
    submit,
    reset
  }
}

/**
 * Композабл для работы со списками
 */
export function useListApi<T = any>(
  fetchApiCall: (params?: any) => Promise<{ data: T[]; pagination?: any }>,
  options: UseApiOptions = {}
) {
  const items = ref<T[]>([])
  const pagination = ref<any>(null)
  const loading = ref(false)
  const error = ref<AppError | null>(null)

  const hasItems = computed(() => items.value.length > 0)
  const isEmpty = computed(() => !loading.value && items.value.length === 0)

  const fetch = async (params?: any): Promise<T[] | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await fetchApiCall(params)
      items.value = result.data
      pagination.value = result.pagination

      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result.data
    } catch (err: any) {
      const appError = errorHandler.handleApiError(err)
      error.value = appError

      if (options.onError) {
        options.onError(appError)
      }

      return null
    } finally {
      loading.value = false
    }
  }

  const addItem = (item: T) => {
    items.value.push(item)
  }

  const updateItem = (id: number, updatedItem: T) => {
    const index = items.value.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      items.value[index] = updatedItem
    }
  }

  const removeItem = (id: number) => {
    const index = items.value.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  const reset = () => {
    items.value = []
    pagination.value = null
    error.value = null
    loading.value = false
  }

  // Выполняем сразу если указано
  if (options.immediate) {
    fetch()
  }

  return {
    items: readonly(items),
    pagination: readonly(pagination),
    loading: readonly(loading),
    error: readonly(error),
    hasItems,
    isEmpty,
    fetch,
    addItem,
    updateItem,
    removeItem,
    reset
  }
}
