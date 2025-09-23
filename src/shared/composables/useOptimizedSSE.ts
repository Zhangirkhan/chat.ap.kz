import { ref, computed, onUnmounted } from 'vue'

interface SSEEvent {
  type: string
  data: unknown
  chatId?: number
  timestamp: number
}

interface SSEConfig {
  baseUrl: string
  token: string
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
}

export function useOptimizedSSE(config: SSEConfig) {
  const eventSource = ref<EventSource | null>(null)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)
  const reconnectAttempts = ref(0)
  const lastHeartbeat = ref<number>(0)
  
  // Подписки на события
  const subscriptions = ref<Map<string, Set<(data: unknown) => void>>>(new Map())
  
  // Буфер событий для обработки при переподключении
  const eventBuffer = ref<SSEEvent[]>([])
  const maxBufferSize = 100

  const connect = async (): Promise<void> => {
    if (isConnecting.value || isConnected.value) {
      return
    }

    try {
      isConnecting.value = true
      error.value = null

      // Закрываем предыдущее соединение если есть
      if (eventSource.value) {
        disconnect()
      }

      const url = `${config.baseUrl}/api/chat-stream/global?token=${encodeURIComponent(config.token)}`
      eventSource.value = new EventSource(url, {
        withCredentials: true
      })

      // Обработчики событий
      eventSource.value.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        error.value = null
        reconnectAttempts.value = 0
        lastHeartbeat.value = Date.now()
        
        console.log('SSE соединение установлено')
        
        // Обрабатываем буферизованные события
        processEventBuffer()
      }

      eventSource.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleEvent(data)
        } catch (err) {
          console.error('Ошибка парсинга SSE события:', err)
        }
      }

      eventSource.value.onerror = (event) => {
        console.error('SSE ошибка:', event)
        isConnected.value = false
        isConnecting.value = false
        
        if (reconnectAttempts.value < config.maxReconnectAttempts) {
          scheduleReconnect()
        } else {
          error.value = 'Не удалось установить соединение с сервером'
        }
      }

      // Обработчики специфичных событий
      eventSource.value.addEventListener('heartbeat', () => {
        lastHeartbeat.value = Date.now()
      })

      eventSource.value.addEventListener('chat_message', (event) => {
        const data = JSON.parse(event.data)
        handleChatMessage(data)
      })

      eventSource.value.addEventListener('chat_update', (event) => {
        const data = JSON.parse(event.data)
        handleChatUpdate(data)
      })

      eventSource.value.addEventListener('unread_update', (event) => {
        const data = JSON.parse(event.data)
        handleUnreadUpdate(data)
      })

    } catch (err) {
      isConnecting.value = false
      error.value = err instanceof Error ? err.message : 'Ошибка подключения'
      console.error('Ошибка создания SSE соединения:', err)
    }
  }

  const disconnect = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    isConnected.value = false
    isConnecting.value = false
  }

  const scheduleReconnect = () => {
    setTimeout(() => {
      reconnectAttempts.value++
      connect()
    }, config.reconnectInterval * reconnectAttempts.value)
  }

  const handleEvent = (data: SSEEvent) => {
    // Добавляем в буфер если не подключены
    if (!isConnected.value) {
      addToBuffer(data)
      return
    }

    // Распределяем события по подписчикам
    const eventType = data.type
    const subscribers = subscriptions.value.get(eventType)
    
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data.data)
        } catch (err) {
          console.error('Ошибка в обработчике SSE события:', err)
        }
      })
    }
  }

  const handleChatMessage = (data: unknown) => {
    const subscribers = subscriptions.value.get('chat_message')
    if (subscribers) {
      subscribers.forEach(callback => callback(data))
    }
  }

  const handleChatUpdate = (data: unknown) => {
    const subscribers = subscriptions.value.get('chat_update')
    if (subscribers) {
      subscribers.forEach(callback => callback(data))
    }
  }

  const handleUnreadUpdate = (data: unknown) => {
    const subscribers = subscriptions.value.get('unread_update')
    if (subscribers) {
      subscribers.forEach(callback => callback(data))
    }
  }

  const addToBuffer = (event: SSEEvent) => {
    eventBuffer.value.push({
      ...event,
      timestamp: Date.now()
    })

    // Ограничиваем размер буфера
    if (eventBuffer.value.length > maxBufferSize) {
      eventBuffer.value = eventBuffer.value.slice(-maxBufferSize)
    }
  }

  const processEventBuffer = () => {
    const now = Date.now()
    const maxAge = 30000 // 30 секунд

    // Обрабатываем только свежие события
    const freshEvents = eventBuffer.value.filter(
      event => now - event.timestamp < maxAge
    )

    freshEvents.forEach(event => {
      handleEvent(event)
    })

    eventBuffer.value = []
  }

  // Подписка на события
  const subscribe = (eventType: string, callback: (data: unknown) => void) => {
    if (!subscriptions.value.has(eventType)) {
      subscriptions.value.set(eventType, new Set())
    }
    subscriptions.value.get(eventType)!.add(callback)

    // Возвращаем функцию отписки
    return () => {
      const subscribers = subscriptions.value.get(eventType)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          subscriptions.value.delete(eventType)
        }
      }
    }
  }

  // Отписка от всех событий
  const unsubscribe = (eventType: string, callback: (data: unknown) => void) => {
    const subscribers = subscriptions.value.get(eventType)
    if (subscribers) {
      subscribers.delete(callback)
      if (subscribers.size === 0) {
        subscriptions.value.delete(eventType)
      }
    }
  }

  // Очистка всех подписок
  const clearSubscriptions = () => {
    subscriptions.value.clear()
  }

  // Мониторинг соединения
  const startHeartbeatMonitor = () => {
    setInterval(() => {
      if (isConnected.value) {
        const timeSinceLastHeartbeat = Date.now() - lastHeartbeat.value
        if (timeSinceLastHeartbeat > config.heartbeatInterval * 2) {
          console.warn('SSE heartbeat timeout, переподключаемся...')
          disconnect()
          connect()
        }
      }
    }, config.heartbeatInterval)
  }

  // Статистика
  const stats = computed(() => ({
    isConnected: isConnected.value,
    isConnecting: isConnecting.value,
    reconnectAttempts: reconnectAttempts.value,
    subscriptionsCount: subscriptions.value.size,
    bufferSize: eventBuffer.value.length,
    lastHeartbeat: lastHeartbeat.value
  }))

  // Очистка при размонтировании
  onUnmounted(() => {
    disconnect()
    clearSubscriptions()
  })

  return {
    // Состояние
    isConnected: computed(() => isConnected.value),
    isConnecting: computed(() => isConnecting.value),
    error: computed(() => error.value),
    stats,
    
    // Методы
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    clearSubscriptions,
    startHeartbeatMonitor
  }
}
