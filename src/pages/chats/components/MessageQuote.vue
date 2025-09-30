<template>
  <div :class="quoteClasses" @click="scrollToMessage">
    <div class="flex items-center gap-2 mb-1">
      <i class="pi pi-reply text-xs"></i>
      <span class="text-xs font-medium">{{ replyToName }}</span>
    </div>
    <p class="text-xs opacity-90 truncate">{{ replyToText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/shared/lib/types'

interface Props {
  message: Message  // Теперь передаём само сообщение вместо отдельных полей
  isFromClient: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  scrollTo: [messageId: number]
}>()

const replyToData = computed(() => {
  // Берём данные из metadata.reply_to_message (добавлены MessageResource)
  return props.message.metadata?.reply_to_message
})

const replyToName = computed(() => {
  if (!replyToData.value) return 'Неизвестно'
  return replyToData.value.is_from_client ? 'Клиент' : (replyToData.value.user?.name || 'Сотрудник')
})

const replyToText = computed(() => {
  if (!replyToData.value) return 'Сообщение удалено'
  if (replyToData.value.type === 'image') return '📷 Изображение'
  if (replyToData.value.type === 'video') return '🎥 Видео'
  if (replyToData.value.type === 'audio') return '🎵 Голосовое сообщение'
  if (replyToData.value.type === 'document' || replyToData.value.type === 'file') {
    return '📄 ' + (replyToData.value.file_name || 'Документ')
  }
  return replyToData.value.message || replyToData.value.content || 'Сообщение'
})

const quoteClasses = computed(() => {
  if (props.isFromClient) {
    return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-3 pr-2 py-2 mb-2 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'
  } else {
    return 'border-l-4 border-white/40 bg-white/10 pl-3 pr-2 py-2 mb-2 rounded cursor-pointer hover:bg-white/20 transition-colors'
  }
})

const scrollToMessage = () => {
  if (replyToData.value) {
    emit('scrollTo', replyToData.value.id)
  }
}
</script>
