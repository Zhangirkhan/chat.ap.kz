import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatApi } from '@/entities/chat/api/chatApi'
import type { Chat, Message } from '@/shared/lib/types'

export const useChatStore = defineStore('chat', () => {
  // State
  const chats = ref<Chat[]>([])
  const selectedChat = ref<Chat | null>(null)
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const sendingMessage = ref(false)
  const uploadingFile = ref(false)

  // Getters
  const filteredChats = computed(() => {
    if (!searchQuery.value) return chats.value
    const query = searchQuery.value.toLowerCase()
    return chats.value.filter(chat =>
      chat.client_name.toLowerCase().includes(query) ||
      chat.client_phone.includes(query) ||
      (chat.last_message?.toLowerCase().includes(query))
    )
  })

  const activeChats = computed(() => {
    return chats.value.filter(chat => chat.status === 'active')
  })

  const unreadChats = computed(() => {
    return chats.value.filter(chat => chat.unread_count > 0)
  })

  const totalUnreadCount = computed(() => {
    return chats.value.reduce((total, chat) => total + (chat.unread_count || 0), 0)
  })

  const selectedChatMessages = computed(() => {
    if (!selectedChat.value) return []
    return messages.value.filter(message => message.chat_id === selectedChat.value!.id)
  })

  // Actions
  const loadChats = async (params?: { per_page?: number; search?: string }) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await chatApi.getChats(params || { per_page: 50 })
      
      if (response.data && Array.isArray(response.data)) {
        chats.value = response.data
      } else if (Array.isArray(response)) {
        chats.value = response
      } else {
        chats.value = []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки чатов'
      chats.value = []
    } finally {
      loading.value = false
    }
  }

  const selectChat = (chat: Chat) => {
    selectedChat.value = chat
    // Загружаем сообщения для выбранного чата
    loadMessages(chat.id)
  }

  const loadMessages = async (chatId: number) => {
    try {
      const response = await chatApi.getMessages(chatId, { per_page: 50 })
      
      if (response.data && Array.isArray(response.data)) {
        // Фильтруем сообщения для конкретного чата
        const chatMessages = response.data.filter(msg => msg.chat_id === chatId)
        messages.value = chatMessages
      }
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err)
    }
  }

  const sendMessage = async (messageData: {
    chat_id: number
    content: string
    type?: string
    file?: File
  }) => {
    try {
      sendingMessage.value = true
      
      const response = await chatApi.sendMessage(messageData)
      
      if (response.data) {
        // Добавляем новое сообщение в список
        messages.value.push(response.data)
        
        // Обновляем последнее сообщение в чате
        const chatIndex = chats.value.findIndex(chat => chat.id === messageData.chat_id)
        if (chatIndex !== -1) {
          chats.value[chatIndex].last_message = messageData.content
          chats.value[chatIndex].last_activity_at = new Date().toISOString()
        }
      }
      
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка отправки сообщения'
      return null
    } finally {
      sendingMessage.value = false
    }
  }

  const createChat = async (chatData: {
    title: string
    client_id: number
    department_id?: number
    assigned_to?: number
  }) => {
    try {
      loading.value = true
      
      const response = await chatApi.createChat(chatData)
      
      if (response.data) {
        chats.value.unshift(response.data)
        return response.data
      }
      
      return null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка создания чата'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateChat = async (chatId: number, updateData: Partial<Chat>) => {
    try {
      const response = await chatApi.updateChat(chatId, updateData)
      
      if (response.data) {
        const index = chats.value.findIndex(chat => chat.id === chatId)
        if (index !== -1) {
          chats.value[index] = { ...chats.value[index], ...response.data }
        }
        
        // Обновляем выбранный чат если это он
        if (selectedChat.value?.id === chatId) {
          selectedChat.value = { ...selectedChat.value, ...response.data }
        }
      }
      
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка обновления чата'
      return null
    }
  }

  const closeChat = async (chatId: number) => {
    try {
      const response = await chatApi.closeChat(chatId)
      
      if (response.data) {
        const index = chats.value.findIndex(chat => chat.id === chatId)
        if (index !== -1) {
          chats.value[index].status = 'closed'
        }
        
        // Если это выбранный чат, сбрасываем выбор
        if (selectedChat.value?.id === chatId) {
          selectedChat.value = null
          messages.value = []
        }
      }
      
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка закрытия чата'
      return null
    }
  }

  const markAsRead = (chatId: number) => {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.unread_count = 0
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    chats.value = []
    selectedChat.value = null
    messages.value = []
    loading.value = false
    error.value = null
    searchQuery.value = ''
    sendingMessage.value = false
    uploadingFile.value = false
  }

  return {
    // State
    chats,
    selectedChat,
    messages,
    loading,
    error,
    searchQuery,
    sendingMessage,
    uploadingFile,
    
    // Getters
    filteredChats,
    activeChats,
    unreadChats,
    totalUnreadCount,
    selectedChatMessages,
    
    // Actions
    loadChats,
    selectChat,
    loadMessages,
    sendMessage,
    createChat,
    updateChat,
    closeChat,
    markAsRead,
    setSearchQuery,
    clearError,
    reset
  }
})
