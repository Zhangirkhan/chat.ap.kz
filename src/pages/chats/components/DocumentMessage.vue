<template>
  <div class="mb-2">
    <div :class="documentClasses">
      <div :class="iconContainerClasses">
        <i :class="[getDocumentIcon(message.file_name), iconClasses]"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p :class="fileNameClasses">{{ message.file_name || 'Документ' }}</p>
        <p v-if="message.file_size" :class="fileSizeClasses">{{ formatFileSize(message.file_size) }}</p>
        <p v-if="isFromClient" class="text-xs text-gray-400 dark:text-gray-500">{{ getFileExtension(message.file_name) }}</p>
        <p v-else class="text-xs text-white opacity-50">{{ getFileExtension(message.file_name) }}</p>
      </div>
      <button
        @click="downloadFile"
        :class="downloadButtonClasses"
        title="Скачать документ"
      >
        <i class="pi pi-download text-sm"></i>
      </button>
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

const { formatFileSize, getFileExtension, getDocumentIcon } = useMessageFormatting()

const documentClasses = computed(() => {
  if (props.isFromClient) {
    return 'flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500'
  } else {
    return 'flex items-center gap-3 p-3 bg-blue-600 rounded-lg border border-blue-500'
  }
})

const iconContainerClasses = computed(() => {
  if (props.isFromClient) {
    return 'w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0'
  } else {
    return 'w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0'
  }
})

const iconClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-2xl'
  } else {
    return 'text-2xl text-white'
  }
})

const fileNameClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-sm font-medium text-gray-900 dark:text-white truncate'
  } else {
    return 'text-sm font-medium text-white truncate'
  }
})

const fileSizeClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-xs text-gray-500 dark:text-gray-400'
  } else {
    return 'text-xs text-white opacity-75'
  }
})

const downloadButtonClasses = computed(() => {
  if (props.isFromClient) {
    return 'w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors'
  } else {
    return 'w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg flex items-center justify-center transition-colors'
  }
})

const captionClasses = computed(() => {
  if (props.isFromClient) {
    return 'text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap'
  } else {
    return 'text-xs text-white opacity-90 mt-1 whitespace-pre-wrap'
  }
})

// Функция для принудительного скачивания файла
const downloadFile = async () => {
  try {
    const response = await fetch(props.message.file_path)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = props.message.file_name || 'document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Ошибка скачивания файла:', error)
    // Fallback: открыть в новой вкладке
    window.open(props.message.file_path, '_blank')
  }
}
</script>
