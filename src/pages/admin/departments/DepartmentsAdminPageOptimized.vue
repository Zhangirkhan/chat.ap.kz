<template>
  <AdminLayout>
    <template #title>Отделы организации</template>
    <template #subtitle>Создание и управление отделами организаций</template>

    <div class="departments-admin-page">
      <div class="departments-content">
        <!-- Заголовок -->
        <DepartmentPageHeader @create-department="openCreateModal" />

        <!-- Фильтры -->
        <DepartmentFilters
          :departments="{ value: departments }"
          @refresh="loadDepartments"
        />

        <!-- Таблица -->
        <DepartmentTable
          :departments="filteredDepartments"
          @view="openViewModal"
          @edit="handleEdit"
          @manage-staff="handleManageStaff"
          @delete="openDeleteModal"
        />
      </div>

      <!-- Модальное окно создания/редактирования -->
      <DepartmentFormModal
        v-if="showCreateModal"
        :is-editing="isEditing"
        :department="departmentToEdit"
        :form="form"
        :errors="errors"
        :organization-options="organizationOptions"
        :status-options="statusOptions"
        :loading="loading"
        @close="closeCreateModal"
        @submit="handleSubmit"
      />

      <!-- Модальное окно управления персоналом -->
      <DepartmentStaffModal
        v-if="showStaffModal"
        :selected-department="selectedDepartment"
        :supervisors="departmentSupervisors"
        :managers="departmentManagers"
        :new-supervisor-id="newSupervisorId"
        :new-manager-id="newManagerId"
        :available-supervisors="availableSupervisors"
        :available-managers="availableManagers"
        @close="closeStaffModal"
        @add-supervisor="handleAddSupervisor"
        @add-manager="handleAddManager"
        @remove-supervisor="handleRemoveSupervisor"
        @remove-manager="handleRemoveManager"
      />

      <!-- Модальное окно подтверждения удаления -->
      <ConfirmDialog
        v-if="showDeleteModal"
        :title="'Удаление отдела'"
        :message="`Вы уверены, что хотите удалить отдел '${departmentToDelete?.name}'?`"
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
import DepartmentPageHeader from './components/DepartmentPageHeader.vue'
import DepartmentFilters from './components/DepartmentFilters.vue'
import DepartmentTable from './components/DepartmentTable.vue'
import DepartmentFormModal from './components/DepartmentFormModal.vue'
import DepartmentStaffModal from './components/DepartmentStaffModal.vue'
import { useDepartmentManagement } from '@/shared/composables/useDepartmentManagement'
import { useDepartmentFilters } from '@/shared/composables/useDepartmentFilters'
import { useDepartmentForm } from '@/shared/composables/useDepartmentForm'
import { useDepartmentStaff } from '@/shared/composables/useDepartmentStaff'
import { useDepartmentDialogs } from '@/shared/composables/useDepartmentDialogs'
import { useOrganizationData } from '@/shared/composables/useOrganizationData'

// Основные composables
const {
  departments,
  loading,
  error,
  loadDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentSupervisors,
  getDepartmentManagers,
  assignSupervisor,
  assignManager,
  removeSupervisor,
  removeManager
} = useDepartmentManagement()

const { filteredDepartments } = useDepartmentFilters({ value: departments })

const {
  isEditing,
  departmentToEdit,
  form,
  errors,
  validateForm,
  resetForm,
  getFormData,
  startEditing,
  stopEditing
} = useDepartmentForm()

const {
  selectedDepartment,
  departmentSupervisors,
  departmentManagers,
  newSupervisorId,
  newManagerId,
  availableSupervisors,
  availableManagers,
  loadDepartmentStaff,
  addSupervisor,
  addManager,
  removeSupervisor: removeSupervisorStaff,
  removeManager: removeManagerStaff,
  clearSelection,
  loadAvailableStaff
} = useDepartmentStaff()

const {
  showCreateModal,
  showStaffModal,
  showDeleteModal,
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
} = useDepartmentDialogs()

const { organizationOptions, statusOptions, loadOrganizations } = useOrganizationData()

// Обработчики событий
const handleEdit = (department: any) => {
  startEditing(department)
  openCreateModal()
}

const handleManageStaff = async (department: any) => {
  await loadDepartmentStaff(
    department,
    getDepartmentSupervisors,
    getDepartmentManagers
  )
  openStaffModal()
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const formData = getFormData()
  let success = false

  if (isEditing.value && departmentToEdit.value) {
    success = await updateDepartment(departmentToEdit.value.id, formData as any)
  } else {
    success = await createDepartment(formData as any)
  }

  if (success) {
    closeCreateModal()
    stopEditing()
    await loadDepartments()
  }
}

const handleAddSupervisor = async () => {
  const success = await addSupervisor(assignSupervisor)
  if (success && selectedDepartment.value) {
    await loadDepartmentStaff(
      selectedDepartment.value,
      getDepartmentSupervisors,
      getDepartmentManagers
    )
  }
}

const handleAddManager = async () => {
  const success = await addManager(assignManager)
  if (success && selectedDepartment.value) {
    await loadDepartmentStaff(
      selectedDepartment.value,
      getDepartmentSupervisors,
      getDepartmentManagers
    )
  }
}

const handleRemoveSupervisor = async (supervisor: any) => {
  const success = await removeSupervisorStaff(supervisor, removeSupervisor)
  if (success && selectedDepartment.value) {
    await loadDepartmentStaff(
      selectedDepartment.value,
      getDepartmentSupervisors,
      getDepartmentManagers
    )
  }
}

const handleRemoveManager = async (manager: any) => {
  const success = await removeManagerStaff(manager, removeManager)
  if (success && selectedDepartment.value) {
    await loadDepartmentStaff(
      selectedDepartment.value,
      getDepartmentSupervisors,
      getDepartmentManagers
    )
  }
}

const handleDelete = async () => {
  if (departmentToDelete.value) {
    const success = await deleteDepartment(departmentToDelete.value.id)
    if (success) {
      closeDeleteModal()
      await loadDepartments()
    }
  }
}

onMounted(async () => {
  await Promise.all([
    loadDepartments(),
    loadOrganizations()
  ])
})
</script>

<style scoped>
.departments-admin-page {
  min-height: 100vh;
}

.departments-content {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
