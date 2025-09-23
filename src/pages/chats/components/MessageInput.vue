<template>
  <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div class="flex items-end gap-3">
      <!-- Меню загрузки файлов -->
      <div class="flex-shrink-0">
        <FileUploadMenu
          @file-selected="$emit('fileSelected', $event)"
          @file-error="$emit('fileError', $event)"
        />
      </div>

      <!-- Поле ввода с эмодзи -->
      <div class="flex-1 relative">
        <div class="flex items-end border border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <!-- Textarea для сообщения -->
          <textarea
            :value="newMessage || messageText"
            @input="handleInput"
            ref="messageInput"
            @keydown.enter.prevent="handleSendMessage"
            placeholder="Введите сообщение..."
            rows="1"
            class="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none bg-transparent dark:text-white resize-none"
            style="max-height: 120px; min-height: 48px;"
          ></textarea>

          <!-- Кнопка эмодзи -->
          <div class="flex-shrink-0 p-2">
            <EmojiPicker @emoji-selected="$emit('emojiSelected', $event)" />
          </div>
        </div>
      </div>

      <!-- Кнопка отправки -->
      <div class="flex-shrink-0">
        <button
          @click="handleSendMessage"
          :disabled="!(newMessage || messageText).trim() || sendingMessage"
          class="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
        >
          <i v-if="sendingMessage" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-send text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Индикатор загрузки файла -->
    <div v-if="uploadingFile" class="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <i class="pi pi-spin pi-spinner"></i>
      <span>Загрузка файла...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useMessageHandling } from '@/shared/composables/useMessageHandling'
import FileUploadMenu from './FileUploadMenu.vue'
import EmojiPicker from './EmojiPicker.vue'

interface Props {
  newMessage?: string
  sendingMessage?: boolean
  uploadingFile?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  fileSelected: [file: File]
  fileError: [error: string]
  emojiSelected: [emoji: string]
  sendMessage: []
  'update:newMessage': [value: string]
}>()

const { messageText, messageInput, handleInput: handleInputBase, handleSendMessage: handleSendMessageBase } = useMessageHandling()

const handleInput = (event: Event) => {
  handleInputBase(event, (event, value) => emit(event, value))
}

const handleSendMessage = () => {
  handleSendMessageBase(props.newMessage || '', props.sendingMessage || false, (event) => emit(event))
}
</script>
