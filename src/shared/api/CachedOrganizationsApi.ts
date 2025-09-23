import { useCachedPaginatedApi, useCachedApi } from '@/shared/composables/useCachedApi'
import { unifiedOrganizationsApi, type Organization, type OrganizationsListParams } from './UnifiedOrganizationsApi'

// Кэшированные методы для организаций
export function useCachedOrganizations() {
  const getOrganizations = useCachedPaginatedApi<Organization>(
    (params?: OrganizationsListParams) => unifiedOrganizationsApi.getOrganizations(params),
    {
      ttl: 300000, // 5 минут
      cacheKey: 'organizations-list'
    }
  )

  const getOrganization = (id: number) => {
    return useCachedApi<Organization>(
      () => unifiedOrganizationsApi.getOrganization(id),
      {
        ttl: 600000, // 10 минут для отдельных организаций
        cacheKey: `organization-detail-${id}`
      }
    )
  }

  const createOrganization = async (data: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'departments_count' | 'users_count'>) => {
    const result = await unifiedOrganizationsApi.createOrganization(data)
    // Инвалидируем кэш списка
    getOrganizations.invalidateCache()
    return result
  }

  const updateOrganization = async (id: number, data: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'departments_count' | 'users_count'>>) => {
    const result = await unifiedOrganizationsApi.updateOrganization(id, data)
    // Инвалидируем кэш списка
    getOrganizations.invalidateCache()
    return result
  }

  const deleteOrganization = async (id: number) => {
    await unifiedOrganizationsApi.deleteOrganization(id)
    // Инвалидируем кэш списка
    getOrganizations.invalidateCache()
  }

  // Методы без кэширования (для Wazzup интеграции)
  const getWazzupChannels = (id: number) => {
    return unifiedOrganizationsApi.getWazzupChannels(id)
  }

  const setupWazzupWebhooks = (id: number) => {
    return unifiedOrganizationsApi.setupWazzupWebhooks(id)
  }

  return {
    // Кэшированные методы
    getOrganizations,
    getOrganization,
    
    // Методы с инвалидацией кэша
    createOrganization,
    updateOrganization,
    deleteOrganization,
    
    // Методы без кэширования
    getWazzupChannels,
    setupWazzupWebhooks
  }
}
