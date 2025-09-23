import { ref, computed } from 'vue'
import type { Organization } from '@/shared/lib/types'

export function useOrganizationFilters(organizations: any) {
  const searchQuery = ref('')
  const statusFilter = ref<string>('')

  const filteredOrganizations = computed(() => {
    let filtered = organizations.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter((org: Organization) =>
        org.name.toLowerCase().includes(query) ||
        (org.description?.toLowerCase().includes(query)) ||
        (org.phone?.toLowerCase().includes(query))
      )
    }

    if (statusFilter.value) {
      filtered = filtered.filter((org: Organization) => org.status === statusFilter.value)
    }

    return filtered
  })

  const statusOptions = computed(() => [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активные' },
    { value: 'inactive', label: 'Неактивные' }
  ])

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Активная',
      inactive: 'Неактивная'
    }
    return labels[status] || status
  }

  const getStatusSeverity = (status: string) => {
    const severities: Record<string, string> = {
      active: 'success',
      inactive: 'warning'
    }
    return severities[status] || 'info'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const clearFilters = () => {
    searchQuery.value = ''
    statusFilter.value = ''
  }

  return {
    searchQuery,
    statusFilter,
    filteredOrganizations,
    statusOptions,
    getStatusLabel,
    getStatusSeverity,
    formatDate,
    clearFilters
  }
}
