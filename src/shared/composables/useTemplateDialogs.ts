import { ref } from 'vue'
import type { Template } from '@/shared/api/templates'

export function useTemplateDialogs() {
  const showAddDialog = ref(false)
  const showEditDialog = ref(false)
  const showViewDialog = ref(false)
  const showDeleteDialog = ref(false)
  const selectedTemplate = ref<Template | null>(null)

  const openAddDialog = () => {
    showAddDialog.value = true
  }

  const closeAddDialog = () => {
    showAddDialog.value = false
  }

  const openEditDialog = (template: Template) => {
    selectedTemplate.value = template
    showEditDialog.value = true
  }

  const closeEditDialog = () => {
    showEditDialog.value = false
    selectedTemplate.value = null
  }

  const openViewDialog = (template: Template) => {
    selectedTemplate.value = template
    showViewDialog.value = true
  }

  const closeViewDialog = () => {
    showViewDialog.value = false
    selectedTemplate.value = null
  }

  const openDeleteDialog = (template: Template) => {
    selectedTemplate.value = template
    showDeleteDialog.value = true
  }

  const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    selectedTemplate.value = null
  }

  const closeAllDialogs = () => {
    showAddDialog.value = false
    showEditDialog.value = false
    showViewDialog.value = false
    showDeleteDialog.value = false
    selectedTemplate.value = null
  }

  return {
    showAddDialog,
    showEditDialog,
    showViewDialog,
    showDeleteDialog,
    selectedTemplate,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    openViewDialog,
    closeViewDialog,
    openDeleteDialog,
    closeDeleteDialog,
    closeAllDialogs
  }
}
