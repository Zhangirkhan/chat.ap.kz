<template>
  <div class="mb-2">
    <div :class="audioContainerClasses">
      <div :class="iconContainerClasses">
        <i class="pi pi-volume-up" :class="iconClasses"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p :class="fileNameClasses">{{ message.file_name || 'Аудио' }}</p>
        <p v-if="message.file_size" :class="fileSizeClasses">{{ formatFileSize(message.file_size) }}</p>
        <audio
          :src="message.file_path"
          controls
          class="w-full mt-2"
          style="max-width: 100%;"
        >
          Ваш браузер не поддерживает аудио.
        </audio>
      </div>
    </div>
    <p v-if="message.message" :class="captionClasses">{{ message.message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/shared/lib/types'
import { useMessageFormatting } from '@/shared/composables/useMessageFormatting'

interface Props {
  message: Message
  isFromClient: boolean
}

const props = defineProps<Props>()

const { formatFileSize } = useMessageFormatting()

const audioContainerClasses = computed(() => {
  if (props.isFromClient) {
    return 'flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg mb-2'
  } else {
    return 'flex items-center gap-3 p-3 bg-purple-600 rounded-lg border border-purple-500'
  }
})

const iconContainerClasses = computed(() => {
  if (props.isFromClient) {
    return 'w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center'
  } else {
    return 'w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0'
  }
})

const iconClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-green-600 dark:text-green-400'
  } else {
    return 'text-2xl text-white'
  }
})

const fileNameClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-sm font-medium'
  } else {
    return 'text-sm font-medium text-white'
  }
})

const fileSizeClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-xs text-gray-500'
  } else {
    return 'text-xs text-white opacity-75'
  }
})

const captionClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap'
  } else {
    return 'text-xs text-white opacity-90 mt-1 whitespace-pre-wrap'
  }
})
</script>
