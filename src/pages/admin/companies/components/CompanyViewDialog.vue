<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Информация о компании
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Содержимое -->
      <div class="p-6 space-y-6">
        <!-- Основная информация -->
        <div class="flex items-start gap-6">
          <!-- Аватар -->
          <div class="flex-shrink-0">
            <div class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <span class="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {{ company.name.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- Основная информация -->
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ company.name }}</h3>
            <div class="flex items-center gap-4 mb-4">
              <span :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                company.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : company.status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              ]">
                {{ getStatusText(company.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Контактная информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Контактная информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="company.email">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <a :href="`mailto:${company.email}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ company.email }}
              </a>
            </div>

            <div v-if="company.phone">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Телефон</label>
              <a :href="`tel:${company.phone}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ company.phone }}
              </a>
            </div>

            <div v-if="company.address" class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Адрес</label>
              <p class="text-gray-900 dark:text-white">{{ company.address }}</p>
            </div>
          </div>
        </div>

        <!-- Описание -->
        <div v-if="company.description" class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Описание</h3>
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ company.description }}</p>
        </div>

        <!-- Статистика -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ company.users_count || 0 }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Пользователей</div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ company.departments_count || 0 }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Отделов</div>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {{ formatDate(company.created_at) }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Дата создания</div>
            </div>
          </div>
        </div>

        <!-- Кнопки -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="$emit('close')"
            class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '@/shared/lib/types'

const props = defineProps<{
  company: Organization
}>()

const emit = defineEmits<{
  close: []
}>()

// Получение текста статуса
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Активна'
    case 'inactive': return 'Неактивна'
    case 'blocked': return 'Заблокирована'
    default: return 'Неизвестно'
  }
}

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
