<template>
  <div :class="[
    'flex-1 flex-col transition-all duration-300',
    selectedChat ? 'flex' : 'hidden md:flex'
  ]">
    <!-- Заголовок чата -->
    <ChatHeader 
      v-if="selectedChat"
      :selected-chat="selectedChat"
      @back-to-list="$emit('backToList')"
      @close-chat="handleCloseChat"
    />

    <!-- Область сообщений -->
    <div
      v-if="selectedChat"
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      @scroll="$emit('scroll')"
    >
      <!-- Пустое состояние -->
      <EmptyMessagesState v-if="messages.length === 0" />
      
      <!-- Отладочная информация -->
      <div v-if="messages.length > 0" class="text-xs text-gray-400 text-center mb-4">
        Сообщений: {{ messages.length }}
      </div>

      <!-- Список сообщений -->
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :messages="messages"
        :selected-chat="selectedChat"
        @open-image-preview="$emit('openImagePreview', $event)"
      />
    </div>

    <!-- Поле ввода сообщения -->
    <MessageInput
      v-if="selectedChat"
      :new-message="newMessage"
      :sending-message="sendingMessage"
      :uploading-file="uploadingFile"
      @file-selected="$emit('fileSelected', $event)"
      @file-error="$emit('fileError', $event)"
      @emoji-selected="$emit('emojiSelected', $event)"
      @send-message="handleSendMessage"
      @update:new-message="$emit('update:newMessage', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import type { Chat, Message } from '@/shared/lib/types'
import { useMessageHandling } from '@/shared/composables/useMessageHandling'
import ChatHeader from './ChatHeader.vue'
import MessageBubble from './MessageBubble.vue'
import MessageInput from './MessageInput.vue'
import EmptyMessagesState from './EmptyMessagesState.vue'

interface Props {
  selectedChat: Chat | null
  messages: Message[]
  newMessage?: string
  sendingMessage?: boolean
  uploadingFile?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits([
  'backToList',
  'scroll',
  'sendMessage',
  'fileSelected',
  'fileError',
  'emojiSelected',
  'openImagePreview',
  'update:newMessage',
  'chatClosed',
  'containerReady'
])

const messagesContainer = ref<HTMLElement | null>(null)
const { handleCloseChat, handleSendMessage } = useMessageHandling()

// Эмитим событие когда контейнер сообщений готов
onMounted(() => {
  nextTick(() => {
    if (messagesContainer.value) {
      emit('containerReady', messagesContainer.value)
    }
  })
})

// Следим за изменением selectedChat и эмитим containerReady
watch(() => props.selectedChat, (newChat) => {
  if (newChat) {
    nextTick(() => {
      if (messagesContainer.value) {
        emit('containerReady', messagesContainer.value)
      }
    })
  }
}, { immediate: true })
</script>
