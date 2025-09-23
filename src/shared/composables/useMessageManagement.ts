import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { chatApi } from '@/entities/chat/api/chatApi'
import type { Message } from '@/shared/lib/types'

export function useMessageManagement() {
  const toast = useToast()
  const messages = ref<Message[]>([])
  const sendingMessage = ref(false)
  const newMessage = ref('')
  const messagesContainer = ref<HTMLElement | null>(null)

  const loadChatMessages = async (chatId: number) => {
    try {
      const response = await chatApi.getChatMessages(chatId, {
        per_page: 100
      })

      if (response.data && Array.isArray(response.data)) {
        messages.value = response.data
      } else if (Array.isArray(response)) {
        messages.value = response
      } else {
        messages.value = []
      }
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err)
      messages.value = []
    }
  }

  const sendMessage = async (chatId: number) => {
    if (!newMessage.value.trim() || sendingMessage.value) return

    try {
      sendingMessage.value = true

      const messageData = {
        message: newMessage.value.trim(),
        type: 'text' as const
      }

      const response = await chatApi.sendMessage(chatId, messageData)

      if (response.data) {
        messages.value.push(response.data)
        newMessage.value = ''
        scrollToBottom()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отправки сообщения'
      
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })
    } finally {
      sendingMessage.value = false
    }
  }

  const addMessage = (message: Message) => {
    // Проверяем, нет ли уже такого сообщения (избегаем дублирования)
    const existingMessage = messages.value.find(m => m.id === message.id)
    if (!existingMessage) {
      messages.value.push(message)
      scrollToBottom()
    }
  }

  const scrollToBottom = (force = false) => {
    if (!messagesContainer.value) return

    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }, force ? 0 : 100)
  }

  const handleScroll = () => {
    // Логика обработки скролла для пагинации
  }

  const setMessagesContainer = (container: HTMLElement) => {
    messagesContainer.value = container
  }

  const clearMessages = () => {
    messages.value = []
    newMessage.value = ''
  }

  return {
    messages,
    sendingMessage,
    newMessage,
    messagesContainer,
    loadChatMessages,
    sendMessage,
    addMessage,
    scrollToBottom,
    handleScroll,
    setMessagesContainer,
    clearMessages
  }
}
