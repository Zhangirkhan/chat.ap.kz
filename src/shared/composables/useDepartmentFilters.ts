import { ref, computed } from 'vue'
import type { Department } from '@/shared/lib/types'

export function useDepartmentFilters(departments: any) {
  const searchQuery = ref('')
  const organizationFilter = ref<number | null>(null)
  const statusFilter = ref<string>('')

  const filteredDepartments = computed(() => {
    let filtered = departments.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter((dept: Department) =>
        dept.name.toLowerCase().includes(query) ||
        (dept.description?.toLowerCase().includes(query))
      )
    }

    if (organizationFilter.value) {
      filtered = filtered.filter((dept: Department) => dept.organization_id === organizationFilter.value)
    }

    if (statusFilter.value) {
      filtered = filtered.filter((dept: Department) => dept.status === statusFilter.value)
    }

    return filtered
  })

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Активный',
      inactive: 'Неактивный'
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

  const getStatusClasses = (status: string) => {
    const classes: Record<string, string> = {
      active: 'status-badge--success',
      inactive: 'status-badge--warning'
    }
    return classes[status] || 'status-badge--info'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const clearFilters = () => {
    searchQuery.value = ''
    organizationFilter.value = null
    statusFilter.value = ''
  }

  return {
    searchQuery,
    organizationFilter,
    statusFilter,
    filteredDepartments,
    getStatusLabel,
    getStatusSeverity,
    getStatusClasses,
    formatDate,
    clearFilters
  }
}
