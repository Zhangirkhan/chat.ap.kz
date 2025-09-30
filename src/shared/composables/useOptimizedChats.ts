import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOptimizedSSE } from './useOptimizedSSE'
import { useSmartCache } from './useSmartCache'
import { chatApi } from '@/entities/chat/api/chatApi'
import type { Chat, Message } from '@/shared/lib/types'

export function useOptimizedChats() {
  const chats = ref<Chat[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Кэш для чатов (короткое время жизни)
  const chatCache = useSmartCache<Chat[]>({ ttl: 60000, maxSize: 50 })
  
  // SSE конфигурация
  const sseConfig = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://back-erp.ap.kz',
    token: localStorage.getItem('token') || '',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000
  }
  
  const sse = useOptimizedSSE(sseConfig)
  
  // Подписки на события
  const unreadSubscriptions = ref<Map<number, () => void>>(new Map())
  const messageSubscriptions = ref<Map<number, () => void>>(new Map())

  // Загрузка чатов с кэшированием
  const loadChats = async (forceRefresh = false) => {
    const cacheKey = 'chats-list'
    
    // Проверяем кэш если не принудительное обновление
    if (!forceRefresh) {
      const cachedChats = chatCache.get(cacheKey)
      if (cachedChats) {
        chats.value = cachedChats
        return
      }
    }

    try {
      loading.value = true
      error.value = null

      const response = await chatApi.getChats({ per_page: 50 })
      const chatData = Array.isArray(response.data) ? response.data : []
      
      chats.value = chatData
      chatCache.set(cacheKey, chatData)
      
    } catch (err: unknown) {
      error.value = err.message || 'Ошибка загрузки чатов'
      console.error('Ошибка загрузки чатов:', err)
    } finally {
      loading.value = false
    }
  }

  // Поиск чатов
  const searchChats = async (query: string) => {
    if (query.length < 3) {
      return
    }

    try {
      loading.value = true
      const response = await chatApi.searchChats({ query, per_page: 50 })
      const chatData = Array.isArray(response.data) ? response.data : []
      chats.value = chatData
    } catch (err: unknown) {
      error.value = err.message || 'Ошибка поиска чатов'
    } finally {
      loading.value = false
    }
  }

  // Подписка на обновления непрочитанных сообщений
  const subscribeToUnreadUpdates = (callback: (updates: unknown[]) => void) => {
    const unsubscribe = sse.subscribe('unread_update', callback)
    return unsubscribe
  }

  // Подписка на новые сообщения в чате
  const subscribeToChatMessages = (chatId: number, callback: (message: Message) => void) => {
    const unsubscribe = sse.subscribe('chat_message', (data) => {
      if (data.chat_id === chatId) {
        callback(data.message)
      }
    })
    
    messageSubscriptions.value.set(chatId, unsubscribe)
    return unsubscribe
  }

  // Отписка от сообщений чата
  const unsubscribeFromChatMessages = (chatId: number) => {
    const unsubscribe = messageSubscriptions.value.get(chatId)
    if (unsubscribe) {
      unsubscribe()
      messageSubscriptions.value.delete(chatId)
    }
  }

  // Обновление чата в списке
  const updateChatInList = (chatId: number, updates: Partial<Chat>) => {
    const index = chats.value.findIndex(chat => chat.id === chatId)
    if (index !== -1) {
      chats.value[index] = { ...chats.value[index], ...updates }
      
      // Обновляем кэш
      const cacheKey = 'chats-list'
      chatCache.set(cacheKey, chats.value)
    }
  }

  // Добавление нового чата
  const addChatToList = (chat: Chat) => {
    chats.value.unshift(chat)
    
    // Обновляем кэш
    const cacheKey = 'chats-list'
    chatCache.set(cacheKey, chats.value)
  }

  // Удаление чата из списка
  const removeChatFromList = (chatId: number) => {
    const index = chats.value.findIndex(chat => chat.id === chatId)
    if (index !== -1) {
      chats.value.splice(index, 1)
      
      // Обновляем кэш
      const cacheKey = 'chats-list'
      chatCache.set(cacheKey, chats.value)
    }
  }

  // Инвалидация кэша
  const invalidateCache = () => {
    chatCache.clear()
  }

  // Статистика
  const stats = computed(() => ({
    totalChats: chats.value.length,
    activeChats: chats.value.filter(chat => chat.status === 'active').length,
    unreadTotal: chats.value.reduce((sum, chat) => sum + (chat.unread_count || 0), 0),
    sseConnected: sse.isConnected.value,
    cacheHitRate: chatCache.hitRate.value
  }))

  // Инициализация
  onMounted(async () => {
    await loadChats()
    await sse.connect()
    sse.startHeartbeatMonitor()

    // Подписка на создание нового чата (появляется без перезагрузки)
    const unsubCreated = sse.subscribe('chat_created', (data: any) => {
      const chat = data?.chat || data
      if (!chat || !chat.id) return
      // Не добавляем дубликаты
      if (!chats.value.find(c => c.id === chat.id)) {
        addChatToList(chat as Chat)
      }
    })

    // Глобальная подписка на новые сообщения для обновления непрочитанных
    const unsubChatMsg = sse.subscribe('chat_message', (data: any) => {
      const chatId = data?.chat_id || data?.chat?.id
      const message: any = data?.message
      if (!chatId || !message) return

      const index = chats.value.findIndex(c => c.id === chatId)
      if (index === -1) {
        // Если чата нет в списке, и сервер прислал объект чата, добавим
        if (data?.chat && data.chat.id) {
          addChatToList(data.chat as Chat)
        }
        return
      }

      // Увеличиваем счётчик непрочитанных для входящих сообщений
      if (message.is_from_client) {
        const current = chats.value[index].unread_count || 0
        chats.value[index] = { ...chats.value[index], unread_count: current + 1 }
        // Обновляем кэш
        const cacheKey = 'chats-list'
        chatCache.set(cacheKey, chats.value)
      }
    })

    // Сохраняем отписки
    unreadSubscriptions.value.set(-1, unsubCreated as unknown as () => void)
    messageSubscriptions.value.set(-1, unsubChatMsg as unknown as () => void)
  })

  // Очистка при размонтировании
  onUnmounted(() => {
    // Отписываемся от всех сообщений
    messageSubscriptions.value.forEach(unsubscribe => unsubscribe())
    messageSubscriptions.value.clear()
    unreadSubscriptions.value.forEach(unsubscribe => unsubscribe())
    unreadSubscriptions.value.clear()
    
    // Отключаем SSE
    sse.disconnect()
  })

  return {
    // Состояние
    chats: computed(() => chats.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    stats,
    
    // Методы
    loadChats,
    searchChats,
    updateChatInList,
    addChatToList,
    removeChatFromList,
    invalidateCache,
    
    // SSE подписки
    subscribeToUnreadUpdates,
    subscribeToChatMessages,
    unsubscribeFromChatMessages,
    
    // SSE состояние
    sseConnected: sse.isConnected,
    sseError: sse.error
  }
}
