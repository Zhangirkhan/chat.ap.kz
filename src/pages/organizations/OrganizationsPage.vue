<template>
  <AdminLayout>
    <template #title>Организации</template>
    <template #subtitle>Управление организациями</template>

    <div class="space-y-8">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <i class="pi pi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск по названию, slug или описанию..."
                class="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 font-inter text-sm"
              />
            </div>
          </div>
          <button
            @click="showAddDialog = true"
            class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl font-medium font-inter"
          >
            <i class="pi pi-plus text-sm"></i>
            Добавить организацию
          </button>
        </div>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
        <div class="flex flex-col items-center gap-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span class="text-gray-900 dark:text-gray-400 font-inter text-sm">Загрузка организаций...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <i class="pi pi-exclamation-triangle text-red-500 text-lg"></i>
          </div>
          <div>
            <h3 class="text-red-800 dark:text-red-300 font-medium font-inter mb-1">Ошибка загрузки</h3>
            <p class="text-red-700 dark:text-red-400 text-sm font-inter">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Таблица организаций -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <!-- Мобильная версия (карточки) -->
          <div class="block lg:hidden space-y-4 p-6">
            <div v-for="organization in filteredOrganizations" :key="organization.id"
                 class="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 space-y-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white font-inter text-lg mb-1">
                    {{ organization.name }}
                  </h3>
                  <p class="text-sm text-gray-900 dark:text-gray-400 font-inter">
                    ID: {{ organization.id }}
                  </p>
                </div>
                <span :class="[
                  'inline-flex px-3 py-1 text-xs font-semibold rounded-full font-inter',
                  organization.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                ]">
                  {{ organization.is_active ? 'Активна' : 'Неактивна' }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-900 dark:text-gray-400 font-inter">Slug:</span>
                  <p class="text-gray-900 dark:text-white font-inter mt-1">{{ organization.slug || '-' }}</p>
                </div>
                <div>
                  <span class="text-gray-900 dark:text-gray-400 font-inter">Описание:</span>
                  <p class="text-gray-900 dark:text-white font-inter mt-1">{{ organization.description || '-' }}</p>
                </div>
                <div>
                  <span class="text-gray-900 dark:text-gray-400 font-inter">Отделы:</span>
                  <div class="flex items-center gap-2 mt-1">
                    <i class="pi pi-building text-gray-400 text-xs"></i>
                    <span class="text-gray-900 dark:text-white font-inter">{{ organization.departments_count || 0 }}</span>
                  </div>
                </div>
                <div>
                  <span class="text-gray-900 dark:text-gray-400 font-inter">Пользователи:</span>
                  <div class="flex items-center gap-2 mt-1">
                    <i class="pi pi-users text-gray-400 text-xs"></i>
                    <span class="text-gray-900 dark:text-white font-inter">{{ organization.users_count || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  @click="viewOrganization(organization)"
                  class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  title="Просмотр"
                >
                  <i class="pi pi-eye text-sm"></i>
                </button>
                <button
                  @click="editOrganization(organization)"
                  class="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                  title="Редактировать"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                
                <button
                  @click="confirmDelete(organization)"
                  class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  title="Удалить"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Десктопная версия (таблица) -->
          <table class="w-full min-w-[900px] hidden lg:table">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">ID</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">Название</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">Slug</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">Описание</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">Отделы</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">Пользователи</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">Статус</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider font-inter">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700/50">
              <tr v-for="organization in filteredOrganizations" :key="organization.id"
                  class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                <td class="px-6 py-5 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900 dark:text-white font-inter">{{ organization.id }}</span>
                </td>
                <td class="px-6 py-5">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white font-inter max-w-[200px] truncate">
                    {{ organization.name }}
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <span class="text-sm text-gray-900 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {{ organization.slug || '-' }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <div class="text-sm text-gray-900 dark:text-gray-300 font-inter max-w-[250px] truncate">
                    {{ organization.description || '-' }}
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <i class="pi pi-building text-blue-600 dark:text-blue-400 text-xs"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white font-inter">
                      {{ organization.departments_count || 0 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <i class="pi pi-users text-green-600 dark:text-green-400 text-xs"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white font-inter">
                      {{ organization.users_count || 0 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-3 py-1.5 text-xs font-semibold rounded-full font-inter',
                    organization.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ organization.is_active ? 'Активна' : 'Неактивна' }}
                  </span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewOrganization(organization)"
                      class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye text-sm"></i>
                    </button>
                    <button
                      @click="editOrganization(organization)"
                      class="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil text-sm"></i>
                    </button>
                    
                    <button
                      @click="confirmDelete(organization)"
                      class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      title="Удалить"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            </table>
          </div>
      </div>
    </div>

    <!-- Диалог добавления/редактирования -->
    <OrganizationDialog
      v-if="showAddDialog || showEditDialog"
      :organization="selectedOrganization"
      :is-edit="showEditDialog"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <OrganizationViewDialog
      v-if="showViewDialog"
      :organization="selectedOrganization"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление организации'"
      :message="`Вы уверены, что хотите удалить организацию '${selectedOrganization?.name}'?`"
      @confirm="deleteOrganization"
      @cancel="showDeleteDialog = false"
    />

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { organizationApi } from '@/entities/organization'
import type { Organization, CreateOrganizationData, UpdateOrganizationData } from '@/shared/lib/types'
import OrganizationDialog from './components/OrganizationDialog.vue'
import OrganizationViewDialog from './components/OrganizationViewDialog.vue'
import ConfirmDialog from '@/shared/ui/ConfirmDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedOrganization = ref<Organization | null>(null)
const organizations = ref<Organization[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const filteredOrganizations = computed(() => {
  if (!searchQuery.value) return organizations.value

  const query = searchQuery.value.toLowerCase()
  return organizations.value.filter(org =>
    org.name.toLowerCase().includes(query) ||
    (org.description?.toLowerCase().includes(query)) ||
    (org.slug?.toLowerCase().includes(query))
  )
})

const loadOrganizations = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await organizationApi.getOrganizations({
      per_page: 50,
      search: searchQuery.value || undefined
    })


    // Проверяем формат ответа
    if (response.data && Array.isArray(response.data)) {
      organizations.value = response.data
    } else if (Array.isArray(response)) {
      organizations.value = response
    } else {
      organizations.value = []
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки организаций'
    organizations.value = []
  } finally {
    loading.value = false
  }
}

const viewOrganization = (organization: Organization) => {
  selectedOrganization.value = organization
  showViewDialog.value = true
}

const editOrganization = (organization: Organization) => {
  selectedOrganization.value = organization
  showEditDialog.value = true
}

const confirmDelete = (organization: Organization) => {
  selectedOrganization.value = organization
  showDeleteDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedOrganization.value = null
}

const handleSave = async (organizationData: CreateOrganizationData | UpdateOrganizationData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedOrganization.value) {
      // Редактирование существующей организации
      const response = await organizationApi.updateOrganization(selectedOrganization.value.id, organizationData as UpdateOrganizationData)

      
      const index = organizations.value.findIndex(org => org.id === selectedOrganization.value?.id)
      if (index !== -1) {
        // Поддержка разных форматов ответа
        const updated = (response as any).data?.organization || (response as any).organization || (response as any).data
        if (updated) {
          organizations.value[index] = updated
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }
    } else {
      // Добавление новой организации
      const response = await organizationApi.createOrganization(organizationData as CreateOrganizationData)

      
      // Поддержка разных форматов ответа
      const created = (response as any).data?.organization || (response as any).organization || (response as any).data
      if (created) {
        organizations.value.push(created)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Организация обновлена' : 'Организация создана',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения организации'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения организации',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const deleteOrganization = async () => {
  if (!selectedOrganization.value) return

  try {
    loading.value = true

    await organizationApi.deleteOrganization(selectedOrganization.value.id)

    const index = organizations.value.findIndex(org => org.id === selectedOrganization.value?.id)
    if (index !== -1) {
      organizations.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Организация удалена',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления организации'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления организации',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

// Удалено тестирование webhook из списка организаций по требованию

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    loadOrganizations()
  }, 500)
})

onMounted(() => {
  loadOrganizations()
})
</script>


