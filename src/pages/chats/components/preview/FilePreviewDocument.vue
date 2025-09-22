<template>
  <!-- Превью документа -->
  <div
    class="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg min-w-[300px] max-w-[400px]"
  >
    <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
      <i :class="getFileIcon(file)" class="text-3xl"></i>
    </div>
    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center break-words">
      {{ file?.name || 'Неизвестный файл' }}
    </h4>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      {{ file?.size ? formatFileSize(file.size) : 'Размер неизвестен' }}
    </p>

    <!-- Показываем подпись если есть -->
    <div v-if="file.caption" class="w-full p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-500">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        "{{ file.caption }}"
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFileOperations } from '../../composables/useFileOperations'
import type { FileWithPreview } from '../../composables/useFileOperations'

defineProps<{
  file: FileWithPreview
}>()

const { getFileIcon, formatFileSize } = useFileOperations()
</script>
