import { ref, computed } from 'vue'
import type { FileWithPreview } from './useFileOperations'

/**
 * Композабл для управления состоянием превью файлов
 */
export function useFilePreviewState() {
  const currentIndex = ref(0)
  const showCaptionEmoji = ref(false)
  const localFiles = ref<FileWithPreview[]>([])

  // Инициализируем локальные файлы с уникальными ID и пустыми подписями
  // ВАЖНО: сохраняем оригинальные File объекты, не разрушаем их через spread
  const initializeFiles = (files: FileWithPreview[]) => {
    localFiles.value = files.map((file, index) => {
      // Используем Object.assign чтобы сохранить прототип File
      const fileWithMeta = file as FileWithPreview
      const withMeta = Object.assign(fileWithMeta, {
        id: fileWithMeta.id || `file_${Date.now()}_${index}`,
        caption: fileWithMeta.caption || ''
      })
      return withMeta
    })
  }

  // Текущий файл
  const currentFile = computed(() => {
    return localFiles.value[currentIndex.value] || null
  })

  // Подпись текущего файла
  const currentCaption = computed({
    get: () => currentFile.value?.caption || '',
    set: (value: string) => {
      if (currentFile.value) {
        currentFile.value.caption = value
      }
    }
  })

  // Навигация между файлами
  const previousFile = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  const nextFile = () => {
    if (currentIndex.value < localFiles.value.length - 1) {
      currentIndex.value++
    }
  }

  // Удаление файла по индексу
  const removeFileByIndex = (index: number, closePreview: () => void) => {
    if (localFiles.value.length <= 1) {
      closePreview()
      return
    }

    localFiles.value.splice(index, 1)

    // Корректируем индекс
    if (currentIndex.value >= index && currentIndex.value > 0) {
      currentIndex.value--
    } else if (currentIndex.value >= localFiles.value.length) {
      currentIndex.value = localFiles.value.length - 1
    }
  }

  // Удаление текущего файла
  const removeCurrentFile = (closePreview: () => void) => {
    removeFileByIndex(currentIndex.value, closePreview)
  }

  // Добавление эмодзи в подпись
  const addEmojiToCaption = (emoji: string) => {
    currentCaption.value += emoji
    showCaptionEmoji.value = false
  }

  // Сброс состояния
  const resetState = () => {
    currentIndex.value = 0
    showCaptionEmoji.value = false
    localFiles.value = []
  }

  return {
    // Состояние
    currentIndex,
    showCaptionEmoji,
    localFiles,

    // Вычисляемые свойства
    currentFile,
    currentCaption,

    // Методы
    initializeFiles,
    previousFile,
    nextFile,
    removeFileByIndex,
    removeCurrentFile,
    addEmojiToCaption,
    resetState
  }
}
