import { useCachedPaginatedApi, useCachedApi } from '@/shared/composables/useCachedApi'
import { unifiedUsersApi, type User, type UsersListParams } from './UnifiedUsersApi'

// Кэшированные методы для пользователей
export function useCachedUsers() {
  const getUsers = useCachedPaginatedApi<User>(
    (params?: UsersListParams) => unifiedUsersApi.getUsers(params),
    {
      ttl: 300000, // 5 минут
      cacheKey: 'users-list'
    }
  )

  const getUser = (id: number) => {
    return useCachedApi<User>(
      () => unifiedUsersApi.getUser(id),
      {
        ttl: 600000, // 10 минут для отдельных пользователей
        cacheKey: `user-detail-${id}`
      }
    )
  }

  const getUserStats = useCachedApi<{ total: number; active: number; inactive: number }>(
    () => unifiedUsersApi.getUserStats(),
    {
      ttl: 60000, // 1 минута для статистики
      cacheKey: 'user-stats'
    }
  )

  const createUser = async (data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at' | 'department' | 'organization'>) => {
    const result = await unifiedUsersApi.createUser(data)
    // Инвалидируем кэш списка и статистики
    getUsers.invalidateCache()
    getUserStats.invalidateCache()
    return result
  }

  const updateUser = async (id: number, data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login_at' | 'department' | 'organization'>>) => {
    const result = await unifiedUsersApi.updateUser(id, data)
    // Инвалидируем кэш списка и статистики
    getUsers.invalidateCache()
    getUserStats.invalidateCache()
    return result
  }

  const deleteUser = async (id: number) => {
    await unifiedUsersApi.deleteUser(id)
    // Инвалидируем кэш списка и статистики
    getUsers.invalidateCache()
    getUserStats.invalidateCache()
  }

  const changePassword = async (id: number, password: string) => {
    await unifiedUsersApi.changePassword(id, password)
    // Инвалидируем кэш списка пользователей
    getUsers.invalidateCache()
  }

  return {
    // Кэшированные методы
    getUsers,
    getUser,
    getUserStats,
    
    // Методы с инвалидацией кэша
    createUser,
    updateUser,
    deleteUser,
    changePassword
  }
}
