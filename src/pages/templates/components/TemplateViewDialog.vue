<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Информация о шаблоне
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
        <div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ template.name }}</h3>
          <div v-if="template.description" class="text-lg text-gray-600 dark:text-gray-400 mb-4">{{ template.description }}</div>

          <div class="flex items-center gap-4 mb-4">
            <span :class="[
              'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
              getCategoryColor(template.category)
            ]">
              {{ template.category }}
            </span>
            <span :class="[
              'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
              template.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            ]">
              {{ template.status === 'active' ? 'Активен' : 'Неактивен' }}
            </span>
            <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Использований: {{ template.usageCount }}
            </span>
          </div>
        </div>

        <!-- Текст шаблона -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Текст шаблона</h3>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="text-gray-900 dark:text-white whitespace-pre-line">{{ template.text }}</div>
          </div>

          <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Символов: {{ template.text.length }}
          </div>
        </div>

        <!-- Теги -->
        <div v-if="template.tags && template.tags.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Теги</h3>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in template.tags"
              :key="tag"
              class="inline-flex px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Статистика -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика</h3>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Дата создания:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(template.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Количество использований:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ template.usageCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Статус:</span>
              <span :class="[
                'text-sm font-medium',
                template.status === 'active'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              ]">
                {{ template.status === 'active' ? 'Активен' : 'Неактивен' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Действия -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Действия</h3>

          <div class="flex flex-wrap gap-3">
            <button
              @click="copyToClipboard"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <i class="pi pi-copy"></i>
              Копировать текст
            </button>
            <button
              @click="copyTemplate"
              class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <i class="pi pi-clone"></i>
              Дублировать шаблон
            </button>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Получение цвета категории
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Общие': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    case 'Поддержка': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    case 'Продажи': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    case 'Документооборот': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    case 'Уведомления': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }
}

// Форматирование даты
const formatDate = (dateString: any) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Копирование текста в буфер обмена
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.template.text)
    // Здесь можно добавить уведомление об успешном копировании
  } catch (error) {
  }
}

// Дублирование шаблона
const copyTemplate = () => {
  // Здесь можно добавить логику для дублирования шаблона
}
</script>
