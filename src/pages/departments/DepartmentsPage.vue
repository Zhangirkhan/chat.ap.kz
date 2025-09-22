<template>
  <AdminLayout>
    <template #title>Отделы</template>
    <template #subtitle>Управление отделами организации</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск отделов..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          @click="showAddDialog = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Добавить отдел
        </button>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка отделов...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица отделов -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Название</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Slug</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Описание</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Организация</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Пользователи</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Чат-бот</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="department in filteredDepartments" :key="department.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ department.id }}</td>
                <td class="px-3 py-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ department.name }}</div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate">-</td>
                <td class="px-3 py-3 text-sm text-gray-900 dark:text-white truncate">{{ department.description || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="truncate">{{ department.organization?.name || getOrganizationName(department.organization_id) }}</div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-users text-gray-400"></i>
                    {{ department.users_count || 0 }}
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    department.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ department.status === 'active' ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span v-if="department.show_in_chatbot" :class="[
                      'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    ]">
                      <i class="pi pi-comments"></i>
                      #{{ department.chatbot_order }}
                    </span>
                    <span v-else class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      <i class="pi pi-minus"></i>
                      Откл.
                    </span>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewDepartment(department)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      @click="editDepartment(department)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="confirmDelete(department)"
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
    <DepartmentDialog
      v-if="showAddDialog || showEditDialog"
      :department="selectedDepartment || undefined"
      :is-edit="showEditDialog"
      :organizations="organizations"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <DepartmentViewDialog
      v-if="showViewDialog"
      :department="selectedDepartment!"
      :organizations="organizations"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление отдела'"
      :message="`Вы уверены, что хотите удалить отдел '${selectedDepartment?.name}'?`"
      @confirm="deleteDepartment"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { departmentApi } from '@/entities/department'
import { useOrganizationStore } from '@/entities/organization'
import type { Department, CreateDepartmentData, UpdateDepartmentData, Organization } from '@/shared/lib/types'
import DepartmentDialog from './components/DepartmentDialog.vue'
import DepartmentViewDialog from './components/DepartmentViewDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const organizationStore = useOrganizationStore()
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedDepartment = ref<Department | null>(null)
const departments = ref<Department[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Используем организации из store
const organizations = computed(() => organizationStore.organizations)

const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value

  const query = searchQuery.value.toLowerCase()
  return departments.value.filter(dept =>
    dept.name.toLowerCase().includes(query) ||
    (dept.description && dept.description.toLowerCase().includes(query)) ||
    (dept.organization && dept.organization.name.toLowerCase().includes(query))
  )
})

const getOrganizationName = (organizationId: number) => {
  const org = organizations.value.find(o => o.id === organizationId)
  return org ? org.name : 'Неизвестная организация'
}

const loadOrganizations = async () => {
  try {
    await organizationStore.getOrganizations()
  } catch (err) {
  }
}

const loadDepartments = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await departmentApi.getDepartments({
      per_page: 50,
      search: searchQuery.value || undefined
    })


    // Проверяем формат ответа
    if (response.data && Array.isArray(response.data)) {
      departments.value = response.data
    } else if (Array.isArray(response)) {
      departments.value = response
    } else {
      departments.value = []
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки отделов'
    departments.value = []
  } finally {
    loading.value = false
  }
}

const viewDepartment = (department: Department) => {
  selectedDepartment.value = department
  showViewDialog.value = true
}

const editDepartment = (department: Department) => {
  selectedDepartment.value = department
  showEditDialog.value = true
}

const confirmDelete = (department: Department) => {
  selectedDepartment.value = department
  showDeleteDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedDepartment.value = null
}

const handleSave = async (departmentData: CreateDepartmentData | UpdateDepartmentData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedDepartment.value) {
      // Редактирование существующего отдела
      const response = await departmentApi.updateDepartment(selectedDepartment.value.id, departmentData as UpdateDepartmentData)


      const index = departments.value.findIndex(dept => dept.id === selectedDepartment.value?.id)
      if (index !== -1) {
        // Используем данные из response.data
        if (response.data) {
          departments.value[index] = response.data
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }
    } else {
      // Добавление нового отдела
      const response = await departmentApi.createDepartment(departmentData as CreateDepartmentData)


      // Используем данные из response.data
      if (response.data) {
        departments.value.push(response.data)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Отдел обновлен' : 'Отдел создан',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения отдела'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения отдела',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const deleteDepartment = async () => {
  if (!selectedDepartment.value) return

  try {
    loading.value = true

    await departmentApi.deleteDepartment(selectedDepartment.value.id)

    const index = departments.value.findIndex(dept => dept.id === selectedDepartment.value?.id)
    if (index !== -1) {
      departments.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Отдел удален',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления отдела'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления отдела',
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
    loadDepartments()
  }, 500)
})

onMounted(() => {
  loadOrganizations()
  loadDepartments()
})
</script>

<style scoped>
/* Все стили в Tailwind CSS */
</style>
