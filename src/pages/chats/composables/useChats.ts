import { ref, computed } from 'vue'
import { chatApi } from '@/entities/chat/api/chatApi'
import type { Chat, CreateChatData } from '@/shared/lib/types'
import type { Contractor } from '@/shared/api/contractors'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/features/auth'

export function useChats() {
  const toast = useToast()
  const authStore = useAuthStore()

  const chats = ref<Chat[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredChats = computed(() => {
    // Сначала исключаем закрытые чаты
    const activeChats = chats.value.filter(chat => chat.status !== 'closed')
    
    if (!searchQuery.value) return activeChats

    const query = searchQuery.value.toLowerCase()
    const filtered = activeChats.filter(chat =>
      chat.client_name.toLowerCase().includes(query) ||
      chat.client_phone?.includes(query) ||
      chat.client_email?.toLowerCase().includes(query) ||
      chat.assigned_user?.name.toLowerCase().includes(query) ||
      chat.user?.name.toLowerCase().includes(query) ||
      (chat.last_message?.message?.toLowerCase().includes(query))
    )

    return filtered.slice(0, 50) // Максимум 50 результатов
  })

  const loadChats = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await chatApi.getChats({
        per_page: 50
      })

      console.log('API response:', response)

      if (response.data && Array.isArray(response.data)) {
        chats.value = response.data
        console.log('Loaded chats from response.data:', response.data)
      } else if (Array.isArray(response)) {
        chats.value = response
        console.log('Loaded chats from response:', response)
      } else {
        chats.value = []
        console.log('No chats loaded, response:', response)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки чатов'
      chats.value = []
    } finally {
      loading.value = false
    }
  }

  const searchChats = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await chatApi.searchChats({
        query: searchQuery.value,
        status: 'active' // Ищем только активные чаты
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
      chats.value = []
    } finally {
      loading.value = false
    }
  }

  const createChat = async (contractor: Contractor) => {
    try {
      const user = authStore.user
      const isAdmin = user?.email === 'admin@erp.ap.kz' || user?.role === 'admin'

      if (!user || (!user.organization?.id && !isAdmin)) {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Пользователь не привязан к организации. Обратитесь к администратору.',
          life: 5000
        })
        return null
      }

      let chatData: CreateChatData

      if (isAdmin && !user.organization?.id) {
        chatData = {
          client_name: contractor.name,
          client_phone: contractor.phone || '',
          client_email: contractor.email || '',
          message: `Начат чат с ${contractor.name}`
        }
      } else {
        chatData = {
          client_name: contractor.name,
          client_phone: contractor.phone || '',
          client_email: contractor.email || '',
          message: `Начат чат с ${contractor.name}`,
          organization_id: user.organization!.id
        } as CreateChatData & { organization_id: number }
      }

      const response = await chatApi.createChat(chatData)

      let newChat = null
      if (response.data) {
        newChat = response.data
      } else if (response.success && response.data) {
        newChat = response.data
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }

      if (newChat) {
        chats.value.unshift(newChat)
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: `Чат с ${contractor.name} создан`,
        life: 3000
      })

      // Дополнительно перезагружаем список чатов
      setTimeout(() => {
        loadChats()
      }, 1000)

      return newChat
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: err instanceof Error ? err.message : 'Ошибка создания чата',
        life: 5000
      })
      return null
    }
  }

  const updateChatUnreadCount = (chatId: number, unreadCount: number) => {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.unread_count = unreadCount
    }
  }

  const deleteChat = async (chatId: number) => {
    try {
      await chatApi.deleteChat(chatId)
      
      // Удаляем чат из локального списка
      const chatIndex = chats.value.findIndex(c => c.id === chatId)
      if (chatIndex >= 0) {
        chats.value.splice(chatIndex, 1)
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Чат удален',
        life: 3000
      })

      return true
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: err instanceof Error ? err.message : 'Ошибка удаления чата',
        life: 5000
      })
      return false
    }
  }

  return {
    chats,
    loading,
    error,
    searchQuery,
    filteredChats,
    loadChats,
    searchChats,
    createChat,
    updateChatUnreadCount,
    deleteChat
  }
}
