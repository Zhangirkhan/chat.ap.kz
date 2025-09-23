<template>
  <AdminLayout>
    <div class="organizations-admin-page">
      <OrganizationPageHeader @create-organization="openCreateModal" />

      <div class="organizations-content">
        <!-- Фильтры -->
        <OrganizationFilters
          :organizations="{ value: organizations }"
          @refresh="loadOrganizations"
        />

        <!-- Таблица -->
        <OrganizationTable
          :organizations="filteredOrganizations"
          @view="openViewModal"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>

      <!-- Модальные окна -->
      <OrganizationDialogOptimized
        v-if="showCreateModal"
        :is-edit="false"
        @close="closeCreateModal"
        @save="handleCreate"
      />

      <OrganizationDialogOptimized
        v-if="showEditModal && selectedOrganization"
        :organization="selectedOrganization"
        :is-edit="true"
        @close="closeEditModal"
        @save="handleUpdate"
      />

      <ConfirmDialog
        v-if="showDeleteModal && selectedOrganization"
        :title="'Удаление организации'"
        :message="`Вы уверены, что хотите удалить организацию '${selectedOrganization.name}'?`"
        @confirm="handleDelete"
        @cancel="closeDeleteModal"
      />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import OrganizationPageHeader from './components/OrganizationPageHeader.vue'
import OrganizationFilters from './components/OrganizationFilters.vue'
import OrganizationTable from './components/OrganizationTable.vue'
import OrganizationDialogOptimized from '@/pages/organizations/components/OrganizationDialogOptimized.vue'
import { useOrganizationManagement } from '@/shared/composables/useOrganizationManagement'
import { useOrganizationFilters } from '@/shared/composables/useOrganizationFilters'
import { useOrganizationDialogs } from '@/shared/composables/useOrganizationDialogs'

// Composables
const {
  organizations,
  loading,
  error,
  loadOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = useOrganizationManagement()

const { filteredOrganizations } = useOrganizationFilters({ value: organizations })

const {
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
  closeDeleteModal
} = useOrganizationDialogs()

// Обработчики событий
const handleCreate = async (data: any) => {
  const success = await createOrganization(data)
  if (success) {
    closeCreateModal()
    await loadOrganizations()
  }
}

const handleUpdate = async (data: any) => {
  if (selectedOrganization.value) {
    const success = await updateOrganization(selectedOrganization.value.id, data)
    if (success) {
      closeEditModal()
      await loadOrganizations()
    }
  }
}

const handleDelete = async () => {
  if (selectedOrganization.value) {
    const success = await deleteOrganization(selectedOrganization.value.id)
    if (success) {
      closeDeleteModal()
      await loadOrganizations()
    }
  }
}

onMounted(async () => {
  await loadOrganizations()
})
</script>

<style scoped>
.organizations-admin-page {
  min-height: 100vh;
}

.organizations-content {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
