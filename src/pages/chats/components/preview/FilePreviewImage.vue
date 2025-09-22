<template>
  <!-- Превью изображения -->
  <div
    class="relative bg-white rounded-lg overflow-hidden shadow-lg"
    style="max-width: 400px; max-height: 300px;"
  >
    <img
      :src="getFileUrl(file)"
      :alt="file.name"
      class="block object-cover w-full h-full"
      style="width: 100%; height: 100%; object-fit: cover;"
      @load="onImageLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { useFileOperations } from '../../composables/useFileOperations'
import type { FileWithPreview } from '../../composables/useFileOperations'

const props = defineProps<{
  file: FileWithPreview
}>()

const { getFileUrl } = useFileOperations()

// Обработчик загрузки изображения
const onImageLoad = () => {
  // Можно добавить логику после загрузки изображения
}
</script>
