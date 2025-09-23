<template>
  <AdminLayout>
    <div class="organizations-admin-page">
      <Header>
        <template #title>Управление организациями</template>
        <template #subtitle>Создание и управление организациями</template>
        <template #actions>
          <Button
            variant="primary"
            icon="pi pi-plus"
            @click="showCreateModal = true"
          >
            Добавить организацию
          </Button>
        </template>
      </Header>

      <div class="organizations-content">
        <!-- Фильтры и поиск -->
        <Card class="filters-card">
          <div class="filters-row">
            <Input
              v-model="searchQuery"
              placeholder="Поиск по названию, телефону, описанию..."
              icon="pi pi-search"
              class="search-input"
            />
            <Select
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Все статусы"
              class="status-filter"
            />
            <Button
              variant="secondary"
              icon="pi pi-refresh"
              @click="loadOrganizations"
            >
              Обновить
            </Button>
          </div>
        </Card>

        <!-- Таблица организаций -->
        <Card class="organizations-table-card">
          <div class="table-container">
            <table class="organizations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Телефон</th>
                  <th>Отделы</th>
                  <th>Пользователи</th>
                  <th>Статус</th>
                  <th>Создано</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="organization in filteredOrganizations" :key="organization.id">
                  <td>{{ organization.id }}</td>
                  <td>
                    <div class="organization-name">
                      <strong>{{ organization.name }}</strong>
                      <p v-if="organization.description" class="description">
                        {{ organization.description }}
                      </p>
                    </div>
                  </td>
                  <td>{{ organization.phone || '-' }}</td>
                  <td>
                    <Badge :value="organization.departments_count" severity="info" />
                  </td>
                  <td>
                    <Badge :value="organization.users_count" severity="success" />
                  </td>
                  <td>
                    <Badge
                      :value="getStatusLabel(organization.status)"
                      :severity="getStatusSeverity(organization.status)"
                    />
                  </td>
                  <td>{{ formatDate(organization.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <Button
                        variant="secondary"
                        size="small"
                        icon="pi pi-eye"
                        @click="viewOrganization(organization)"
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        icon="pi pi-pencil"
                        @click="editOrganization(organization)"
                      />
                      <Button
                        variant="danger"
                        size="small"
                        icon="pi pi-trash"
                        @click="confirmDelete(organization)"
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
      <Dialog
        v-model:visible="showCreateModal"
        :header="isEditing ? 'Редактировать организацию' : 'Создать организацию'"
        modal
        class="organization-dialog"
      >
        <form @submit.prevent="handleSubmit" class="organization-form">
          <Input
            v-model="form.name"
            label="Название организации *"
            placeholder="Введите название"
            :error="errors.name"
            required
          />

          <Input
            v-model="form.phone"
            type="tel"
            label="Телефон"
            placeholder="Введите телефон"
            :error="errors.phone"
          />

          <Textarea
            v-model="form.description"
            label="Описание"
            placeholder="Введите описание"
            :error="errors.description"
            rows="3"
          />

          <div v-if="isEditing" class="form-row">
            <Select
              v-model="form.status"
              :options="statusOptions"
              label="Статус"
              :error="errors.status"
            />
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
              :loading="organizationStore.loading"
            >
              {{ isEditing ? 'Сохранить' : 'Создать' }}
            </Button>
          </div>
        </form>
      </Dialog>

      <!-- Модальное окно удаления -->
      <Dialog
        v-model:visible="showDeleteModal"
        header="Подтверждение удаления"
        modal
      >
        <p>Вы уверены, что хотите удалить организацию <strong>{{ organizationToDelete?.name }}</strong>?</p>
        <p class="warning-text">Это действие нельзя отменить!</p>

        <template #footer>
          <Button
            variant="secondary"
            @click="showDeleteModal = false"
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            :loading="organizationStore.loading"
            @click="handleDelete"
          >
            Удалить
          </Button>
        </template>
      </Dialog>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { Header } from '@/widgets'
import { Button, Input, Card, Select, Textarea, Badge } from '@/shared/ui'
import { useOrganizationStore } from '@/entities/organization'
import type { Organization, CreateOrganizationData, UpdateOrganizationData } from '@/shared/lib/types'

const organizationStore = useOrganizationStore()

// Состояние
const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const organizationToDelete = ref<Organization | null>(null)

// Форма
const form = reactive({
  name: '',
  phone: '',
  description: '',
  status: 'active'
})

const errors = reactive({
  name: '',
  phone: '',
  description: '',
  status: ''
})

// Опции
const statusOptions = [
  { label: 'Все статусы', value: '' },
  { label: 'Активная', value: 'active' },
  { label: 'Неактивная', value: 'inactive' },
  { label: 'Заблокирована', value: 'blocked' }
]

// Вычисляемые свойства
const filteredOrganizations = computed(() => {
  let filtered = organizationStore.organizations

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(org =>
      org.name.toLowerCase().includes(query) ||
      (org.description?.toLowerCase().includes(query)) ||
      (org.phone?.includes(query))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(org => org.status === statusFilter.value)
  }

  return filtered
})

// Методы
const loadOrganizations = async () => {
  await organizationStore.fetchOrganizations()
}

const validateForm = () => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Название организации обязательно'
    isValid = false
  }


  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    if (isEditing.value && organizationToDelete.value) {
      const updateData: UpdateOrganizationData = {
        name: form.name,
        phone: form.phone || undefined,
        description: form.description || undefined,
        status: form.status as any
      }
      await organizationStore.updateOrganization(organizationToDelete.value.id, updateData)
    } else {
      const createData: CreateOrganizationData = {
        name: form.name,
        phone: form.phone || undefined,
        description: form.description || undefined
      }
      await organizationStore.createOrganization(createData)
    }

    closeModal()
    await loadOrganizations()
  } catch (error) {
  }
}

const viewOrganization = (organization: Organization) => {
  // TODO: Реализовать просмотр организации
}

const editOrganization = (organization: Organization) => {
  isEditing.value = true
  organizationToDelete.value = organization

  form.name = organization.name
  form.phone = organization.phone || ''
  form.description = organization.description || ''
  form.status = organization.status

  showCreateModal.value = true
}

const confirmDelete = (organization: Organization) => {
  organizationToDelete.value = organization
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!organizationToDelete.value) return

  try {
    await organizationStore.deleteOrganization(organizationToDelete.value.id)
    showDeleteModal.value = false
    organizationToDelete.value = null
    await loadOrganizations()
  } catch (error) {
  }
}

const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  organizationToDelete.value = null

  // Сброс формы
  form.name = ''
  form.phone = ''
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
    active: 'Активная',
    inactive: 'Неактивная',
    blocked: 'Заблокирована'
  }
  return labels[status] || status
}

const getStatusSeverity = (status: string) => {
  const severities: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    blocked: 'danger'
  }
  return severities[status] || 'info'
}

onMounted(() => {
  loadOrganizations()
})
</script>

<style scoped>
.organizations-admin-page {
  min-height: 100vh;
}

.organizations-content {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
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
  max-width: 400px;
}

.status-filter {
  min-width: 150px;
}

.organizations-table-card {
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.organizations-table {
  width: 100%;
  border-collapse: collapse;
}

.organizations-table th,
.organizations-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.organizations-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.organization-name strong {
  color: #1f2937;
}

.organization-name .description {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.organization-form {
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

.warning-text {
  color: #dc2626;
  font-weight: 500;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .organizations-content {
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
}
</style>
