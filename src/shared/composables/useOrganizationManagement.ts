import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { organizationApi } from '@/entities/organization'
import type { Organization, CreateOrganizationData, UpdateOrganizationData } from '@/shared/lib/types'

export function useOrganizationManagement() {
  const toast = useToast()
  const organizations = ref<Organization[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadOrganizations = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await organizationApi.getOrganizations({ per_page: 100 })

      if (response.data && Array.isArray(response.data)) {
        organizations.value = response.data
      } else if (Array.isArray(response)) {
        organizations.value = response
      } else {
        organizations.value = []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки организаций'
      organizations.value = []
    } finally {
      loading.value = false
    }
  }

  const createOrganization = async (organizationData: CreateOrganizationData) => {
    try {
      loading.value = true
      const response = await organizationApi.createOrganization(organizationData)

      if (response.data) {
        organizations.value.unshift(response.data)
        
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Организация создана',
          life: 3000,
          group: 'main'
        })

        return response.data
      }

      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания организации'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return null
    } finally {
      loading.value = false
    }
  }

  const updateOrganization = async (id: number, organizationData: UpdateOrganizationData) => {
    try {
      loading.value = true
      const response = await organizationApi.updateOrganization(id, organizationData)

      const index = organizations.value.findIndex(org => org.id === id)
      if (index !== -1 && response.data) {
        organizations.value[index] = response.data
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Организация обновлена',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления организации'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const deleteOrganization = async (id: number) => {
    try {
      loading.value = true
      await organizationApi.deleteOrganization(id)

      const index = organizations.value.findIndex(org => org.id === id)
      if (index !== -1) {
        organizations.value.splice(index, 1)
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Организация удалена',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления организации'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  return {
    organizations,
    loading,
    error,
    loadOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
  }
}
