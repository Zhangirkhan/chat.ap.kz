<template>
  <AdminLayout>
    <template #title>Отделы организации</template>
    <template #subtitle>Создание и управление отделами организаций</template>

    <div class="departments-admin-page">
      <div class="departments-content">
        <div class="departments-header">
          <Button
            variant="primary"
            icon="pi pi-plus"
            @click="showCreateModal = true"
          >
            Добавить отдел
          </Button>
        </div>
        <!-- Фильтры и поиск -->
        <Card class="filters-card">
          <div class="filters-row">
            <Input
              v-model="searchQuery"
              placeholder="Поиск по названию отдела..."
              icon="pi pi-search"
              class="search-input"
            />
            <select
              v-model="organizationFilter"
              class="organization-filter"
            >
              <option value="">Все организации</option>
              <option v-for="org in organizationOptions" :key="org.value" :value="org.value">
                {{ org.label }}
              </option>
            </select>
            <select
              v-model="statusFilter"
              class="status-filter"
            >
              <option value="">Все статусы</option>
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
            <Button
              variant="secondary"
              icon="pi pi-refresh"
              @click="loadDepartments"
            >
              Обновить
            </Button>
          </div>
        </Card>

        <!-- Таблица отделов -->
        <Card class="departments-table-card">
          <div class="table-container">
            <table class="departments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Организация</th>
                  <th>Руководители</th>
                  <th>Менеджеры</th>
                  <th>Пользователи</th>
                  <th>Статус</th>
                  <th>Создано</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="department in filteredDepartments" :key="department.id">
                  <td>{{ department.id }}</td>
                  <td>
                    <div class="department-name">
                      <strong>{{ department.name }}</strong>
                      <p v-if="department.description" class="description">
                        {{ department.description }}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span class="organization-name">
                      {{ department.organization?.name || 'Не указана' }}
                    </span>
                  </td>
                  <td>
                    <span class="count-badge count-badge--warning">{{ department.supervisors_count }}</span>
                  </td>
                  <td>
                    <span class="count-badge count-badge--info">{{ department.managers_count }}</span>
                  </td>
                  <td>
                    <span class="count-badge count-badge--success">{{ department.users_count }}</span>
                  </td>
                  <td>
                    <span class="status-badge" :class="`status-badge--${getStatusSeverity(department.status)}`">
                      {{ getStatusLabel(department.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(department.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <Button
                        variant="secondary"
                        size="small"
                        icon="pi pi-eye"
                        @click="viewDepartment(department)"
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        icon="pi pi-pencil"
                        @click="editDepartment(department)"
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        icon="pi pi-users"
                        @click="manageStaff(department)"
                      />
                      <Button
                        variant="danger"
                        size="small"
                        icon="pi pi-trash"
                        @click="confirmDelete(department)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <!-- Модальное окно создания/редактирования -->
      <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
        <div class="modal-dialog" @click.stop>
          <div class="modal-header">
            <h3>{{ isEditing ? 'Редактировать отдел' : 'Создать отдел' }}</h3>
            <button class="modal-close" @click="showCreateModal = false">&times;</button>
          </div>
          <div class="modal-content">
        <form @submit.prevent="handleSubmit" class="department-form">
          <Input
            v-model="form.name"
            label="Название отдела *"
            placeholder="Введите название"
            :error="errors.name"
            required
          />

          <div class="form-group">
            <label class="form-label">Организация *</label>
            <select
              v-model="form.organization_id"
              class="form-select"
              :class="{ 'error': errors.organization_id }"
              required
            >
              <option value="">Выберите организацию</option>
              <option v-for="org in organizationOptions" :key="org.value" :value="org.value">
                {{ org.label }}
              </option>
            </select>
            <span v-if="errors.organization_id" class="error-message">{{ errors.organization_id }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Описание</label>
            <textarea
              v-model="form.description"
              class="form-textarea"
              :class="{ 'error': errors.description }"
              placeholder="Введите описание"
              rows="3"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>

          <div v-if="isEditing" class="form-row">
            <div class="form-group">
              <label class="form-label">Статус</label>
              <select
                v-model="form.status"
                class="form-select"
                :class="{ 'error': errors.status }"
              >
                <option value="">Выберите статус</option>
                <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
              <span v-if="errors.status" class="error-message">{{ errors.status }}</span>
            </div>
          </div>

          <div class="form-actions">
            <Button
              type="button"
              variant="secondary"
              @click="closeModal"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              :loading="departmentStore.loading"
            >
              {{ isEditing ? 'Сохранить' : 'Создать' }}
            </Button>
          </div>
        </form>
          </div>
        </div>
      </div>

      <!-- Модальное окно управления персоналом -->
      <div v-if="showStaffModal" class="modal-overlay" @click="showStaffModal = false">
        <div class="modal-dialog staff-dialog" @click.stop style="width: 800px;">
          <div class="modal-header">
            <h3>Управление персоналом отдела</h3>
            <button class="modal-close" @click="showStaffModal = false">&times;</button>
          </div>
          <div class="modal-content">
        <div v-if="selectedDepartment" class="staff-management">
          <div class="staff-section">
            <h3>Руководители отдела</h3>
            <div class="staff-list">
              <div v-for="supervisor in departmentSupervisors" :key="supervisor.id" class="staff-item">
                <div class="staff-info">
                  <strong>{{ supervisor.name }}</strong>
                  <span>{{ supervisor.email }}</span>
                </div>
                <Button
                  variant="danger"
                  size="small"
                  icon="pi pi-times"
                  @click="removeSupervisor(supervisor)"
                />
              </div>
              <div v-if="departmentSupervisors.length === 0" class="empty-state">
                Нет назначенных руководителей
              </div>
            </div>
            <div class="add-staff">
              <select
                v-model="newSupervisorId"
                class="staff-select"
              >
                <option value="">Выберите руководителя</option>
                <option v-for="supervisor in availableSupervisors" :key="supervisor.value" :value="supervisor.value">
                  {{ supervisor.label }}
                </option>
              </select>
              <Button
                variant="primary"
                size="small"
                @click="addSupervisor"
                :disabled="!newSupervisorId"
              >
                Добавить
              </Button>
            </div>
          </div>

          <div class="staff-section">
            <h3>Менеджеры отдела</h3>
            <div class="staff-list">
              <div v-for="manager in departmentManagers" :key="manager.id" class="staff-item">
                <div class="staff-info">
                  <strong>{{ manager.name }}</strong>
                  <span>{{ manager.email }}</span>
                </div>
                <Button
                  variant="danger"
                  size="small"
                  icon="pi pi-times"
                  @click="removeManager(manager)"
                />
              </div>
              <div v-if="departmentManagers.length === 0" class="empty-state">
                Нет назначенных менеджеров
              </div>
            </div>
            <div class="add-staff">
              <select
                v-model="newManagerId"
                class="staff-select"
              >
                <option value="">Выберите менеджера</option>
                <option v-for="manager in availableManagers" :key="manager.value" :value="manager.value">
                  {{ manager.label }}
                </option>
              </select>
              <Button
                variant="primary"
                size="small"
                @click="addManager"
                :disabled="!newManagerId"
              >
                Добавить
              </Button>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      <!-- Модальное окно удаления -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-dialog" @click.stop>
          <div class="modal-header">
            <h3>Подтверждение удаления</h3>
            <button class="modal-close" @click="showDeleteModal = false">&times;</button>
          </div>
          <div class="modal-content">
            <p>Вы уверены, что хотите удалить отдел <strong>{{ departmentToDelete?.name }}</strong>?</p>
            <p class="warning-text">Это действие нельзя отменить!</p>
          </div>
          <div class="modal-footer">
            <Button
              variant="secondary"
              @click="showDeleteModal = false"
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              :loading="departmentStore.loading"
              @click="handleDelete"
            >
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { Button, Input, Card } from '@/shared/ui'
import { useDepartmentStore, useOrganizationStore } from '@/entities'
import type { Department, CreateDepartmentData, UpdateDepartmentData, User } from '@/shared/lib/types'

const departmentStore = useDepartmentStore()
const organizationStore = useOrganizationStore()

// Состояние
const searchQuery = ref('')
const organizationFilter = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const showStaffModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const departmentToDelete = ref<Department | null>(null)
const selectedDepartment = ref<Department | null>(null)

// Состояние для управления персоналом
const departmentSupervisors = ref<User[]>([])
const departmentManagers = ref<User[]>([])
const newSupervisorId = ref<number | null>(null)
const newManagerId = ref<number | null>(null)

// Форма
const form = reactive({
  name: '',
  organization_id: null as number | null,
  description: '',
  status: 'active'
})

const errors = reactive({
  name: '',
  organization_id: '',
  description: '',
  status: ''
})

// Опции
const statusOptions = [
  { label: 'Все статусы', value: '' },
  { label: 'Активный', value: 'active' },
  { label: 'Неактивный', value: 'inactive' }
]

const organizationOptions = computed(() => {
  const options = [{ label: 'Все организации', value: '' }]
  organizationStore.organizations.forEach(org => {
    options.push({ label: org.name, value: org.id })
  })
  return options
})

const availableSupervisors = computed(() => {
  // TODO: Получить список пользователей с ролью supervisor
  return []
})

const availableManagers = computed(() => {
  // TODO: Получить список пользователей с ролью manager
  return []
})

// Вычисляемые свойства
const filteredDepartments = computed(() => {
  let filtered = departmentStore.departments

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(dept =>
      dept.name.toLowerCase().includes(query) ||
      (dept.description?.toLowerCase().includes(query))
    )
  }

  if (organizationFilter.value) {
    filtered = filtered.filter(dept => dept.organization_id === organizationFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(dept => dept.status === statusFilter.value)
  }

  return filtered
})

// Методы
const loadDepartments = async () => {
  await departmentStore.fetchDepartments()
}

const loadOrganizations = async () => {
  await organizationStore.fetchOrganizations()
}

const validateForm = () => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Название отдела обязательно'
    isValid = false
  }

  if (!form.organization_id) {
    errors.organization_id = 'Организация обязательна'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    if (isEditing.value && departmentToDelete.value) {
      const updateData: UpdateDepartmentData = {
        name: form.name,
        organization_id: form.organization_id!,
        description: form.description || undefined,
        status: form.status as any
      }
      await departmentStore.updateDepartment(departmentToDelete.value.id, updateData)
    } else {
      const createData: CreateDepartmentData = {
        name: form.name,
        organization_id: form.organization_id!,
        description: form.description || undefined
      }
      await departmentStore.createDepartment(createData)
    }

    closeModal()
    await loadDepartments()
  } catch (error) {
  }
}

const viewDepartment = (department: Department) => {
  // TODO: Реализовать просмотр отдела
}

const editDepartment = (department: Department) => {
  isEditing.value = true
  departmentToDelete.value = department

  form.name = department.name
  form.organization_id = department.organization_id
  form.description = department.description || ''
  form.status = department.status

  showCreateModal.value = true
}

const manageStaff = async (department: Department) => {
  selectedDepartment.value = department

  // Загружаем руководителей и менеджеров отдела
  try {
    const supervisors = await departmentStore.getDepartmentSupervisors(department.id)
    const managers = await departmentStore.getDepartmentManagers(department.id)

    departmentSupervisors.value = supervisors || []
    departmentManagers.value = managers || []
  } catch (error) {
  }

  showStaffModal.value = true
}

const addSupervisor = async () => {
  if (!newSupervisorId.value || !selectedDepartment.value) return

  try {
    await departmentStore.assignSupervisor({
      user_id: newSupervisorId.value,
      department_id: selectedDepartment.value.id
    })

    // Обновляем список
    await manageStaff(selectedDepartment.value)
    newSupervisorId.value = null
  } catch (error) {
  }
}

const addManager = async () => {
  if (!newManagerId.value || !selectedDepartment.value) return

  try {
    await departmentStore.assignManager({
      user_id: newManagerId.value,
      department_id: selectedDepartment.value.id
    })

    // Обновляем список
    await manageStaff(selectedDepartment.value)
    newManagerId.value = null
  } catch (error) {
  }
}

const removeSupervisor = async (supervisor: User) => {
  if (!selectedDepartment.value) return

  try {
    await departmentStore.removeSupervisor({
      user_id: supervisor.id,
      department_id: selectedDepartment.value.id
    })

    // Обновляем список
    await manageStaff(selectedDepartment.value)
  } catch (error) {
  }
}

const removeManager = async (manager: User) => {
  if (!selectedDepartment.value) return

  try {
    await departmentStore.removeManager({
      user_id: manager.id,
      department_id: selectedDepartment.value.id
    })

    // Обновляем список
    await manageStaff(selectedDepartment.value)
  } catch (error) {
  }
}

const confirmDelete = (department: Department) => {
  departmentToDelete.value = department
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!departmentToDelete.value) return

  try {
    await departmentStore.deleteDepartment(departmentToDelete.value.id)
    showDeleteModal.value = false
    departmentToDelete.value = null
    await loadDepartments()
  } catch (error) {
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showStaffModal.value = false
  isEditing.value = false
  departmentToDelete.value = null
  selectedDepartment.value = null

  // Сброс формы
  form.name = ''
  form.organization_id = null
  form.description = ''
  form.status = 'active'

  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// Вспомогательные функции
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

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

.departments-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.count-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.count-badge--warning {
  background-color: #fff3cd;
  color: #856404;
}

.count-badge--info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.count-badge--success {
  background-color: #d4edda;
  color: #155724;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge--success {
  background-color: #d4edda;
  color: #155724;
}

.status-badge--warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge--danger {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge--info {
  background-color: #d1ecf1;
  color: #0c5460;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #2c3e50;
}

.modal-content {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select.error,
.form-textarea.error {
  border-color: #dc3545;
}

.error-message {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #dc3545;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-top: 8px;
}

.filters-card {
  margin-bottom: 24px;
}

.filters-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.organization-filter,
.status-filter {
  min-width: 150px;
}

.departments-table-card {
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.departments-table {
  width: 100%;
  border-collapse: collapse;
}

.departments-table th,
.departments-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.departments-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.department-name strong {
  color: #1f2937;
}

.department-name .description {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #6b7280;
}

.organization-name {
  color: #6b7280;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.department-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.staff-management {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.staff-section h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 18px;
}

.staff-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  min-height: 100px;
}

.staff-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.staff-item:last-child {
  border-bottom: none;
}

.staff-info {
  display: flex;
  flex-direction: column;
}

.staff-info strong {
  color: #1f2937;
}

.staff-info span {
  color: #6b7280;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 20px;
}

.add-staff {
  display: flex;
  gap: 12px;
  align-items: center;
}

.staff-select {
  flex: 1;
}

.warning-text {
  color: #dc2626;
  font-weight: 500;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .departments-content {
    padding: 16px;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .add-staff {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
