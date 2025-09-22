import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { organizationApi } from '../api/organizationApi'
import type { Organization } from '@/shared/lib/types'

export const useOrganizationStore = defineStore('organizations', () => {
  const organizations = ref<Organization[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number | null>(null)

  // Кэш на 5 минут
  const CACHE_DURATION = 5 * 60 * 1000

  const isDataFresh = computed(() => {
    if (!lastFetch.value) return false
    return Date.now() - lastFetch.value < CACHE_DURATION
  })

  const hasOrganizations = computed(() => organizations.value.length > 0)

  // Получение организаций с кэшированием и retry логикой
  const getOrganizations = async (forceRefresh = false): Promise<Organization[]> => {
    // Если данные свежие и не требуется принудительное обновление, возвращаем кэш
    if (!forceRefresh && isDataFresh.value && hasOrganizations.value) {
      return organizations.value
    }

    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        loading.value = true
        error.value = null

        const response = await organizationApi.getOrganizations({ per_page: 100 })

        // Проверяем формат ответа
        if (response.data && Array.isArray(response.data)) {
          organizations.value = response.data
        } else if (Array.isArray(response)) {
          organizations.value = response
        } else {
          organizations.value = []
          error.value = 'Неожиданный формат ответа от сервера'
        }

        lastFetch.value = Date.now()

        return organizations.value
      } catch (err) {
        attempts++

        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки организаций'

        // Если это последняя попытка или не сетевая ошибка, выбрасываем ошибку
        if (attempts >= maxAttempts ||
            (!errorMessage.includes('превышено время ожидания') &&
             !errorMessage.includes('Ошибка сети'))) {

          error.value = errorMessage

          // Если это первая загрузка и произошла ошибка, возвращаем пустой массив
          if (!hasOrganizations.value) {
            organizations.value = []
          }

          throw err
        }

        // Ждем перед следующей попыткой
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, attempts * 2000))
        }
      } finally {
        loading.value = false
      }
    }

    // Этот код не должен выполниться, но на всякий случай
    throw new Error('Не удалось загрузить организации после всех попыток')
  }

  // Получение организации по ID
  const getOrganizationById = (id: number): Organization | undefined => {
    return organizations.value.find(org => org.id === id)
  }

  // Поиск организаций
  const searchOrganizations = (query: string): Organization[] => {
    if (!query.trim()) return organizations.value

    const searchTerm = query.toLowerCase()
    return organizations.value.filter(org =>
      org.name.toLowerCase().includes(searchTerm) ||
      org.email?.toLowerCase().includes(searchTerm) ||
      org.phone?.includes(searchTerm)
    )
  }

  // Добавление новой организации
  const addOrganization = (organization: Organization) => {
    const existingIndex = organizations.value.findIndex(org => org.id === organization.id)
    if (existingIndex !== -1) {
      organizations.value[existingIndex] = organization
    } else {
      organizations.value.push(organization)
    }
  }

  // Обновление организации
  const updateOrganization = (id: number, organization: Organization) => {
    const index = organizations.value.findIndex(org => org.id === id)
    if (index !== -1) {
      organizations.value[index] = organization
    }
  }

  // Удаление организации
  const removeOrganization = (id: number) => {
    const index = organizations.value.findIndex(org => org.id === id)
    if (index !== -1) {
      organizations.value.splice(index, 1)
    }
  }

  // Очистка кэша
  const clearCache = () => {
    organizations.value = []
    lastFetch.value = null
    error.value = null
  }

  // Принудительное обновление
  const refresh = () => {
    return getOrganizations(true)
  }

  return {
    // State
    organizations,
    loading,
    error,
    lastFetch,

    // Computed
    isDataFresh,
    hasOrganizations,

    // Actions
    getOrganizations,
    getOrganizationById,
    searchOrganizations,
    addOrganization,
    updateOrganization,
    removeOrganization,
    clearCache,
    refresh
  }
})
