<template>
  <AdminLayout>
    <template #title>Контрагенты</template>
    <template #subtitle>Управление клиентами и контрагентами</template>

    <div class="space-y-6">
      <!-- Вкладки -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'individual'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === 'individual'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <i class="pi pi-user mr-2"></i>
            Физические лица
          </button>
          <button
            @click="activeTab = 'legal'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === 'legal'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <i class="pi pi-building mr-2"></i>
            Юридические лица
          </button>
        </nav>
      </div>

      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="`Поиск ${activeTab === 'individual' ? 'физических лиц' : 'юридических лиц'}...`"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="handleAddContractor"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Добавить контрагента
          </button>
        </div>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка контрагентов...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица контрагентов -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Контрагент</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Тип</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">ИНН</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Email</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Телефон</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Клиенты</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="contractor in filteredContractors" :key="contractor.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ contractor.id }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <span class="text-xs font-medium text-purple-700 dark:text-purple-300">
                          {{ contractor.name.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ contractor.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    contractor.type === 'individual'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  ]">
                    {{ contractor.type === 'individual' ? 'Физ. лицо' : 'Юр. лицо' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ contractor.inn || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ contractor.email || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ contractor.phone || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-users text-gray-400"></i>
                    {{ contractor.clients_count || 0 }}
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    contractor.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ contractor.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewContractor(contractor)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      @click="editContractor(contractor)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="confirmDelete(contractor)"
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



    <!-- Диалог добавления/редактирования контрагента -->
    <ContractorDialog
      v-if="showAddContractorDialog || showEditDialog"
      :contractor="selectedContractor || undefined"
      :is-edit="showEditDialog"
      :organizations="organizationStore.organizations"
      @close="closeDialog"
      @save="handleSave"
    />


    <!-- Диалог просмотра -->
    <ContractorViewDialog
      v-if="showViewDialog"
      :contractor="selectedContractor"
      :organizations="organizationStore.organizations"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление контрагента'"
      :message="`Вы уверены, что хотите удалить контрагента '${selectedContractor?.name}'?`"
      @confirm="deleteContractor"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { contractorsApi, type Contractor, type CreateContractorData, type UpdateContractorData } from '@/shared/api/contractors'
import { useOrganizationStore } from '@/entities/organization'
import { useAuthStore } from '@/features/auth'
import ContractorDialog from './components/ContractorDialog.vue'
import ContractorViewDialog from './components/ContractorViewDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = useAuthStore()
const organizationStore = useOrganizationStore()
const searchQuery = ref('')
const activeTab = ref<'individual' | 'legal'>('individual')
const showAddContractorDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedContractor = ref<Contractor | null>(null)
const contractors = ref<Contractor[]>([])
const loading = ref(false)
const error = ref<string | null>(null)


const filteredContractors = computed(() => {
  const filtered = contractors.value.filter(contractor => contractor.type === activeTab.value)

  if (!searchQuery.value) return filtered

  const query = searchQuery.value.toLowerCase()
  return filtered.filter(contractor =>
    contractor.name.toLowerCase().includes(query) ||
    contractor.email?.toLowerCase().includes(query) ||
    contractor.phone?.includes(query) ||
    contractor.inn?.includes(query) ||
    (contractor.type === 'legal' && contractor.inn?.includes(query))
  )
})


const loadOrganizations = async () => {
  try {
    // Проверяем аутентификацию перед загрузкой данных
    if (!authStore.isAuthenticated) {
      return
    }

    await organizationStore.getOrganizations()
  } catch (err) {
  }
}

const loadContractors = async () => {
  try {
    loading.value = true
    error.value = null

    // Проверяем аутентификацию перед загрузкой данных
    if (!authStore.isAuthenticated) {
      contractors.value = []
      return
    }

    const response = await contractorsApi.getContractors({
      per_page: 50,
      search: searchQuery.value || undefined,
      type: activeTab.value
    })


    // Обрабатываем ответ в зависимости от формата
    if (response.data && Array.isArray(response.data)) {
      contractors.value = response.data
    } else if (Array.isArray(response)) {
      contractors.value = response
    } else {
      contractors.value = []
      error.value = 'Неожиданный формат ответа от сервера'
    }
  } catch (err) {
    contractors.value = []
    error.value = 'Ошибка загрузки данных с сервера'
  } finally {
    loading.value = false
  }
}

const viewContractor = (contractor: Contractor) => {
  selectedContractor.value = contractor
  showViewDialog.value = true
}

const editContractor = (contractor: Contractor) => {
  selectedContractor.value = contractor
  showEditDialog.value = true
}

const confirmDelete = (contractor: Contractor) => {
  selectedContractor.value = contractor
  showDeleteDialog.value = true
}

const handleAddContractor = () => {
  showAddContractorDialog.value = true
}

const closeDialog = () => {
  showAddContractorDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedContractor.value = null
}

const handleSave = async (contractorData: CreateContractorData | UpdateContractorData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedContractor.value) {
      // Редактирование существующего контрагента
      const response = await contractorsApi.updateContractor(selectedContractor.value.id, contractorData as UpdateContractorData)


      const index = contractors.value.findIndex(contractor => contractor.id === selectedContractor.value?.id)
      if (index !== -1) {
        // Проверяем формат ответа
        if (response.contractor) {
          contractors.value[index] = response.contractor
        } else if ((response as any).data?.id) {
          contractors.value[index] = (response as any).data
        } else if ((response as any).id) {
          contractors.value[index] = response as any
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }
    } else {
      // Добавление нового контрагента
      const response = await contractorsApi.createContractor(contractorData as CreateContractorData)


      // Проверяем формат ответа
      if (response.contractor) {
        contractors.value.push(response.contractor)
      } else if ((response as any).data?.id) {
        contractors.value.push((response as any).data)
      } else if ((response as any).id) {
        contractors.value.push(response as any)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Контрагент обновлен' : 'Контрагент создан',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения контрагента'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения контрагента',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}


const deleteContractor = async () => {
  if (!selectedContractor.value) return

  try {
    loading.value = true

    await contractorsApi.deleteContractor(selectedContractor.value.id)

    const index = contractors.value.findIndex(contractor => contractor.id === selectedContractor.value?.id)
    if (index !== -1) {
      contractors.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Контрагент удален',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления контрагента'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления контрагента',
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
    loadContractors()
  }, 500)
})

onMounted(() => {
  loadOrganizations()
  loadContractors()
})
</script>
