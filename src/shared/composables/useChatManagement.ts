import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { chatApi } from '@/entities/chat/api/chatApi'
import type { Chat, Message } from '@/shared/lib/types'
import type { Contractor } from '@/shared/api/contractors'

export function useChatManagement() {
  const toast = useToast()
  const chats = ref<Chat[]>([])
  const selectedChat = ref<Chat | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredChats = computed(() => {
    if (!searchQuery.value) return chats.value

    const query = searchQuery.value.toLowerCase()
    return chats.value.filter(chat =>
      chat.client_name.toLowerCase().includes(query) ||
      chat.client_phone.includes(query) ||
      (chat.client_email?.toLowerCase().includes(query))
    )
  })

  const loadChats = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await chatApi.getChats({
        per_page: 50,
        search: searchQuery.value || undefined
      })

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

  const searchChats = async () => {
    if (searchQuery.value.length < 3) return

    try {
      loading.value = true
      const response = await chatApi.searchChats({
        query: searchQuery.value,
        per_page: 50
      })

      if (response.data && Array.isArray(response.data)) {
        chats.value = response.data
      } else if (Array.isArray(response)) {
        chats.value = response
      } else {
        chats.value = []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка поиска чатов'
    } finally {
      loading.value = false
    }
  }

  const createChat = async (contractor: Contractor): Promise<Chat | null> => {
    try {
      loading.value = true

      const chatData = {
        client_name: contractor.name,
        client_phone: contractor.phone,
        client_email: contractor.email,
        message: 'Начало диалога',
        department_id: undefined
      }

      const response = await chatApi.createChat(chatData)

      if (response.data) {
        const newChat = response.data
        chats.value.unshift(newChat)
        
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Чат создан',
          life: 3000,
          group: 'main'
        })

        return newChat
      }

      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания чата'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return null
    } finally {
      loading.value = false
    }
  }

  const selectChat = (chat: Chat) => {
    selectedChat.value = chat
  }

  const updateChatInList = (updatedChat: Chat) => {
    const chatIndex = chats.value.findIndex(c => c.id === updatedChat.id)
    if (chatIndex >= 0) {
      chats.value[chatIndex] = updatedChat
      // Перемещаем обновленный чат в начало списка
      if (chatIndex > 0) {
        const chat = chats.value.splice(chatIndex, 1)[0]
        chats.value.unshift(chat)
      }
    } else {
      // Новый чат - добавляем в начало списка
      chats.value.unshift(updatedChat)
    }
  }

  const updateChatStatus = (chatId: number, status: 'active' | 'closed' | 'transferred') => {
    const chatInList = chats.value.find(c => c.id === chatId)
    if (chatInList) {
      chatInList.status = status
    }

    // Если это текущий открытый чат, возвращаемся к списку
    if (selectedChat.value && selectedChat.value.id === chatId) {
      selectedChat.value = null
    }
  }

  const updateUnreadCount = (chatId: number, count: number) => {
    const chatInList = chats.value.find(c => c.id === chatId)
    if (chatInList) {
      chatInList.unread_count = count
    }
  }

  const resetUnreadCount = (chatId: number) => {
    const chatInList = chats.value.find(c => c.id === chatId)
    if (chatInList) {
      chatInList.unread_count = 0
    }
  }

  return {
    chats,
    selectedChat,
    loading,
    error,
    searchQuery,
    filteredChats,
    loadChats,
    searchChats,
    createChat,
    selectChat,
    updateChatInList,
    updateChatStatus,
    updateUnreadCount,
    resetUnreadCount
  }
}
