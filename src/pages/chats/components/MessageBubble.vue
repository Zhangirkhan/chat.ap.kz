<template>
  <div 
    :class="[
      'flex w-full',
      message.type === 'system' ? 'justify-center' :
      message.is_from_client ? 'justify-start' : 'justify-end'
    ]"
  >
    <!-- Системное сообщение -->
    <div v-if="message.type === 'system'" class="flex justify-center">
      <div class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm max-w-md shadow-sm border border-green-200 dark:border-green-700">
        <div class="flex items-center justify-between mb-2 text-xs">
          <span class="font-medium">Система</span>
          <span class="opacity-75">{{ formatTime(message.created_at) }}</span>
        </div>
        <div class="text-left leading-relaxed whitespace-pre-wrap break-words">
          {{ message.message }}
        </div>
      </div>
    </div>

    <!-- Сообщение клиента (слева) -->
    <div v-else-if="message.is_from_client" class="flex items-start gap-3 max-w-[70%]">
      <MessageAvatar 
        :message="message" 
        :is-from-client="true" 
        :selected-chat="selectedChat"
      />
      <div class="flex flex-col">
        <MessageUserInfo 
          :message="message" 
          :is-from-client="true" 
          :selected-chat="selectedChat"
        />
        <div class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border dark:border-gray-600">
          <MessageContent 
            :message="message" 
            :messages="messages"
            :is-from-client="true"
            :selected-chat="selectedChat"
            @open-image-preview="$emit('openImagePreview', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Наше сообщение (справа) -->
    <div v-else class="flex items-start gap-3 max-w-[70%] flex-row-reverse">
      <MessageAvatar 
        :message="message" 
        :is-from-client="false" 
        :selected-chat="selectedChat"
      />
      <div class="flex flex-col items-end">
        <MessageUserInfo 
          :message="message" 
          :is-from-client="false" 
          :selected-chat="selectedChat"
        />
        <div class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm transition-colors">
          <MessageContent 
            :message="message" 
            :messages="messages"
            :is-from-client="false"
            :selected-chat="selectedChat"
            @open-image-preview="$emit('openImagePreview', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, Chat } from '@/shared/lib/types'
import { useMessageFormatting } from '@/shared/composables/useMessageFormatting'
import MessageAvatar from './MessageAvatar.vue'
import MessageUserInfo from './MessageUserInfo.vue'
import MessageContent from './MessageContent.vue'

interface Props {
  message: Message
  messages: Message[]
  selectedChat?: Chat | null
}

defineProps<Props>()

const emit = defineEmits<{
  openImagePreview: [url: string]
}>()

const { formatTime } = useMessageFormatting()
</script>
