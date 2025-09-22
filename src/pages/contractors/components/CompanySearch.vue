<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Компания
    </label>

    <!-- Поле ввода с поиском -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="onSearch"
        @focus="showDropdown = true"
        @blur="onBlur"
        type="text"
        class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        :placeholder="placeholder"
        :disabled="disabled"
      />

      <!-- Иконка поиска -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <i v-if="loading" class="pi pi-spin pi-spinner text-gray-400"></i>
        <i v-else class="pi pi-search text-gray-400"></i>
      </div>
    </div>

    <!-- Выпадающий список с результатами поиска -->
    <div
      v-if="showDropdown && (searchResults.length > 0 || showCreateOption)"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <!-- Результаты поиска -->
      <div
        v-for="company in searchResults"
        :key="company.id"
        @click="selectCompany(company)"
        class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
      >
        <div class="font-medium text-gray-900 dark:text-white">{{ company.name }}</div>
        <div v-if="company.phone" class="text-sm text-gray-500 dark:text-gray-400">
          {{ company.phone }}
        </div>
        <div v-if="company.email" class="text-sm text-gray-500 dark:text-gray-400">
          {{ company.email }}
        </div>
      </div>

      <!-- Опция создания новой компании -->
      <div
        v-if="showCreateOption"
        @click="createNewCompany"
        class="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer border-t border-gray-200 dark:border-gray-600 bg-blue-50 dark:bg-blue-900"
      >
        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <i class="pi pi-plus"></i>
          <span class="font-medium">Создать компанию "{{ searchQuery }}"</span>
        </div>
      </div>
    </div>

    <!-- Выбранная компания -->
    <div v-if="selectedCompany && !showDropdown" class="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">{{ selectedCompany.name }}</div>
          <div v-if="selectedCompany.phone" class="text-sm text-gray-500 dark:text-gray-400">
            {{ selectedCompany.phone }}
          </div>
        </div>
        <button
          @click="clearSelection"
          type="button"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { organizationApi } from '@/entities/organization/api/organizationApi'
import type { Organization } from '@/shared/lib/types'

interface Props {
  modelValue?: Organization | null
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Organization | null): void
  (e: 'create-company', name: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Начните вводить название компании...',
  disabled: false
})

const emit = defineEmits<Emits>()

const searchQuery = ref('')
const searchResults = ref<Organization[]>([])
const selectedCompany = ref<Organization | null>(props.modelValue || null)
const showDropdown = ref(false)
const loading = ref(false)
const searchTimeout = ref<number | null>(null)

// Показывать ли опцию создания новой компании
const showCreateOption = computed(() => {
  return searchQuery.value.trim().length > 2 &&
         !searchResults.value.some(company =>
           company.name.toLowerCase() === searchQuery.value.toLowerCase()
         )
})

// Поиск компаний
const onSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.trim().length < 2) {
      searchResults.value = []
      return
    }

    try {
      loading.value = true
      const response = await organizationApi.getOrganizations({
        search: searchQuery.value.trim(),
        per_page: 10
      })

      // Обрабатываем разные форматы ответа
      if (response.data && Array.isArray(response.data)) {
        searchResults.value = response.data
      } else if (Array.isArray(response)) {
        searchResults.value = response
      } else {
        searchResults.value = []
      }
    } catch (error) {
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

// Выбор компании
const selectCompany = (company: Organization) => {
  selectedCompany.value = company
  searchQuery.value = company.name
  showDropdown.value = false
  emit('update:modelValue', company)
}

// Создание новой компании
const createNewCompany = () => {
  emit('create-company', searchQuery.value.trim())
  showDropdown.value = false
}

// Очистка выбора
const clearSelection = () => {
  selectedCompany.value = null
  searchQuery.value = ''
  searchResults.value = []
  emit('update:modelValue', null)
}

// Обработка потери фокуса
const onBlur = () => {
  // Задержка для обработки клика по элементу списка
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// Следим за изменениями modelValue
watch(() => props.modelValue, (newValue) => {
  selectedCompany.value = newValue || null
  if (newValue) {
    searchQuery.value = newValue.name
  } else {
    searchQuery.value = ''
  }
}, { immediate: true })
</script>
