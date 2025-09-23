<template>
  <AdminLayout>
    <template #title>Компании</template>
    <template #subtitle>Управление компаниями</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск компаний..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          @click="showAddDialog = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Добавить компанию
        </button>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка компаний...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица компаний -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Название</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Email</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Телефон</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Адрес</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="company in filteredCompanies" :key="company.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ company.id }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <span class="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {{ company.name.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ company.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ company.email || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ company.phone || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ company.address || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    company.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ company.status === 'active' ? 'Активна' : 'Неактивна' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewCompany(company)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      @click="editCompany(company)"
                      class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="confirmDelete(company)"
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

      <!-- Пустое состояние -->
      <div v-if="!loading && filteredCompanies.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex flex-col items-center gap-4">
          <i class="pi pi-building text-4xl text-gray-400"></i>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Компании не найдены</h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Добавьте первую компанию' }}
            </p>
          </div>
          <button
            v-if="!searchQuery"
            @click="showAddDialog = true"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Добавить компанию
          </button>
        </div>
      </div>
    </div>

    <!-- Диалог добавления/редактирования -->
    <CompanyDialog
      v-if="showAddDialog || showEditDialog"
      :company="selectedCompany"
      :is-edit="showEditDialog"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <CompanyViewDialog
      v-if="showViewDialog"
      :company="selectedCompany"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление компании'"
      :message="`Вы уверены, что хотите удалить компанию '${selectedCompany?.name}'?`"
      @confirm="handleDelete"
      @cancel="closeDialog"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { organizationApi } from '@/entities/organization/api/organizationApi'
import type { Organization, CreateOrganizationData, UpdateOrganizationData } from '@/shared/lib/types'
import CompanyDialog from './components/CompanyDialog.vue'
import CompanyViewDialog from './components/CompanyViewDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedCompany = ref<Organization | null>(null)
const companies = ref<Organization[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const filteredCompanies = computed(() => {
  if (!searchQuery.value) return companies.value

  const query = searchQuery.value.toLowerCase()
  return companies.value.filter(company =>
    company.name.toLowerCase().includes(query) ||
    company.email?.toLowerCase().includes(query) ||
    company.phone?.includes(query) ||
    company.address?.toLowerCase().includes(query)
  )
})

const loadCompanies = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await organizationApi.getOrganizations({
      per_page: 100,
      search: searchQuery.value || undefined
    })


    // Проверяем формат ответа
    if (response.data && Array.isArray(response.data)) {
      companies.value = response.data
    } else if (Array.isArray(response)) {
      companies.value = response
    } else {
      companies.value = []
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки компаний'
    companies.value = []
  } finally {
    loading.value = false
  }
}

const viewCompany = (company: Organization) => {
  selectedCompany.value = company
  showViewDialog.value = true
}

const editCompany = (company: Organization) => {
  selectedCompany.value = company
  showEditDialog.value = true
}

const confirmDelete = (company: Organization) => {
  selectedCompany.value = company
  showDeleteDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedCompany.value = null
}

const handleSave = async (companyData: CreateOrganizationData | UpdateOrganizationData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedCompany.value) {
      // Редактирование существующей компании
      const response = await organizationApi.updateOrganization(selectedCompany.value.id, companyData as UpdateOrganizationData)


      const index = companies.value.findIndex(company => company.id === selectedCompany.value?.id)
      if (index !== -1) {
        // Проверяем формат ответа
        if (response.data && response.data.id) {
          companies.value[index] = response.data
        } else if ((response as any).id) {
          companies.value[index] = response as any
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }
    } else {
      // Добавление новой компании
      const response = await organizationApi.createOrganization(companyData as CreateOrganizationData)


      // Проверяем формат ответа
      if (response.data && response.data.id) {
        companies.value.push(response.data)
      } else if ((response as any).id) {
        companies.value.push(response as any)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Компания обновлена' : 'Компания создана',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения компании'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения компании',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedCompany.value) return

  try {
    loading.value = true

    await organizationApi.deleteOrganization(selectedCompany.value.id)

    // Удаляем компанию из списка
    const index = companies.value.findIndex(company => company.id === selectedCompany.value?.id)
    if (index !== -1) {
      companies.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Компания удалена',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления компании'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления компании',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

// Поиск с задержкой
let searchTimeout: NodeJS.Timeout | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadCompanies()
  }, 500)
})

onMounted(() => {
  loadCompanies()
})
</script>

<style scoped>
/* Все стили в Tailwind CSS */
</style>
