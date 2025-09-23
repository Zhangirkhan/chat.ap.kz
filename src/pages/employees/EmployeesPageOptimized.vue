<template>
  <AdminLayout>
    <template #title>Сотрудники</template>
    <template #subtitle>Управление сотрудниками организации</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <EmployeePageHeader
        :employees="{ value: employees }"
        @add-employee="openAddDialog"
      />

      <!-- Индикатор загрузки -->
      <LoadingState v-if="loading" message="Загрузка сотрудников..." />

      <!-- Сообщение об ошибке -->
      <ErrorState v-if="error" :message="error" />

      <!-- Таблица сотрудников -->
      <EmployeeTable
        v-if="!loading"
        :employees="filteredEmployees"
        @view="openViewDialog"
        @edit="openEditDialog"
        @change-password="openChangePasswordDialog"
        @delete="openDeleteDialog"
      />
    </div>

    <!-- Диалог добавления/редактирования -->
    <EmployeeDialog
      v-if="showAddDialog || showEditDialog"
      :employee="selectedEmployee || undefined"
      :is-edit="showEditDialog"
      :positions="positions"
      :departments="departments"
      :organizations="organizationStore.organizations"
      @close="closeAllDialogs"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <EmployeeViewDialog
      v-if="showViewDialog"
      :employee="selectedEmployee!"
      :positions="positions"
      :departments="departments"
      :organizations="organizationStore.organizations"
      @close="closeAllDialogs"
    />

    <!-- Диалог смены пароля -->
    <EmployeeChangePasswordDialog
      v-if="showChangePasswordDialog"
      :default-password="'12345678'"
      @close="closeAllDialogs"
      @save="handleChangePassword"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление сотрудника'"
      :message="`Вы уверены, что хотите удалить сотрудника '${selectedEmployee?.name}'?`"
      @confirm="handleDelete"
      @cancel="closeAllDialogs"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import LoadingState from '@/shared/ui/LoadingState.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'
import EmployeePageHeader from './components/EmployeePageHeader.vue'
import EmployeeTable from './components/EmployeeTable.vue'
import EmployeeDialog from './components/EmployeeDialog.vue'
import EmployeeViewDialog from './components/EmployeeViewDialog.vue'
import EmployeeChangePasswordDialog from './components/EmployeeChangePasswordDialog.vue'
import { useEmployeeManagement } from '@/shared/composables/useEmployeeManagement'
import { useEmployeeFilters } from '@/shared/composables/useEmployeeFilters'
import { useEmployeeData } from '@/shared/composables/useEmployeeData'
import { useDialogState } from '@/shared/composables/useDialogState'
import type { CreateUserData, UpdateUserData } from '@/shared/lib/types'

const {
  employees,
  loading,
  error,
  loadEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  changePassword
} = useEmployeeManagement()

const { searchQuery, filteredEmployees } = useEmployeeFilters(employees)

const {
  positions,
  departments,
  organizationStore,
  loadOrganizations,
  loadDepartments,
  loadPositions
} = useEmployeeData()

const {
  showAddDialog,
  showEditDialog,
  showViewDialog,
  showChangePasswordDialog,
  showDeleteDialog,
  selectedEmployee,
  openAddDialog,
  openEditDialog,
  openViewDialog,
  openChangePasswordDialog,
  openDeleteDialog,
  closeAllDialogs
} = useDialogState()

const handleSave = async (employeeData: CreateUserData | UpdateUserData) => {
  let success = false

  if (showEditDialog.value && selectedEmployee.value) {
    success = await updateEmployee(selectedEmployee.value.id, employeeData as UpdateUserData)
  } else {
    success = await createEmployee(employeeData as CreateUserData)
  }

  if (success) {
    closeAllDialogs()
  }
}

const handleDelete = async () => {
  if (selectedEmployee.value) {
    const success = await deleteEmployee(selectedEmployee.value.id)
    if (success) {
      closeAllDialogs()
    }
  }
}

const handleChangePassword = async (payload: { password: string; password_confirmation: string }) => {
  if (selectedEmployee.value) {
    const success = await changePassword(selectedEmployee.value.id, payload)
    if (success) {
      closeAllDialogs()
    }
  }
}

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadEmployees(searchQuery.value)
  }, 500)
})

onMounted(() => {
  loadEmployees()
  loadOrganizations()
  loadDepartments()
  loadPositions()
})
</script>

<style scoped>
/* Все стили в Tailwind CSS */
</style>
