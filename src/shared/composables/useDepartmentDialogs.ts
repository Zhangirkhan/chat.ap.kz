import { ref } from 'vue'
import type { Department } from '@/shared/lib/types'

export function useDepartmentDialogs() {
  const showCreateModal = ref(false)
  const showStaffModal = ref(false)
  const showDeleteModal = ref(false)
  const showViewModal = ref(false)
  const departmentToDelete = ref<Department | null>(null)

  const openCreateModal = () => {
    showCreateModal.value = true
  }

  const closeCreateModal = () => {
    showCreateModal.value = false
  }

  const openStaffModal = () => {
    showStaffModal.value = true
  }

  const closeStaffModal = () => {
    showStaffModal.value = false
  }

  const openDeleteModal = (department: Department) => {
    departmentToDelete.value = department
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
    departmentToDelete.value = null
  }

  const openViewModal = (department: Department) => {
    showViewModal.value = true
  }

  const closeViewModal = () => {
    showViewModal.value = false
  }

  const closeAllModals = () => {
    showCreateModal.value = false
    showStaffModal.value = false
    showDeleteModal.value = false
    showViewModal.value = false
    departmentToDelete.value = null
  }

  return {
    showCreateModal,
    showStaffModal,
    showDeleteModal,
    showViewModal,
    departmentToDelete,
    openCreateModal,
    closeCreateModal,
    openStaffModal,
    closeStaffModal,
    openDeleteModal,
    closeDeleteModal,
    openViewModal,
    closeViewModal,
    closeAllModals
  }
}
