<template>
  <AdminLayout>
    <template #title>Должности</template>
    <template #subtitle>Управление должностями в организации</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск должностей..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          @click="showAddDialog = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Добавить должность
        </button>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка должностей...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица должностей -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Название</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Slug</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Описание</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Разрешения</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Пользователи</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="position in filteredPositions" :key="position.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ position.id }}</td>
                <td class="px-3 py-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ position.name }}</div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate">{{ position.slug || '-' }}</td>
                <td class="px-3 py-3 text-sm text-gray-900 dark:text-white truncate">{{ position.description || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="permission in position.permissions?.slice(0, 2)" :key="permission"
                          class="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded">
                      {{ permission }}
                    </span>
                    <span v-if="position.permissions?.length > 2"
                          class="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      +{{ position.permissions.length - 2 }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-users text-gray-400"></i>
                    {{ position.users_count || 0 }}
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    position.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ position.is_active ? 'Активна' : 'Неактивна' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewPosition(position)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      @click="editPosition(position)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="confirmDelete(position)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Удалить"
                    >
                      <i class="pi pi-trash"></i>
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
    <PositionDialog
      v-if="showAddDialog || showEditDialog"
      :position="selectedPosition"
      :is-edit="showEditDialog"
      :departments="departments"
      :organizations="organizations"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <PositionViewDialog
      v-if="showViewDialog"
      :position="selectedPosition"
      :departments="departments"
      :organizations="organizations"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление должности'"
      :message="`Вы уверены, что хотите удалить должность '${selectedPosition?.name}'?`"
      @confirm="deletePosition"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { positionsApi, type Position, type CreatePositionData, type UpdatePositionData, AVAILABLE_PERMISSIONS } from '@/shared/api/positions'
import PositionDialog from './components/PositionDialog.vue'
import PositionViewDialog from './components/PositionViewDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedPosition = ref<Position | null>(null)
const positions = ref<Position[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const departments = ref<any[]>([])
const organizations = ref<any[]>([])

const filteredPositions = computed(() => {
  if (!searchQuery.value) return positions.value

  const query = searchQuery.value.toLowerCase()
  return positions.value.filter(pos =>
    pos.name.toLowerCase().includes(query) ||
    (pos.description && pos.description.toLowerCase().includes(query)) ||
    (pos.slug && pos.slug.toLowerCase().includes(query))
  )
})

const getDepartmentName = (departmentId: any) => {
  const dept = departments.value.find(d => d.id === departmentId)
  return dept ? dept.name : 'Неизвестный отдел'
}

const getOrganizationName = (organizationId: any) => {
  const org = organizations.value.find(o => o.id === organizationId)
  return org ? org.name : 'Неизвестная организация'
}

const formatSalary = (salary: any) => {
  if (!salary || salary === 0) return 'Не указана'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(salary)
}

const loadOrganizations = async () => {
  // Здесь должен быть API запрос для получения организаций
  organizations.value = [
    {
      id: 1,
      name: 'ООО Компания',
      email: 'info@company.com',
      phone: '+7 777 123 45 67',
      address: 'г. Алматы, ул. Абая, 1',
      description: 'Крупная IT компания',
      webhook_url: 'https://webhook.site/12345678-1234-1234-1234-123456789012',
      webhook_token: 'token_123456789',
      users_count: 25,
      status: 'active',
      created_at: '2024-01-01T12:00:00.000000Z'
    },
    {
      id: 2,
      name: 'ТОО Стартап',
      email: 'hello@startup.kz',
      phone: '+7 777 987 65 43',
      address: 'г. Нур-Султан, ул. Кенесары, 10',
      description: 'Инновационный стартап',
      webhook_url: null,
      webhook_token: null,
      users_count: 8,
      status: 'active',
      created_at: '2024-01-05T09:00:00.000000Z'
    },
    {
      id: 3,
      name: 'ИП Иванов',
      email: 'ivanov@example.com',
      phone: '+7 777 555 44 33',
      address: 'г. Шымкент, ул. Байтурсынова, 5',
      description: 'Индивидуальный предприниматель',
      webhook_url: 'https://webhook.site/87654321-4321-4321-4321-210987654321',
      webhook_token: 'token_987654321',
      users_count: 1,
      status: 'inactive',
      created_at: '2023-12-20T10:00:00.000000Z'
    }
  ]
}

const loadDepartments = async () => {
  // Здесь должен быть API запрос для получения отделов
  departments.value = [
    {
      id: 1,
      name: 'IT отдел',
      description: 'Разработка и поддержка IT инфраструктуры',
      manager: 'Иван Петров',
      organization_id: 1,
      employee_count: 12,
      status: 'active',
      created_at: '2024-01-01T12:00:00.000000Z'
    },
    {
      id: 2,
      name: 'Отдел продаж',
      description: 'Работа с клиентами и продажи',
      manager: 'Мария Сидорова',
      organization_id: 1,
      employee_count: 8,
      status: 'active',
      created_at: '2024-01-02T10:00:00.000000Z'
    },
    {
      id: 3,
      name: 'HR отдел',
      description: 'Управление персоналом',
      manager: 'Анна Козлова',
      organization_id: 1,
      employee_count: 5,
      status: 'active',
      created_at: '2024-01-03T09:00:00.000000Z'
    },
    {
      id: 4,
      name: 'Отдел разработки',
      description: 'Создание программного обеспечения',
      manager: 'Алексей Смирнов',
      organization_id: 2,
      employee_count: 15,
      status: 'active',
      created_at: '2024-01-04T11:00:00.000000Z'
    },
    {
      id: 5,
      name: 'Маркетинг',
      description: 'Продвижение продуктов и услуг',
      manager: 'Елена Волкова',
      organization_id: 2,
      employee_count: 6,
      status: 'active',
      created_at: '2024-01-05T14:00:00.000000Z'
    },
    {
      id: 6,
      name: 'Бухгалтерия',
      description: 'Финансовый учет и отчетность',
      manager: 'Ольга Новикова',
      organization_id: 3,
      employee_count: 3,
      status: 'inactive',
      created_at: '2024-01-06T16:00:00.000000Z'
    }
  ]
}

const loadPositions = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await positionsApi.getPositions({
      per_page: 50,
      search: searchQuery.value || undefined
    })


    // Проверяем формат ответа
    if (response.data && Array.isArray(response.data)) {
      positions.value = response.data
    } else if (Array.isArray(response)) {
      positions.value = response
    } else {
      positions.value = []
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки должностей'
    positions.value = []
  } finally {
    loading.value = false
  }
}

const viewPosition = (position: any) => {
  selectedPosition.value = position
  showViewDialog.value = true
}

const editPosition = (position: any) => {
  selectedPosition.value = position
  showEditDialog.value = true
}

const confirmDelete = (position: any) => {
  selectedPosition.value = position
  showDeleteDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedPosition.value = null
}

const handleSave = async (positionData: CreatePositionData | UpdatePositionData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedPosition.value) {
      // Редактирование существующей должности
      const response = await positionsApi.updatePosition(selectedPosition.value.id, positionData as UpdatePositionData)


      const index = positions.value.findIndex(pos => pos.id === selectedPosition.value?.id)
      if (index !== -1) {
        // Проверяем формат ответа
        if (response.position) {
          positions.value[index] = response.position
        } else if (response.data && response.data.id) {
          positions.value[index] = response.data
        } else if (response.id) {
          positions.value[index] = response
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }
    } else {
      // Добавление новой должности
      const response = await positionsApi.createPosition(positionData as CreatePositionData)


      // Проверяем формат ответа
      if (response.position) {
        positions.value.push(response.position)
      } else if (response.data && response.data.id) {
        positions.value.push(response.data)
      } else if (response.id) {
        positions.value.push(response)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Должность обновлена' : 'Должность создана',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения должности'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения должности',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const deletePosition = async () => {
  if (!selectedPosition.value) return

  try {
    loading.value = true

    await positionsApi.deletePosition(selectedPosition.value.id)

    const index = positions.value.findIndex(pos => pos.id === selectedPosition.value?.id)
    if (index !== -1) {
      positions.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Должность удалена',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления должности'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления должности',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadPositions()
  }, 500)
})

onMounted(() => {
  loadPositions()
})
</script>

<style scoped>
/* Все стили в Tailwind CSS */
</style>
