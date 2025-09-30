<template>
  <div>
    <TextMessage v-if="message.type === 'text'" :message="message" />
    <ImageMessage 
      v-else-if="message.type === 'image' && (message.file_path || message.metadata?.file_path)" 
      :message="message" 
      :messages="messages"
      :is-from-client="isFromClient"
      :selected-chat="selectedChat"
      @open-image-preview="$emit('openImagePreview', $event)"
    />
    <VideoMessage 
      v-else-if="message.type === 'video' && message.file_path" 
      :message="message" 
      :is-from-client="isFromClient"
    />
    <AudioMessage 
      v-else-if="message.type === 'audio'" 
      :message="message" 
      :is-from-client="isFromClient"
    />
    <AudioMessage 
      v-else-if="isAudioMessage" 
      :message="message" 
      :is-from-client="isFromClient"
    />
    <DocumentMessage 
      v-else-if="message.type === 'document' && message.file_path" 
      :message="message" 
      :is-from-client="isFromClient"
    />
    <DocumentMessage 
      v-else-if="message.type === 'file' && message.file_path" 
      :message="message" 
      :is-from-client="isFromClient"
    />
    <div v-else class="text-sm" :class="unknownTypeClasses">
      {{ getUnknownTypeText() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/shared/lib/types'
import TextMessage from './TextMessage.vue'
import ImageMessage from './ImageMessage.vue'
import VideoMessage from './VideoMessage.vue'
import AudioMessage from './AudioMessage.vue'
import DocumentMessage from './DocumentMessage.vue'

interface Props {
  message: Message
  messages: Message[]
  isFromClient: boolean
  selectedChat?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  openImagePreview: [url: string]
}>()

const isAudioMessage = computed(() => {
  return props.message.type === 'file' && 
         props.message.file_name && 
         /\.(mp3|wav|ogg|m4a)$/i.test(props.message.file_name) && 
         props.message.file_path
})

const unknownTypeClasses = computed(() => {
  return props.isFromClient 
    ? 'text-gray-500' 
    : 'opacity-90'
})

const getUnknownTypeText = () => {
  switch (props.message.type) {
    case 'image': return '📷 Изображение'
    case 'video': return '🎥 Видео'
    case 'audio': return '🎵 Аудио'
    case 'document': return '📄 Документ'
    case 'file': return '📄 Файл'
    default: return '📎 Вложение'
  }
}
</script>
