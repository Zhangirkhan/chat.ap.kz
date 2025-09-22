import { ref, onUnmounted } from 'vue'
import type { Message } from '@/shared/lib/types'

export function useChatSSE() {
  const eventSource = ref<EventSource | null>(null)
  const isConnected = ref(false)
  const error = ref<string | null>(null)
  const currentChatId = ref<number | null>(null)
  const retryCount = ref(0)
  const maxRetries = 5

  const connect = async (chatId: number) => {
    try {
      // Закрываем предыдущее соединение если есть
      if (eventSource.value) {
        disconnect()
      }

      currentChatId.value = chatId
      error.value = null

      // Получаем токен авторизации (основной ключ 'token')
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No auth token found')
      }

      // Создаем SSE соединение с токеном в URL (так как EventSource не поддерживает заголовки)
      const url = `https://back-ERP.AP.KZ/api/chat-stream/${chatId}/stream?token=${encodeURIComponent(token)}`
      eventSource.value = new EventSource(url, {
        withCredentials: true
      })

      // Обработчики событий
      eventSource.value.onopen = () => {
        isConnected.value = true
        error.value = null
        retryCount.value = 0
      }

      eventSource.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Обрабатываем разные типы сообщений
          switch (data.type) {
            case 'connected':
              break
            case 'new_message':
              // Вызываем callback для нового сообщения
              if (messageCallback.value && data.message) {
                messageCallback.value(data.message)
              }
              break
            default:
              // Неизвестный тип сообщения
          }
        } catch (e) {
        }
      }

      eventSource.value.onerror = (event) => {
        isConnected.value = false

        // Автоматическое переподключение с экспоненциальной задержкой
        if (retryCount.value < maxRetries) {
          const delay = Math.pow(2, retryCount.value) * 1000 // 1s, 2s, 4s, 8s, 16s
          retryCount.value++


          setTimeout(() => {
            if (currentChatId.value) {
              connect(currentChatId.value)
            }
          }, delay)
        } else {
          error.value = 'Failed to connect after multiple attempts'
        }
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to connect to chat stream'
    }
  }

  const disconnect = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    isConnected.value = false
    currentChatId.value = null
    retryCount.value = 0
  }

  const switchChat = async (newChatId: number) => {
    await connect(newChatId)
  }

  // Callback для обработки новых сообщений
  const messageCallback = ref<((message: Message) => void) | null>(null)

  const onNewMessage = (callback: (message: Message) => void) => {
    messageCallback.value = callback
  }

  // Получить статус подключений к чату
  const getChatStatus = async (chatId: number) => {
    try {
      // Используем fetch напрямую, так как chatApi не имеет метода get
      const response = await fetch(`https://back-ERP.AP.KZ/api/chat-stream/${chatId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      return data
    } catch (err) {
      return { connected_users: 0, status: 'error' }
    }
  }

  // Очистка при размонтировании компонента
  onUnmounted(() => {
    disconnect()
  })

  return {
    eventSource,
    isConnected,
    error,
    currentChatId,
    connect,
    disconnect,
    switchChat,
    onNewMessage,
    getChatStatus
  }
}
