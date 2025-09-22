import { ref } from 'vue'
import type { FileWithPreview } from './useFileOperations'

/**
 * Композабл для отправки файлов из превью
 */
export function useFilePreviewUpload() {
  const sending = ref(false)

  // Отправка файлов
  const sendFiles = async (files: File[], fileType: string, onSuccess?: () => void) => {
    if (sending.value) return

    sending.value = true

    try {
      // Создаем Promise, который разрешится при завершении отправки
      const uploadPromise = new Promise<void>((resolve, reject) => {
        // Устанавливаем обработчики глобально
        const windowObj = window as unknown as {
          fileSendCompleted?: boolean
          fileSendError?: boolean
          onFileSendComplete?: (success: boolean) => void
          testHandleFileSend?: (files: FileWithPreview[], fileType: string) => void
        }

        // Сбрасываем флаг завершения
        windowObj.fileSendCompleted = false
        windowObj.fileSendError = false

        // Обработчик успешного завершения
        const originalOnSuccess = windowObj.onFileSendComplete
        windowObj.onFileSendComplete = (success: boolean) => {
          windowObj.fileSendCompleted = true
          if (originalOnSuccess) originalOnSuccess(success)

          if (success) {
            resolve()
          } else {
            reject(new Error('Ошибка отправки файлов'))
          }
        }

        // Таймаут на случай зависания
        setTimeout(() => {
          if (!windowObj.fileSendCompleted) {
            reject(new Error('Таймаут отправки файлов'))
          }
        }, 30000) // 30 секунд
      })

      // Отправляем файлы через прямой вызов
      const windowObj = window as unknown as {
        fileSendCompleted?: boolean
        fileSendError?: boolean
        onFileSendComplete?: (success: boolean) => void
        testHandleFileSend?: (files: File[], fileType: string) => void
      }

      if (windowObj.testHandleFileSend) {
        windowObj.testHandleFileSend(files, fileType)
      }

      // Ждем завершения отправки
      await uploadPromise

      // Вызываем onSuccess если предоставлен
      if (onSuccess) {
        onSuccess()
      }

    } catch {
      // Показываем ошибку пользователю
      alert('Ошибка отправки файлов. Попробуйте еще раз.')

    } finally {
      sending.value = false
    }
  }

  return {
    sending,
    sendFiles
  }
}
