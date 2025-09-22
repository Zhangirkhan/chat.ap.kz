import { ref, nextTick, watch } from 'vue'
import { chatApi } from '@/entities/chat/api/chatApi'
import type { Message } from '@/shared/lib/types'
import { useToast } from 'primevue/usetoast'

export function useMessages() {
  const toast = useToast()

  const messages = ref<Message[]>([])
  const sendingMessage = ref(false)
  const newMessage = ref('')
  const messagesContainer = ref<HTMLElement | null>(null)
  const scrollTimeout = ref<number | null>(null)

  const loadChatMessages = async (chatId: number) => {
    try {

      const response = await chatApi.getChatMessages(chatId, {
        per_page: 100
      })


      if (response.data && Array.isArray(response.data)) {
        messages.value = response.data.reverse()
      } else if (Array.isArray(response)) {
        messages.value = response.reverse()
      } else {
        messages.value = []
      }


    } catch (err) {
      messages.value = []
    }
  }

  const sendMessage = async (chatId: number) => {
    if (!newMessage.value.trim()) return

    try {
      sendingMessage.value = true

      await chatApi.sendMessage(chatId, {
        message: newMessage.value.trim(),
        type: 'text'
      })

      newMessage.value = ''

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Сообщение отправлено',
        life: 3000
      })
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: err instanceof Error ? err.message : 'Ошибка отправки сообщения',
        life: 5000
      })
    } finally {
      sendingMessage.value = false
    }
  }

  const scrollToBottom = (force = false) => {
    if (!messagesContainer.value) {
      return
    }

    const performScroll = () => {
      if (messagesContainer.value) {
        const scrollHeight = messagesContainer.value.scrollHeight
        const clientHeight = messagesContainer.value.clientHeight
        const scrollTop = messagesContainer.value.scrollTop


        // Если контент помещается в контейнер, скролл не нужен
        if (scrollHeight <= clientHeight) {
          return
        }

        // Плавный скролл
        messagesContainer.value.scrollTo({
          top: scrollHeight,
          behavior: force ? 'auto' : 'smooth'
        })

        // Альтернативный метод на случай если smooth не работает
        setTimeout(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
          }
        }, force ? 50 : 100)
      }
    }

    if (force) {
      // Принудительный скролл с дополнительной задержкой
      setTimeout(() => {
        performScroll()
      }, 100)
    } else {
      nextTick(() => {
        performScroll()
      })
    }
  }

  const handleScroll = () => {
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }

    scrollTimeout.value = setTimeout(() => {
      markVisibleMessagesAsRead()
    }, 500)
  }

  const markVisibleMessagesAsRead = async () => {
    if (!messagesContainer.value) return

    const container = messagesContainer.value
    const containerRect = container.getBoundingClientRect()
    const messageElements = container.querySelectorAll('[data-message-id]')

    const visibleMessageIds: number[] = []

    messageElements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const isVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top

      if (isVisible) {
        const messageId = parseInt(element.getAttribute('data-message-id') || '0')
        if (messageId) {
          visibleMessageIds.push(messageId)
        }
      }
    })

    if (visibleMessageIds.length > 0) {
      try {
        await chatApi.markMultipleMessagesAsRead(visibleMessageIds)

        messages.value.forEach(message => {
          if (visibleMessageIds.includes(message.id)) {
            message.is_read = true
            message.read_at = new Date().toISOString()
          }
        })
      } catch (error) {
      }
    }
  }

  const markChatAsRead = async (chatId: number) => {
    try {
      await chatApi.markChatAsRead(chatId)

      messages.value.forEach(message => {
        message.is_read = true
        message.read_at = new Date().toISOString()
      })
    } catch (error) {
    }
  }

  const addNewMessage = (message: Message) => {
    const existingMessage = messages.value.find(m => m.id === message.id)
    if (!existingMessage) {
      messages.value.push(message)
      scrollToBottom()
    }
  }

  const setMessagesContainer = (container: HTMLElement) => {
    messagesContainer.value = container
  }

  // Автоскролл при добавлении новых сообщений
  watch(messages, (newMessages, oldMessages) => {
    if (newMessages.length > oldMessages?.length) {
      // Новое сообщение добавлено - скроллим вниз с небольшой задержкой
      setTimeout(() => {
        scrollToBottom()
      }, 150)
    }
  }, { deep: true })

  return {
    messages,
    sendingMessage,
    newMessage,
    messagesContainer,
    loadChatMessages,
    sendMessage,
    scrollToBottom,
    handleScroll,
    markChatAsRead,
    addNewMessage,
    setMessagesContainer
  }
}
