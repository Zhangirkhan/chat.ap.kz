<template>
  <!-- Модальное окно превью файлов -->
  <div
    v-if="props.isOpen"
    class="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex flex-col minimal-scrollbar"
    :class="{ 'pointer-events-none': sending }"
  >
    <!-- Полноэкранный индикатор загрузки -->
    <div
      v-if="sending"
      class="absolute inset-0 bg-black bg-opacity-70 z-[10000] flex items-center justify-center pointer-events-auto"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl max-w-sm mx-4">
        <div class="flex flex-col items-center text-center">
          <!-- Анимированный спиннер -->
          <div class="relative w-16 h-16 mb-4">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>

          <!-- Текст загрузки -->
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Отправка файлов
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Загружаем {{ localFiles.length }} {{ localFiles.length === 1 ? 'файл' : 'файлов' }}...
          </p>

          <!-- Прогресс бар (косметический) -->
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div class="bg-blue-500 h-2 rounded-full animate-pulse" style="width: 65%"></div>
          </div>

          <!-- Подсказка -->
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Пожалуйста, не закрывайте окно
          </p>
        </div>
      </div>
    </div>

    <!-- Заголовок -->
    <div class="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
      <div class="flex items-center gap-3">
        <button
          @click="closePreview"
          :disabled="sending"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Закрыть"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
        <div>
          <h3 class="text-lg font-medium">
            {{ localFiles.length === 1 ? 'Отправить файл' : `Отправить файлы (${localFiles.length})` }}
          </h3>
          <p v-if="currentFile && currentFile.name && currentFile.size" class="text-sm opacity-75 mt-1">
            {{ currentFile.name }} • {{ formatFileSize(currentFile.size) }}
          </p>
        </div>
      </div>

      <!-- Счетчик файлов -->
      <div v-if="localFiles.length > 1" class="text-sm opacity-75">
        {{ currentIndex + 1 }} из {{ localFiles.length }}
      </div>
    </div>

    <!-- Область превью -->
    <div class="flex-1 flex items-center justify-center p-4 overflow-hidden">
      <div class="relative max-w-full max-h-full">
        <!-- Превью изображения -->
        <FilePreviewImage
          v-if="currentFile && isImage(currentFile)"
          :file="currentFile"
        />

        <!-- Превью видео -->
        <FilePreviewVideo
          v-else-if="currentFile && isVideo(currentFile)"
          :file="currentFile"
        />

        <!-- Превью аудио -->
        <FilePreviewAudio
          v-else-if="currentFile && isAudio(currentFile)"
          :file="currentFile"
        />

        <!-- Превью документа -->
        <FilePreviewDocument
          v-else-if="currentFile"
          :file="currentFile"
        />

        <!-- Навигация между файлами -->
        <div v-if="localFiles.length > 1" class="absolute inset-y-0 left-0 flex items-center">
          <button
            v-if="currentIndex > 0"
            @click="previousFile"
            class="ml-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            title="Предыдущий"
          >
            <i class="pi pi-chevron-left"></i>
          </button>
        </div>

        <div v-if="localFiles.length > 1" class="absolute inset-y-0 right-0 flex items-center">
          <button
            v-if="currentIndex < localFiles.length - 1"
            @click="nextFile"
            class="mr-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            title="Следующий"
          >
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Список файлов -->
    <div class="px-4 pb-4">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          v-for="(file, index) in localFiles"
          :key="file.id"
          @click="currentIndex = index"
          :class="[
            'flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-colors relative',
            currentIndex === index
              ? 'border-blue-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          ]"
        >
          <!-- Миниатюра изображения -->
          <img
            v-if="isImage(file)"
            :src="getFileUrl(file)"
            :alt="file.name"
            class="w-full h-full object-cover"
          />
          <!-- Иконка для других файлов -->
          <div
            v-else
            class="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
          >
            <i
              :class="[
                'text-lg',
                isVideo(file) ? 'pi pi-play text-red-500' :
                isAudio(file) ? 'pi pi-volume-up text-purple-500' :
                'pi pi-file text-blue-500'
              ]"
            ></i>
          </div>

          <!-- Индикатор подписи -->
          <div v-if="file.caption" class="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>

          <!-- Кнопка удаления -->
          <button
            @click.stop="removeFileByIndex(index, closePreview)"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            title="Удалить"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </button>

        <!-- Кнопка добавления файлов -->
        <button
          @click="addMoreFiles"
          class="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center hover:border-gray-300 transition-colors"
          title="Добавить еще файлы"
        >
          <i class="pi pi-plus text-gray-400 text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Индикатор позиции (только если больше одного файла) -->
    <div v-if="localFiles.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div class="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
        {{ currentIndex + 1 }} из {{ localFiles.length }}
      </div>
    </div>

    <!-- Нижняя панель с подписью и кнопками -->
    <FilePreviewControls
      :current-file="currentFile"
      :current-caption="currentCaption"
      :show-caption-emoji="showCaptionEmoji"
      :sending="sending"
      :files-length="localFiles.length"
      @update:current-caption="currentCaption = $event"
      @update:show-caption-emoji="showCaptionEmoji = $event"
      @add-more-files="addMoreFiles"
      @remove-current-file="removeCurrentFile(closePreview)"
      @close-preview="closePreview"
      @send-files="handleSendFiles"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

// Импорт компонентов
import FilePreviewImage from './preview/FilePreviewImage.vue'
import FilePreviewVideo from './preview/FilePreviewVideo.vue'
import FilePreviewAudio from './preview/FilePreviewAudio.vue'
import FilePreviewDocument from './preview/FilePreviewDocument.vue'
import FilePreviewControls from './preview/FilePreviewControls.vue'

// Импорт композаблов
import { useFileOperations } from '../composables/useFileOperations'
import { useFilePreviewState } from '../composables/useFilePreviewState'
import { useFilePreviewUpload } from '../composables/useFilePreviewUpload'
import type { FileWithPreview } from '../composables/useFileOperations'

const props = defineProps<{
  files: File[]
  fileType: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  send: [files: File[]]
  addFiles: [fileType: string]
}>()

// Используем композаблы
const { isImage, isVideo, isAudio, getFileUrl, formatFileSize } = useFileOperations()
const {
  currentIndex,
  showCaptionEmoji,
  localFiles,
  currentFile,
  currentCaption,
  initializeFiles,
  previousFile,
  nextFile,
  removeFileByIndex,
  removeCurrentFile,
  resetState
} = useFilePreviewState()
const { sending, sendFiles } = useFilePreviewUpload()

// Добавление новых файлов
const addMoreFiles = () => {
  emit('addFiles', props.fileType)
}

// Отправка файлов
const handleSendFiles = async () => {
  await sendFiles(localFiles.value, props.fileType, closePreview)
}

// Закрытие превью
const closePreview = () => {
  resetState()
  emit('close')
}

// Обработчик клика для закрытия пикера эмодзи
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.emoji-picker-container') && !target.closest('[title="Эмодзи"]')) {
    showCaptionEmoji.value = false
  }
}

// Сброс при закрытии
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    initializeFiles(props.files)
    currentIndex.value = 0
  } else {
    resetState()
  }
})

// Инициализация при изменении файлов
watch(() => props.files, () => {
  if (props.isOpen) {
    initializeFiles(props.files)
  }
}, { deep: true })

// Обработка клавиш
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (event.key) {
    case 'Escape':
      closePreview()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousFile()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextFile()
      break
    case 'Enter':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        handleSendFiles()
      }
      break
  }
}

// Добавляем обработчики клавиш
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Скрытие скроллбара для списка файлов */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
