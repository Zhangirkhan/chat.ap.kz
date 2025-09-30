import { ref, nextTick } from 'vue'
import { CHAT_STATUSES } from '@/shared/lib/constants'

export function useChatUtils() {
  const showImageViewer = ref(false)
  const viewerImages = ref<Array<{src: string, name?: string}>>([])
  const viewerInitialIndex = ref(0)

  const getStatusText = (status: string) => {
    const statusLabels: Record<string, string> = {
      [CHAT_STATUSES.ACTIVE]: 'Активный',
      [CHAT_STATUSES.CLOSED]: 'Закрытый',
      [CHAT_STATUSES.TRANSFERRED]: 'Переданный'
    }
    return statusLabels[status] || status
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      [CHAT_STATUSES.ACTIVE]: 'green',
      [CHAT_STATUSES.CLOSED]: 'red',
      [CHAT_STATUSES.TRANSFERRED]: 'blue'
    }
    return statusColors[status] || 'gray'
  }

  const formatTime = (timestamp: Date | string) => {
    if (!timestamp) return ''
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Б'
    const k = 1024
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatMessageWithEmoji = (text: string) => {
    if (!text) return text

    const emojiRegex = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}])/gu

    return text.replace(emojiRegex, '<span class="emoji-large">$1</span>')
  }

  const getMessageTypeIndicator = (message: {type?: string} | null | undefined) => {
    if (!message?.type) return null

    switch (message.type) {
      case 'image':
        return 'Картинка'
      case 'video':
        return 'Видео'
      case 'audio':
        return 'Аудио'
      case 'document':
        return 'Документ'
      case 'file':
        return 'Документ'
      default:
        return null
    }
  }

  const getMessageTypeIcon = (message: {type?: string} | null | undefined) => {
    if (!message?.type) return ''

    switch (message.type) {
      case 'image':
        return 'pi pi-image text-purple-500'
      case 'video':
        return 'pi pi-video text-red-500'
      case 'audio':
        return 'pi pi-volume-up text-green-500'
      case 'document':
        return 'pi pi-file text-blue-500'
      case 'file':
        return 'pi pi-file text-blue-500'
      default:
        return ''
    }
  }

  const openImagePreview = (imagePath: string, messages: Array<{type?: string, file_path?: string, file_name?: string}>) => {
    const chatImages = messages
      .filter(msg => msg.type === 'image' && msg.file_path)
      .map(msg => ({
        src: msg.file_path!,
        name: msg.file_name
      }))

    const currentImageIndex = chatImages.findIndex(img => img.src === imagePath)

    viewerImages.value = chatImages
    viewerInitialIndex.value = currentImageIndex >= 0 ? currentImageIndex : 0
    showImageViewer.value = true
  }

  const closeImageViewer = () => {
    showImageViewer.value = false
  }

  const handleEmojiSelect = (emoji: string, messageInput: HTMLTextAreaElement | null, newMessage: { value: string }) => {
    if (!messageInput) return

    const textarea = messageInput
    const start = textarea.selectionStart || 0
    const end = textarea.selectionEnd || 0

    const beforeText = newMessage.value.substring(0, start)
    const afterText = newMessage.value.substring(end)

    newMessage.value = beforeText + emoji + afterText

    nextTick(() => {
      textarea.focus()
      const newPosition = start + emoji.length
      textarea.setSelectionRange(newPosition, newPosition)
    })
  }

  return {
    showImageViewer,
    viewerImages,
    viewerInitialIndex,
    getStatusText,
    getStatusColor,
    formatTime,
    formatFileSize,
    formatMessageWithEmoji,
    getMessageTypeIndicator,
    getMessageTypeIcon,
    openImagePreview,
    closeImageViewer,
    handleEmojiSelect
  }
}
