<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Содержимое -->
      <div class="p-6 overflow-y-auto">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-lg"></i>
          </div>
          <p class="text-gray-600 dark:text-gray-300">{{ message }}</p>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('cancel')"
          class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Закрыть
        </button>
        <button
          @click="$emit('confirm')"
          class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Подтверждение'
  },
  message: {
    type: String,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])
</script>
