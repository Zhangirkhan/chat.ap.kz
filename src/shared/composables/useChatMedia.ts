import { ref } from 'vue'
import type { Message } from '@/shared/lib/types'

export function useChatMedia() {
  const showImageViewer = ref(false)
  const viewerImages = ref<string[]>([])
  const viewerInitialIndex = ref(0)
  const previewFiles = ref<File[]>([])
  const showPreview = ref(false)
  const uploadingFile = ref(false)

  const openImagePreview = (imagePath: string, messages: Message[]) => {
    // Находим все изображения в сообщениях
    const images = messages
      .filter(msg => msg.type === 'image' && msg.file_path)
      .map(msg => msg.file_path!)
    
    const currentIndex = images.indexOf(imagePath)
    
    if (currentIndex !== -1) {
      viewerImages.value = images
      viewerInitialIndex.value = currentIndex
      showImageViewer.value = true
    }
  }

  const closeImageViewer = () => {
    showImageViewer.value = false
    viewerImages.value = []
    viewerInitialIndex.value = 0
  }

  const handleFileUpload = (file: File) => {
    previewFiles.value = [file]
    showPreview.value = true
  }

  const handleFileError = (error: string) => {
    console.error('Ошибка загрузки файла:', error)
  }

  const handleFileSend = async (
    files: Array<{preview?: string, caption?: string, id?: string} & File>,
    fileType: string,
    chatId: number,
    onSuccess: () => void,
    chatType: 'wazzup' | 'regular' = 'regular'
  ) => {
    try {
      uploadingFile.value = true
      
      // Здесь должна быть логика отправки файлов
      // Пока что просто вызываем onSuccess
      onSuccess()
      
    } catch (error) {
      console.error('Ошибка отправки файла:', error)
    } finally {
      uploadingFile.value = false
    }
  }

  const handleFileCancel = () => {
    showPreview.value = false
    previewFiles.value = []
  }

  const handleEmojiSelect = (emoji: string, messageInput: HTMLTextAreaElement | null, newMessage: any) => {
    if (messageInput && newMessage) {
      const currentValue = newMessage.value || ''
      const newValue = currentValue + emoji
      newMessage.value = newValue
      
      // Фокусируемся на поле ввода
      messageInput.focus()
      
      // Устанавливаем курсор в конец
      setTimeout(() => {
        messageInput.setSelectionRange(newValue.length, newValue.length)
      }, 0)
    }
  }

  return {
    showImageViewer,
    viewerImages,
    viewerInitialIndex,
    previewFiles,
    showPreview,
    uploadingFile,
    openImagePreview,
    closeImageViewer,
    handleFileUpload,
    handleFileError,
    handleFileSend,
    handleFileCancel,
    handleEmojiSelect
  }
}
