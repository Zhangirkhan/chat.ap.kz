import { ref, onUnmounted } from 'vue'
import { chatApi } from '../api/chatApi'

interface UnreadInfo {
  chat_id: number
  unread_count: number
  last_message?: {
    id: number
    content: string
    created_at: string
    user: {
      id: number
      name: string
    }
  }
}

export function useUnreadMessages() {
  const unreadCounts = ref<Map<number, number>>(new Map())
  const isPolling = ref(false)
  const error = ref<string | null>(null)
  const pollInterval = ref<number | null>(null)

  // Callback для обновления непрочитанных
  const updateCallback = ref<((updates: UnreadInfo[]) => void) | null>(null)

  const startPolling = () => {
    if (isPolling.value) return

    isPolling.value = true

    // Опрашиваем каждые 3 секунды
    pollInterval.value = setInterval(async () => {
      try {
        const response = await chatApi.getChats({ per_page: 100 })
        const chats = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : [])

        const updates: UnreadInfo[] = []

        chats.forEach((chat) => {
          const currentCount = unreadCounts.value.get(chat.id) || 0
          const newCount = chat.unread_count || 0


          // Всегда обновляем счетчик (даже если он тот же)
          unreadCounts.value.set(chat.id, newCount)

          // Добавляем в обновления только если счетчик изменился
          if (currentCount !== newCount) {
            updates.push({
              chat_id: chat.id,
              unread_count: newCount,
              last_message: chat.last_message ? {
                id: chat.last_message.id,
                content: chat.last_message.content || chat.last_message.message,
                created_at: chat.last_message.created_at,
                user: chat.last_message.user || { id: 0, name: 'Неизвестный' }
              } : undefined
            })
          }
        })

        // Вызываем callback если есть обновления
        if (updates.length > 0 && updateCallback.value) {
          updateCallback.value(updates)
        }

        error.value = null
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Polling error'
      }
    }, 3000) // Каждые 3 секунды
  }

  const stopPolling = () => {
    if (pollInterval.value) {
      clearInterval(pollInterval.value)
      pollInterval.value = null
    }
    isPolling.value = false
  }

  const onUnreadUpdate = (callback: (updates: UnreadInfo[]) => void) => {
    updateCallback.value = callback
  }

  // Получить текущее количество непрочитанных для чата
  const getUnreadCount = (chatId: number): number => {
    return unreadCounts.value.get(chatId) || 0
  }

  // Сбросить счетчик для чата (когда открываем чат)
  const markChatAsRead = async (chatId: number) => {
    try {
      const response = await chatApi.markChatAsRead(chatId)

      if (response.success) {
        // Обновляем локальное состояние
        unreadCounts.value.set(chatId, 0)
      }
      } catch (_error) {
      // Даже если API не сработал, обновляем локально
      unreadCounts.value.set(chatId, 0)
    }
  }

  // Очистка при размонтировании
  onUnmounted(() => {
    stopPolling()
  })

  return {
    unreadCounts,
    isPolling,
    error,
    startPolling,
    stopPolling,
    onUnreadUpdate,
    getUnreadCount,
    markChatAsRead
  }
}
