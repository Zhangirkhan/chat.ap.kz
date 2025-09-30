<template>
  <div class="mb-2">
    <div :class="audioContainerClasses">
      <div :class="iconContainerClasses">
        <i class="pi pi-volume-up" :class="iconClasses"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p :class="fileNameClasses">🎵 Голосовое сообщение</p>
        <p v-if="message.file_size" :class="fileSizeClasses">{{ formatFileSize(message.file_size) }}</p>
        <audio
          :src="message.file_path || message.metadata?.audio_url || message.metadata?.file_path"
          controls
          class="w-full mt-2"
          style="max-width: 100%;"
        >
          Ваш браузер не поддерживает аудио.
        </audio>
      </div>
      <button
        @click="downloadAudio"
        :class="downloadButtonClasses"
        title="Скачать аудио"
      >
        <i class="pi pi-download text-sm"></i>
      </button>
    </div>
    <p v-if="message.message && message.message !== 'Аудио сообщение'" :class="captionClasses">{{ message.message }}</p>
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
    return 'flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg'
  } else {
    return 'flex items-center gap-3 p-3 bg-blue-600 rounded-lg'
  }
})

const iconContainerClasses = computed(() => {
  if (props.isFromClient) {
    return 'w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0'
  } else {
    return 'w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0'
  }
})

const iconClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-green-600 dark:text-green-400'
  } else {
    return 'text-white'
  }
})

const fileNameClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-sm font-medium text-gray-900 dark:text-white'
  } else {
    return 'text-sm font-medium text-white'
  }
})

const downloadButtonClasses = computed(() => {
  if (props.isFromClient) {
    return 'w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0'
  } else {
    return 'w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0'
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

// Функция для скачивания аудио
const downloadAudio = async () => {
  try {
    const audioUrl = props.message.file_path || props.message.metadata?.audio_url || props.message.metadata?.file_path
    if (!audioUrl) return
    
    const response = await fetch(audioUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'audio.mp3'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Ошибка скачивания аудио:', error)
    const audioUrl = props.message.file_path || props.message.metadata?.audio_url
    if (audioUrl) {
      window.open(audioUrl, '_blank')
    }
  }
}
</script>
