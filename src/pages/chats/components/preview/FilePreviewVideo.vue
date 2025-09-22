<template>
  <!-- Превью видео -->
  <div
    class="relative bg-black rounded-lg overflow-hidden shadow-lg max-w-full max-h-full flex items-center justify-center"
    style="max-width: 400px; max-height: 500px;"
  >
    <video
      :src="getFileUrl(file)"
      controls
      class="max-w-full max-h-full object-contain"
      preload="none"
      @loadedmetadata="onVideoLoad"
    >
      Ваш браузер не поддерживает видео.
    </video>
  </div>
</template>

<script setup lang="ts">
import { useFileOperations } from '../../composables/useFileOperations'
import type { FileWithPreview } from '../../composables/useFileOperations'

const props = defineProps<{
  file: FileWithPreview
}>()

const { getFileUrl } = useFileOperations()

// Обработчик загрузки видео
const onVideoLoad = () => {
  // Можно добавить логику после загрузки видео
}
</script>
