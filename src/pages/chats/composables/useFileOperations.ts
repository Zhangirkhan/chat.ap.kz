export interface FileWithPreview extends File {
  preview?: string
  caption?: string
  id?: string
}

/**
 * Композабл для операций с файлами
 */
export function useFileOperations() {
  // Функции проверки типа файла
  const isImage = (file: File) => {
    return file && file.type && file.type.startsWith('image/')
  }

  const isVideo = (file: File) => {
    return file && file.type && file.type.startsWith('video/')
  }

  const isAudio = (file: File) => {
    return file && file.type && file.type.startsWith('audio/')
  }

  // Получение иконки для типа файла
  const getFileIcon = (file: File) => {
    if (!file?.name) return 'pi pi-file text-blue-600 dark:text-blue-400'

    const extension = file.name.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf text-red-600 dark:text-red-400'
      case 'doc':
      case 'docx':
        return 'pi pi-file-word text-blue-600 dark:text-blue-400'
      case 'ppt':
      case 'pptx':
        return 'pi pi-desktop text-orange-600 dark:text-orange-400'
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel text-green-600 dark:text-green-400'
      case 'csv':
        return 'pi pi-table text-green-600 dark:text-green-400'
      case 'txt':
        return 'pi pi-file-edit text-gray-600 dark:text-gray-400'
      case 'json':
        return 'pi pi-code text-purple-600 dark:text-purple-400'
      case 'xml':
        return 'pi pi-code text-indigo-600 dark:text-indigo-400'
      case 'zip':
      case 'rar':
      case '7z':
        return 'pi pi-folder text-yellow-600 dark:text-yellow-400'
      case 'mp3':
      case 'wav':
      case 'm4a':
        return 'pi pi-volume-up text-pink-600 dark:text-pink-400'
      case 'mkv':
        return 'pi pi-video text-red-600 dark:text-red-400'
      default:
        return 'pi pi-file text-blue-600 dark:text-blue-400'
    }
  }

  // Получение URL для превью
  const getFileUrl = (file: FileWithPreview) => {
    if (file.preview) {
      return file.preview
    }
    // Безопасная проверка на File/Blob
    const fileObj = file as unknown
    if (fileObj instanceof File || fileObj instanceof Blob) {
      return URL.createObjectURL(fileObj)
    }
    // fallback если кто-то сломал прототип
    return ''
  }

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Б'
    const k = 1024
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    isImage,
    isVideo,
    isAudio,
    getFileIcon,
    getFileUrl,
    formatFileSize
  }
}
