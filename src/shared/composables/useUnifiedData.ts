import { ref, computed } from 'vue'
import { unifiedOrganizationsApi, type Organization as ApiOrganization } from '@/shared/api/UnifiedOrganizationsApi'
import { unifiedUsersApi, type User as ApiUser } from '@/shared/api/UnifiedUsersApi'

/**
 * Объединенный composable для работы с данными организаций и пользователей
 * Заменяет useOrganizationData и useEmployeeData
 */
export function useUnifiedData() {
  const organizations = ref<ApiOrganization[]>([])
  const users = ref<ApiUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Загрузка организаций
  const loadOrganizations = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await unifiedOrganizationsApi.getOrganizations()
      organizations.value = response.data
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Ошибка загрузки организаций'
    } finally {
      loading.value = false
    }
  }

  // Загрузка пользователей
  const loadUsers = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await unifiedUsersApi.getUsers()
      users.value = response.data
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Ошибка загрузки пользователей'
    } finally {
      loading.value = false
    }
  }

  // Получение организации по ID
  const getOrganizationById = (id: number) => {
    return organizations.value.find(org => org.id === id)
  }

  // Получение пользователя по ID
  const getUserById = (id: number) => {
    return users.value.find(user => user.id === id)
  }

  // Получение активных организаций
  const activeOrganizations = computed(() => {
    return organizations.value.filter(org => org.is_active)
  })

  // Получение активных пользователей
  const activeUsers = computed(() => {
    return users.value.filter(user => user.is_active)
  })

  // Статистика
  const stats = computed(() => ({
    totalOrganizations: organizations.value.length,
    activeOrganizations: activeOrganizations.value.length,
    totalUsers: users.value.length,
    activeUsers: activeUsers.value.length
  }))

  return {
    // Данные
    organizations: computed(() => organizations.value),
    users: computed(() => users.value),
    activeOrganizations,
    activeUsers,
    
    // Состояние
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    stats,
    
    // Методы
    loadOrganizations,
    loadUsers,
    getOrganizationById,
    getUserById
  }
}
