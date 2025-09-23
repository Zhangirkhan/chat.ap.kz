import { ref } from 'vue'
import type { Organization } from '@/shared/lib/types'

export function useOrganizationDialogs() {
  const showCreateModal = ref(false)
  const showEditModal = ref(false)
  const showViewModal = ref(false)
  const showDeleteModal = ref(false)
  const selectedOrganization = ref<Organization | null>(null)

  const openCreateModal = () => {
    showCreateModal.value = true
  }

  const closeCreateModal = () => {
    showCreateModal.value = false
  }

  const openEditModal = (organization: Organization) => {
    selectedOrganization.value = organization
    showEditModal.value = true
  }

  const closeEditModal = () => {
    showEditModal.value = false
    selectedOrganization.value = null
  }

  const openViewModal = (organization: Organization) => {
    selectedOrganization.value = organization
    showViewModal.value = true
  }

  const closeViewModal = () => {
    showViewModal.value = false
    selectedOrganization.value = null
  }

  const openDeleteModal = (organization: Organization) => {
    selectedOrganization.value = organization
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
    selectedOrganization.value = null
  }

  const closeAllModals = () => {
    showCreateModal.value = false
    showEditModal.value = false
    showViewModal.value = false
    showDeleteModal.value = false
    selectedOrganization.value = null
  }

  return {
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    selectedOrganization,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    openDeleteModal,
    closeDeleteModal,
    closeAllModals
  }
}
