<template>
  <div class="relative">
    <!-- Кнопка скрепки -->
    <button
      @click="toggleMenu"
      :class="[
        'h-10 w-10 flex items-center justify-center rounded-lg transition-colors duration-200',
        isOpen
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      ]"
    >
      <i class="pi pi-paperclip text-sm md:text-base"></i>
    </button>

    <!-- Выпадающее меню -->
    <div
      v-if="isOpen"
      class="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-48 z-[9998]"
    >
      <!-- Фото -->
      <button
        @click="selectFileType('image')"
        class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
      >
        <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
          <i class="pi pi-image text-purple-600 dark:text-purple-400"></i>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Фото</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, GIF • до 16 МБ</div>
        </div>
      </button>

      <!-- Видео - СКРЫТО (Wazzup не поддерживает большие видео) -->
      <!--
      <button
        @click="selectFileType('video')"
        class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
      >
        <div class="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
          <i class="pi pi-video text-red-600 dark:text-red-400"></i>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Видео</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">MP4 • до 10 МБ для WhatsApp</div>
        </div>
      </button>
      -->


      <!-- Документы -->
      <button
        @click="selectFileType('document')"
        class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
      >
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <i class="pi pi-file text-blue-600 dark:text-blue-400"></i>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Файл / Документ</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, MP4, XLS, ZIP и др. • до 16 МБ</div>
        </div>
      </button>
    </div>

    <!-- Скрытые input для файлов -->
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />

    <input
      ref="videoInput"
      type="file"
      accept="video/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />


    <input
      ref="documentInput"
      type="file"
      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.json,.xml,.zip,.rar,.7z,.mp4,.mov,.avi,.mkv"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />

  </div>

  <!-- Компонент превью файлов -->
  <FilePreview
    :is-open="showPreview"
    :files="previewFiles"
    :file-type="selectedFileType"
    @close="closePreview"
    @send="(files: File[]) => handleFileSend(files, selectedFileType)"
    @add-files="handleAddFiles"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import FilePreview from './FilePreview.vue'

interface FileWithPreview extends File {
  preview?: string
  caption?: string
  id?: string
}

// Ограничения размера файлов
const FILE_SIZE_LIMITS = {
  image: 16 * 1024 * 1024,    // 16MB для изображений (лимит WhatsApp)
  video: 10 * 1024 * 1024,    // 10MB для видео (безопасный лимит для Wazzup)
  document: 16 * 1024 * 1024, // 16MB для документов (лимит WhatsApp)
  default: 16 * 1024 * 1024    // 16MB по умолчанию
}

const emit = defineEmits<{
  fileSelected: [files: FileWithPreview[], type: string]
  fileError: [errors: string[]]
}>()

const isOpen = ref(false)
const showPreview = ref(false)
const previewFiles = ref<FileWithPreview[]>([])
const selectedFileType = ref('')
const imageInput = ref<HTMLInputElement | null>(null)
const videoInput = ref<HTMLInputElement | null>(null)
const documentInput = ref<HTMLInputElement | null>(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

// Функция для форматирования размера файла
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Б'
  const k = 1024
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Проверка размера файла
const checkFileSize = (file: File, fileType: string): { valid: boolean, message?: string } => {
  const limit = FILE_SIZE_LIMITS[fileType as keyof typeof FILE_SIZE_LIMITS] || FILE_SIZE_LIMITS.default

  if (file.size > limit) {
    const limitFormatted = formatFileSize(limit)
    const fileSizeFormatted = formatFileSize(file.size)

    return {
      valid: false,
      message: `Файл "${file.name}" слишком большой (${fileSizeFormatted}). Максимальный размер: ${limitFormatted}`
    }
  }

  return { valid: true }
}

const selectFileType = (type: string) => {
  isOpen.value = false

  switch (type) {
    case 'image':
      imageInput.value?.click()
      break
    case 'video':
      videoInput.value?.click()
      break
    case 'document':
      documentInput.value?.click()
      break
  }
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    let fileType = 'file'

    // Определяем тип файла
    if (target === imageInput.value) {
      fileType = 'image'
    } else if (target === videoInput.value) {
      fileType = 'video'
    } else if (target === documentInput.value) {
      fileType = 'document'
    }

    // Создаем массив файлов с превью
    const filesWithPreview: FileWithPreview[] = []
    const oversizedFiles: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i] as FileWithPreview

      // Проверяем размер файла
      const sizeCheck = checkFileSize(file, fileType)
      if (!sizeCheck.valid) {
        oversizedFiles.push(sizeCheck.message!)
        continue // Пропускаем слишком большие файлы
      }

      // Создаем превью для изображений и видео
      if (file.type && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        try {
          file.preview = URL.createObjectURL(file)
        } catch {
          // Ошибка создания превью
        }
      }

      // Добавляем ID для отслеживания
      file.id = `file_${Date.now()}_${i}`
      file.caption = ''

      filesWithPreview.push(file)
    }

    // Показываем предупреждения о слишком больших файлах
    if (oversizedFiles.length > 0) {
      emit('fileError', oversizedFiles)
    }

    // Проверяем, есть ли валидные файлы для отправки
    if (filesWithPreview.length === 0) {
      // Если все файлы слишком большие, не открываем превью
      return
    }

    // Если превью уже открыто, добавляем к существующим файлам
    if (showPreview.value && previewFiles.value.length > 0) {
      // Добавляем новые файлы к существующим
      previewFiles.value.push(...filesWithPreview)

      // Принудительно обновляем reactive массив
      previewFiles.value = [...previewFiles.value]
    } else {
      // Иначе создаем новый набор файлов
      previewFiles.value = filesWithPreview
      selectedFileType.value = fileType
      showPreview.value = true
    }

    // Очищаем input для возможности повторного выбора того же файла
    target.value = ''
  }
}

// Закрытие превью
const closePreview = () => {
  showPreview.value = false
  // Очищаем URL объекты для предотвращения утечек памяти
  previewFiles.value.forEach(file => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
  previewFiles.value = []
  selectedFileType.value = ''
}

// Обработка отправки файлов из превью
const handleFileSend = (files: FileWithPreview[], fileType: string) => {
  emit('fileSelected', files, fileType)
  closePreview()
}

// Обработка добавления новых файлов
const handleAddFiles = (fileType: string) => {
  // Используем тот же тип файла, что уже выбран, или переданный тип
  const typeToUse = fileType || selectedFileType.value || 'image'

  // Открываем соответствующий input
  if (typeToUse === 'image') {
    imageInput.value?.click()
  } else if (typeToUse === 'video') {
    videoInput.value?.click()
  } else if (typeToUse === 'document') {
    documentInput.value?.click()
  }
}

// Закрываем меню при клике вне его
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
