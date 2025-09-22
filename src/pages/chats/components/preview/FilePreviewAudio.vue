<template>
  <!-- Превью аудио (только для отображения) -->
  <div
    class="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg min-w-[350px] max-w-[400px] shadow-lg"
  >
    <!-- Иконка аудио -->
    <div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-full flex items-center justify-center mb-4 shadow-lg">
      <i class="pi pi-volume-up text-3xl text-purple-600 dark:text-purple-400"></i>
    </div>

    <!-- Название файла -->
    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center break-words">
      {{ file?.name || 'Аудиозапись' }}
    </h4>

    <!-- Размер файла -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      {{ file?.size ? formatFileSize(file.size) : 'Размер неизвестен' }}
    </p>

    <!-- Аудиоплеер -->
    <div class="w-full max-w-sm">
      <audio
        :src="getFileUrl(file)"
        controls
        class="w-full"
        preload="metadata"
        @loadedmetadata="onAudioLoad"
      >
        Ваш браузер не поддерживает воспроизведение аудио.
      </audio>
    </div>

    <!-- Показываем подпись если есть -->
    <div v-if="file.caption" class="w-full mt-4 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-purple-200 dark:border-purple-700">
      <p class="text-sm text-gray-700 dark:text-gray-300 text-center">
        "{{ file.caption }}"
      </p>
    </div>

    <!-- Предупреждение о том, что отправка аудио недоступна -->
    <div class="w-full mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
      <p class="text-xs text-yellow-800 dark:text-yellow-300 text-center">
        ⚠️ Отправка аудио файлов временно недоступна
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFileOperations } from '../../composables/useFileOperations'
import type { FileWithPreview } from '../../composables/useFileOperations'

const props = defineProps<{
  file: FileWithPreview
}>()

const { getFileUrl, formatFileSize } = useFileOperations()

// Обработчик загрузки аудио
const onAudioLoad = () => {
  // Можно добавить логику после загрузки аудио
}
</script>
