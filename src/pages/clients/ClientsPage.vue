<template>
  <AdminLayout>
    <template #title>Клиенты</template>
    <template #subtitle>Управление клиентами</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск клиентов..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="handleAddClient"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Добавить клиента
          </button>
        </div>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка клиентов...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица клиентов -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Клиент</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Телефон</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Email</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Компания</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ client.id }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <span class="text-xs font-medium text-green-700 dark:text-green-300">
                          {{ client.name.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ client.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ client.phone }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ client.email || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span v-if="client.company" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    {{ client.company.name }}
                  </span>
                  <span v-else class="text-gray-500 dark:text-gray-400">Без компании</span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    client.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ client.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewClient(client)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      @click="editClient(client)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="confirmDelete(client)"
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

    <!-- Диалог добавления/редактирования клиента -->
    <ClientDialog
      v-if="showAddClientDialog || showEditDialog"
      :client="selectedClient || undefined"
      :is-edit="showEditDialog"
      :companies="companies"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <ClientViewDialog
      v-if="showViewDialog"
      :client="selectedClient"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление клиента'"
      :message="`Вы уверены, что хотите удалить клиента '${selectedClient?.name}'?`"
      @confirm="deleteClient"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { clientsApi, type Client, type CreateClientData, type UpdateClientData } from '@/shared/api/clients'
import { companiesApi, type Company } from '@/shared/api/companies'
import { useAuthStore } from '@/features/auth'
import ClientDialog from './components/ClientDialog.vue'
import ClientViewDialog from './components/ClientViewDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = useAuthStore()
const searchQuery = ref('')
const showAddClientDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedClient = ref<Client | null>(null)
const clients = ref<Client[]>([])
const companies = ref<Company[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value

  const query = searchQuery.value.toLowerCase()
  return clients.value.filter(client =>
    client.name.toLowerCase().includes(query) ||
    client.email?.toLowerCase().includes(query) ||
    client.phone?.includes(query) ||
    client.company?.name.toLowerCase().includes(query)
  )
})

const loadCompanies = async () => {
  try {
    const response = await companiesApi.getCompanies({ per_page: 100 })
    if (response.data && Array.isArray(response.data)) {
      companies.value = response.data.filter(company => company.is_active)
    }
  } catch (err) {
  }
}

const loadClients = async () => {
  try {
    loading.value = true
    error.value = null

    if (!authStore.isAuthenticated) {
      clients.value = []
      return
    }

    const response = await clientsApi.getClients({
      per_page: 50,
      search: searchQuery.value || undefined
    })


    if (response.data && Array.isArray(response.data)) {
      clients.value = response.data
    } else if (Array.isArray(response)) {
      clients.value = response
    } else {
      clients.value = []
      error.value = 'Неожиданный формат ответа от сервера'
    }
  } catch (err) {
    clients.value = []
    error.value = 'Ошибка загрузки данных с сервера'
  } finally {
    loading.value = false
  }
}

const viewClient = (client: Client) => {
  selectedClient.value = client
  showViewDialog.value = true
}

const editClient = (client: Client) => {
  selectedClient.value = client
  showEditDialog.value = true
}

const confirmDelete = (client: Client) => {
  selectedClient.value = client
  showDeleteDialog.value = true
}

const handleAddClient = () => {
  showAddClientDialog.value = true
}

const closeDialog = () => {
  showAddClientDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedClient.value = null
}

const handleSave = async (clientData: CreateClientData | UpdateClientData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedClient.value) {
      await clientsApi.updateClient(selectedClient.value.id, clientData as UpdateClientData)
    } else {
      await clientsApi.createClient(clientData as CreateClientData)
    }

    // Перезагружаем список клиентов для получения актуальных данных
    await loadClients()
    
    // Также обновляем список компаний если была создана новая
    await loadCompanies()

    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Клиент обновлен' : 'Клиент создан',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения клиента'

    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения клиента',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const deleteClient = async () => {
  if (!selectedClient.value) return

  try {
    loading.value = true

    await clientsApi.deleteClient(selectedClient.value.id)

    const index = clients.value.findIndex(client => client.id === selectedClient.value?.id)
    if (index !== -1) {
      clients.value.splice(index, 1)
    }

    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Клиент удален',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления клиента'

    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления клиента',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadClients()
  }, 500)
})

onMounted(() => {
  loadCompanies()
  loadClients()
})
</script>
