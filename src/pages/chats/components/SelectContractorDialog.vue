<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="close"
  >
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
      <!-- Заголовок -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Выберите контрагента
          </h2>
          <button
            @click="close"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <i class="pi pi-times text-lg"></i>
          </button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Выберите контрагента для создания нового чата
        </p>
      </div>

      <!-- Поиск -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск контрагентов..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="p-6 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка контрагентов...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg m-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300 text-sm">{{ error }}</span>
        </div>
      </div>

      <!-- Список контрагентов -->
      <div v-if="!loading" class="flex-1 overflow-y-auto p-6">
        <div v-if="filteredContractors.length === 0" class="text-center py-8">
          <i class="pi pi-users text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Контрагенты не найдены</h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Нет доступных контрагентов' }}
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="contractor in filteredContractors"
            :key="contractor.id"
            @click="selectContractor(contractor)"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <div class="flex items-start gap-4">
              <!-- Аватар -->
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">{{ contractor.name.charAt(0) }}</span>
                </div>
              </div>

              <!-- Информация о контрагенте -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {{ contractor.name }}
                  </h3>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    contractor.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ contractor.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </div>

                <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <div v-if="contractor.contact_person" class="flex items-center gap-2">
                    <i class="pi pi-user text-gray-400"></i>
                    <span>{{ contractor.contact_person }}</span>
                  </div>
                  <div v-if="contractor.phone" class="flex items-center gap-2">
                    <i class="pi pi-phone text-gray-400"></i>
                    <span>{{ contractor.phone }}</span>
                  </div>
                  <div v-if="contractor.email" class="flex items-center gap-2">
                    <i class="pi pi-envelope text-gray-400"></i>
                    <span>{{ contractor.email }}</span>
                  </div>
                  <div v-if="contractor.type" class="flex items-center gap-2">
                    <i class="pi pi-building text-gray-400"></i>
                    <span>{{ contractor.type === 'individual' ? 'Физическое лицо' : 'Юридическое лицо' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
        <button
          @click="close"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
        >
          Отмена
        </button>
        <button
          @click="createNewContractor"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          Создать нового
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { contractorsApi } from '@/shared/api/contractors'
import type { Contractor } from '@/shared/api/contractors'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'select', contractor: Contractor): void
  (e: 'create-new'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const contractors = ref<Contractor[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const filteredContractors = computed(() => {
  if (!searchQuery.value) return contractors.value

  const query = searchQuery.value.toLowerCase()
  return contractors.value.filter(contractor =>
    contractor.name.toLowerCase().includes(query) ||
    contractor.contact_person?.toLowerCase().includes(query) ||
    contractor.phone?.includes(query) ||
    contractor.email?.toLowerCase().includes(query) ||
    contractor.inn?.includes(query)
  )
})

const loadContractors = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await contractorsApi.getContractors({
      per_page: 100,
      search: (searchQuery.value || '').trim() || undefined
    })

    // Нормализуем различные форматы ответа
    const possibleArrays = [
      (response as any)?.data,
      (response as any)?.data?.data,
      (response as any)
    ]
    const list = possibleArrays.find((arr) => Array.isArray(arr)) as Contractor[] | undefined

    if (Array.isArray(list)) {
      contractors.value = list
    } else {
      contractors.value = []
      error.value = 'Неожиданный формат ответа от сервера'
    }
  } catch (err) {
    contractors.value = []
    error.value = 'Ошибка загрузки контрагентов'
  } finally {
    loading.value = false
  }
}

const selectContractor = (contractor: Contractor) => {
  emit('select', contractor)
}

const createNewContractor = () => {
  emit('create-new')
}

const close = () => {
  emit('close')
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

// Загружаем контрагентов при открытии модального окна
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadContractors()
  }
})

onMounted(() => {
  if (props.show) {
    loadContractors()
  }
})
</script>
