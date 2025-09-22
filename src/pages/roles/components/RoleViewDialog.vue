<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Информация о роли
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Название роли
            </label>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ role.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Статус
            </label>
            <span
              :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                role.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              ]"
            >
              {{ role.status === 'active' ? 'Активна' : 'Неактивна' }}
            </span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Описание
          </label>
          <p class="text-gray-900 dark:text-white">
            {{ role.description || 'Описание не указано' }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Количество пользователей
          </label>
          <p class="text-gray-900 dark:text-white">
            {{ role.users_count || 0 }} пользователей
          </p>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  role: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
</script>
