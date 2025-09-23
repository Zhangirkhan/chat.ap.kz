import { ref, nextTick } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { chatApi } from '@/entities/chat/api/chatApi'
import type { Chat } from '@/shared/lib/types'

export function useMessageHandling() {
  const messageText = ref('')
  const messageInput = ref<HTMLTextAreaElement | null>(null)
  const confirm = useConfirm()
  const toast = useToast()

  const handleInput = (event: Event, emit: (event: string, value: string) => void) => {
    const target = event.target as HTMLTextAreaElement
    const value = target.value

    // Обновляем локальную переменную
    messageText.value = value

    // Эмитим обновление для v-model
    emit('update:newMessage', value)

    // Автоматически изменяем высоту
    adjustTextareaHeight()
  }

  const adjustTextareaHeight = () => {
    nextTick(() => {
      if (messageInput.value) {
        messageInput.value.style.height = 'auto'
        messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
      }
    })
  }

  const handleSendMessage = (newMessage: string, sendingMessage: boolean, emit: (event: string) => void) => {
    const currentMessage = newMessage || messageText.value
    if (!currentMessage.trim() || sendingMessage) return

    // Эмитим событие отправки сообщения
    emit('sendMessage')

    // Очищаем поле ввода
    messageText.value = ''
    emit('update:newMessage', '')

    // Сбрасываем высоту textarea
    nextTick(() => {
      if (messageInput.value) {
        messageInput.value.style.height = '48px'
      }
    })
  }

  const handleCloseChat = (selectedChat: Chat | null, emit: (event: string, chatId: number) => void) => {
    if (!selectedChat) return

    confirm.require({
      message: 'Вы уверены, что хотите закрыть этот чат?',
      header: 'Подтверждение закрытия',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Отмена',
      acceptLabel: 'Закрыть чат',
      accept: async () => {
        try {
          const response = await chatApi.closeMessengerChat(selectedChat.id)

          if (response.success) {
            toast.add({
              severity: 'success',
              summary: 'Успешно',
              detail: 'Чат закрыт. Клиенту отправлено уведомление.',
              life: 5000
            })

            // Эмитим событие о закрытии чата
            emit('chatClosed', selectedChat.id)
          }
        } catch {
          toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось закрыть чат',
            life: 5000
          })
        }
      }
    })
  }

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    console.warn('Failed to load image:', img.src)
  }

  return {
    messageText,
    messageInput,
    handleInput,
    adjustTextareaHeight,
    handleSendMessage,
    handleCloseChat,
    handleImageError
  }
}
