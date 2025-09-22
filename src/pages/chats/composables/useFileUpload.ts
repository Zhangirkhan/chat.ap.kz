import { ref } from 'vue'
import { chatApi } from '@/entities/chat/api/chatApi'
import { useToast } from 'primevue/usetoast'
import { uploadFileToServer, getMediaTypeFromFile } from '@/shared/utils/fileUpload'

export function useFileUpload() {
  const toast = useToast()

  const uploadingFile = ref(false)
  const previewFiles = ref<Array<File & {id?: string}>>([])
  const showPreview = ref(false)

  const handleFileUpload = (files: File[]) => {
    if (!files || files.length === 0) return

    const filesWithId = files.map(file => {
      const fileWithId = file as File & {id: string}
      fileWithId.id = Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      return fileWithId
    })

    previewFiles.value = filesWithId
    showPreview.value = true
  }

  const handleFileError = (errors: string[]) => {
    errors.forEach(error => {
      toast.add({
        severity: 'error',
        summary: 'Ошибка файла',
        detail: error,
        life: 5000
      })
    })
  }

  const handleFileSend = async (
    files: Array<{preview?: string, caption?: string, id?: string} & File>,
    fileType: string,
    chatId: number,
    onSuccess?: () => void,
    chatType?: string
  ) => {
    if (!chatId || !files.length) return

    try {
      uploadingFile.value = true

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const message = (file.caption || '').trim() || file.name

        let messageType: 'text' | 'image' | 'video' | 'audio' | 'file' = 'file'
        if (file.type.startsWith('image/')) {
          messageType = 'image'
        } else if (file.type.startsWith('video/')) {
          messageType = 'video'
        } else if (file.type.startsWith('audio/')) {
          messageType = 'audio'
        }

        // Если чат Wazzup24, используем специальный API для отправки медиа
        if (chatType === 'wazzup') {
          try {
            // Сначала загружаем файл на сервер и получаем публичный URL
            const mediaUrl = await uploadFileToServer(file)
            
            // Определяем тип медиа для Wazzup24
            const wazzupMediaType = getMediaTypeFromFile(file)
            
            // Отправляем медиа через Wazzup24 API
            const res = await chatApi.sendWazzupMedia(chatId, {
              media_url: mediaUrl,
              media_type: wazzupMediaType,
              caption: message,
              file_name: file.name
            })
          } catch (uploadError) {
            console.error('Ошибка загрузки файла для Wazzup24:', uploadError)
            // Fallback: используем стандартный метод загрузки
            const res = await chatApi.sendMessage(chatId, {
              message: message,
              type: messageType,
              file: file
            })
          }
        } else {
          // Обычная отправка для других типов чатов
          const res = await chatApi.sendMessage(chatId, {
            message: message,
            type: messageType,
            file: file
          })
        }
      }

    // НЕ закрываем превью автоматически здесь - это делает родительский компонент
    // showPreview.value = false
    // previewFiles.value = []

    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `${files.length} файл(ов) отправлено`,
      life: 3000
    })

    // Уведомляем FilePreview о успешном завершении
    const windowObj = window as unknown as { onFileSendComplete?: (success: boolean) => void }
    if (windowObj.onFileSendComplete) {
      windowObj.onFileSendComplete(true)
    }

    if (onSuccess) {
      onSuccess()
    }
    } catch (error: unknown) {
      let errorMessage = 'Не удалось отправить файл'
      const apiError = error as {response?: {status?: number, data?: {message?: string}}}

      if (apiError.response?.status === 422) {
        errorMessage = apiError.response.data?.message || 'Необходимо указать сообщение или прикрепить файл'
      } else if (apiError.response?.status === 413) {
        errorMessage = 'Файл слишком большой. Максимальный размер: 50 МБ'
      }

      toast.add({
        severity: 'error',
        summary: 'Ошибка загрузки файла',
        detail: errorMessage,
        life: 5000
      })

      // Уведомляем FilePreview об ошибке
      const windowObj = window as unknown as { onFileSendComplete?: (success: boolean) => void }
      if (windowObj.onFileSendComplete) {
        windowObj.onFileSendComplete(false)
      }
    } finally {
      uploadingFile.value = false
    }
  }

  const handleFileCancel = () => {
    showPreview.value = false
    previewFiles.value = []
  }

  return {
    uploadingFile,
    previewFiles,
    showPreview,
    handleFileUpload,
    handleFileError,
    handleFileSend,
    handleFileCancel
  }
}
