<template>
  <div class="mb-2">
    <video
      :src="message.file_path"
      controls
      class="max-w-full h-auto rounded-lg"
      style="max-height: 300px; object-fit: contain;"
    >
      Ваш браузер не поддерживает видео.
    </video>
    <p v-if="message.message" class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/shared/lib/types'

interface Props {
  message: Message
  isFromClient: boolean
}

defineProps<Props>()
</script>
