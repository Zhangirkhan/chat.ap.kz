<template>
  <AdminLayout>
    <template #title>Организации</template>
    <template #subtitle>Управление организациями</template>

    <div class="space-y-8">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <OrganizationPageHeader
        :organizations="{ value: organizations }"
        @add-organization="openCreateModal"
      />

      <!-- Индикатор загрузки -->
      <LoadingState v-if="loading" message="Загрузка организаций..." />

      <!-- Сообщение об ошибке -->
      <ErrorState v-if="error" :message="error" />

      <!-- Таблица организаций -->
      <OrganizationTable
        v-if="!loading"
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog, LoadingState, ErrorState } from '@/shared/ui'
import OrganizationPageHeader from './components/OrganizationPageHeader.vue'
import OrganizationTable from './components/OrganizationTable.vue'
import OrganizationDialogOptimized from './components/OrganizationDialogOptimized.vue'
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
