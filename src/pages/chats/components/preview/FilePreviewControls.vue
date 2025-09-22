<template>
  <!-- Нижняя панель с подписью и кнопками -->
  <div class="bg-black bg-opacity-50 p-4">
    <!-- Поле для подписи текущего файла -->
    <div class="mb-4">
      <div class="relative">
        <textarea
          v-model="caption"
          :placeholder="currentFile ? `Подпись для ${currentFile.name}... (необязательно)` : 'Добавить подпись... (необязательно)'"
          rows="2"
          class="w-full px-4 py-3 pr-20 bg-gray-800 text-white rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
          @keydown.enter.prevent="$emit('sendFiles')"
        ></textarea>

        <!-- Кнопки в поле подписи -->
        <div class="absolute right-2 top-2 flex items-center gap-1">
          <!-- Кнопка очистки подписи -->
          <button
            v-if="caption"
            @click="caption = ''"
            class="w-6 h-6 text-gray-400 hover:text-white transition-colors"
            title="Очистить подпись"
          >
            <i class="pi pi-times text-sm"></i>
          </button>

          <!-- Кнопка эмодзи -->
          <button
            @click="showCaptionEmoji = !showCaptionEmoji"
            :class="[
              'w-6 h-6 transition-colors',
              showCaptionEmoji
                ? 'text-yellow-400 hover:text-yellow-300'
                : 'text-gray-400 hover:text-white'
            ]"
            title="Эмодзи"
          >
            <i class="pi pi-face-smile text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Пикер эмодзи для подписи -->
      <div v-if="showCaptionEmoji" class="absolute bottom-24 right-4 z-50">
        <div class="emoji-picker-container">
          <EmojiPicker @emoji-selected="addEmojiToCaption" />
        </div>
      </div>

      <!-- Подсказка -->
      <div class="mt-2 text-xs text-gray-400">
        💡 Подпись необязательна. Можно отправить файл без текста.
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="flex items-center justify-between gap-4">
      <!-- Левая группа кнопок -->
      <div class="flex items-center gap-3">
        <!-- Кнопка добавления файлов -->
        <button
          @click="$emit('addMoreFiles')"
          :disabled="sending"
          class="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Добавить еще файлы"
        >
          <i class="pi pi-plus text-sm"></i>
          <span class="text-sm">Добавить</span>
        </button>

        <!-- Кнопка удаления текущего файла -->
        <button
          @click="$emit('removeCurrentFile')"
          :disabled="sending"
          class="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Удалить текущий файл"
        >
          <i class="pi pi-trash text-sm"></i>
          <span class="text-sm">Удалить</span>
        </button>
      </div>

      <!-- Кнопки отмены и отправки -->
      <div class="flex items-center gap-3">
        <button
          @click="$emit('closePreview')"
          :disabled="sending"
          class="px-6 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ sending ? 'Ожидайте...' : 'Отмена' }}
        </button>
        <button
          @click="$emit('sendFiles')"
          :disabled="sending || filesLength === 0"
          class="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <i v-if="sending" class="pi pi-spin pi-spinner text-sm"></i>
          <i v-else class="pi pi-send text-sm"></i>
          <span>{{ sending ? 'Отправка...' : `Отправить (${filesLength})` }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EmojiPicker from '../EmojiPicker.vue'
import type { FileWithPreview } from '../../composables/useFileOperations'

const props = defineProps<{
  currentFile: FileWithPreview | null
  currentCaption: string
  showCaptionEmoji: boolean
  sending: boolean
  filesLength: number
}>()

const emit = defineEmits<{
  'update:currentCaption': [value: string]
  'update:showCaptionEmoji': [value: boolean]
  'addMoreFiles': []
  'removeCurrentFile': []
  'closePreview': []
  'sendFiles': []
}>()

// Вычисляемые свойства для v-model
const caption = computed({
  get: () => props.currentCaption,
  set: (value: string) => emit('update:currentCaption', value)
})

const showCaptionEmoji = computed({
  get: () => props.showCaptionEmoji,
  set: (value: boolean) => emit('update:showCaptionEmoji', value)
})

// Добавление эмодзи в подпись
const addEmojiToCaption = (emoji: string) => {
  emit('update:currentCaption', caption.value + emoji)
  emit('update:showCaptionEmoji', false)
}
</script>
