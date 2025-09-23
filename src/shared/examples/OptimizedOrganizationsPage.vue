<template>
  <AdminLayout>
    <template #title>Организации (Оптимизированная версия)</template>
    <template #subtitle>Управление организациями с улучшенной производительностью</template>

    <div class="space-y-6">
      <!-- Заголовок с кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Организации</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Всего: {{ organizations.length }} | 
            Кэш: {{ cacheStats.hitRate.toFixed(1) }}% | 
            SSE: {{ sseConnected ? 'Подключено' : 'Отключено' }}
          </p>
        </div>
        <button
          @click="openCreateDialog"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Добавить организацию
        </button>
      </div>

      <!-- Фильтры -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="relative flex-1 w-full">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по названию, телефону..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            v-model="statusFilter"
            class="w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все статусы</option>
            <option value="active">Активна</option>
            <option value="inactive">Неактивна</option>
          </select>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <i class="pi pi-refresh"></i>
            Обновить
          </button>
        </div>
      </div>

      <!-- Таблица с виртуализацией -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <VirtualList
          :items="filteredOrganizations"
          :item-height="80"
          :container-height="600"
          :loading="loading"
        >
          <template #default="{ item: organization }">
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <i class="pi pi-building text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ organization.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ organization.phone }}</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  organization.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                ]">
                  {{ organization.is_active ? 'Активна' : 'Неактивна' }}
                </span>
                <div class="flex items-center gap-1">
                  <button
                    @click="openViewDialog(organization)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                    title="Просмотр"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button
                    @click="openEditDialog(organization)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                    title="Редактировать"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="openDeleteDialog(organization)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Удалить"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </template>
          
          <template #loading>
            <div class="flex items-center justify-center p-8">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-500"></i>
              <span class="ml-3 text-gray-600 dark:text-gray-400">Загрузка организаций...</span>
            </div>
          </template>
        </VirtualList>
      </div>
    </div>

    <!-- Диалоги -->
    <UniversalDialog
      name="organization-create"
      title="Создание организации"
      @confirm="handleCreate"
      @cancel="closeCreateDialog"
    >
      <OrganizationForm
        :mode="'create'"
        @submit="handleCreate"
        @cancel="closeCreateDialog"
      />
    </UniversalDialog>

    <UniversalDialog
      name="organization-edit"
      title="Редактирование организации"
      @confirm="handleUpdate"
      @cancel="closeEditDialog"
    >
      <OrganizationForm
        :mode="'edit'"
        :organization="selectedOrganization"
        @submit="handleUpdate"
        @cancel="closeEditDialog"
      />
    </UniversalDialog>

    <UniversalDialog
      name="organization-view"
      title="Просмотр организации"
      @cancel="closeViewDialog"
    >
      <OrganizationView :organization="selectedOrganization" />
    </UniversalDialog>

    <ConfirmDialog
      name="organization-delete"
      title="Удаление организации"
      :message="`Вы уверены, что хотите удалить организацию '${selectedOrganization?.name}'?`"
      type="danger"
      @confirm="handleDelete"
      @cancel="closeDeleteDialog"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import VirtualList from '@/shared/ui/VirtualList.vue'
import UniversalDialog from '@/shared/ui/UniversalDialog.vue'
import ConfirmDialog from '@/shared/ui/ConfirmDialog.vue'
import OrganizationForm from '@/pages/organizations/components/OrganizationForm.vue'
import OrganizationView from '@/pages/organizations/components/OrganizationView.vue'

import { useCachedOrganizations } from '@/shared/api/CachedOrganizationsApi'
import { useFormDialog, useConfirmDialog } from '@/shared/composables/useDialog'
import { usePerformanceOptimization } from '@/shared/composables/usePerformanceOptimization'
import { useOptimizedChats } from '@/shared/composables/useOptimizedChats'
import type { Organization } from '@/shared/api/UnifiedOrganizationsApi'

// API и кэширование
const {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = useCachedOrganizations()

// Диалоги
const createDialog = useFormDialog('organization-create')
const editDialog = useFormDialog('organization-edit')
const viewDialog = useFormDialog('organization-view')
const deleteDialog = useConfirmDialog('organization-delete')

// Производительность
const { performanceStats } = usePerformanceOptimization()

// SSE для чатов (для демонстрации)
const { sseConnected } = useOptimizedChats()

// Состояние
const organizations = ref<Organization[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const selectedOrganization = ref<Organization | null>(null)

// Вычисляемые свойства
const filteredOrganizations = computed(() => {
  let filtered = organizations.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(org =>
      org.name.toLowerCase().includes(query) ||
      org.phone?.includes(query) ||
      org.description?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(org =>
      org.is_active === (statusFilter.value === 'active')
    )
  }

  return filtered
})

const cacheStats = computed(() => ({
  hitRate: getOrganizations.hitRate.value
}))

// Методы
const loadOrganizations = async () => {
  const result = await getOrganizations.execute()
  if (result) {
    organizations.value = result.data
  }
}

const refreshData = () => {
  getOrganizations.refresh()
  loadOrganizations()
}

const openCreateDialog = () => {
  createDialog.openForCreate()
}

const closeCreateDialog = () => {
  createDialog.close()
}

const openEditDialog = (organization: Organization) => {
  selectedOrganization.value = organization
  editDialog.openForEdit(organization)
}

const closeEditDialog = () => {
  editDialog.close()
  selectedOrganization.value = null
}

const openViewDialog = (organization: Organization) => {
  selectedOrganization.value = organization
  viewDialog.openForView(organization)
}

const closeViewDialog = () => {
  viewDialog.close()
  selectedOrganization.value = null
}

const openDeleteDialog = (organization: Organization) => {
  selectedOrganization.value = organization
  deleteDialog.confirmDelete(organization.name)
}

const closeDeleteDialog = () => {
  deleteDialog.close()
  selectedOrganization.value = null
}

const handleCreate = async (data: any) => {
  await createOrganization(data)
  await loadOrganizations()
  closeCreateDialog()
}

const handleUpdate = async (data: any) => {
  if (selectedOrganization.value?.id) {
    await updateOrganization(selectedOrganization.value.id, data)
    await loadOrganizations()
    closeEditDialog()
  }
}

const handleDelete = async () => {
  if (selectedOrganization.value?.id) {
    await deleteOrganization(selectedOrganization.value.id)
    await loadOrganizations()
    closeDeleteDialog()
  }
}

// Поиск с debounce
const debouncedSearch = usePerformanceOptimization().useDebounce(() => {
  if (searchQuery.value.length >= 3) {
    // Здесь можно добавить API поиск
  }
}, 300)

watch(searchQuery, debouncedSearch)

// Инициализация
onMounted(() => {
  loadOrganizations()
})
</script>
