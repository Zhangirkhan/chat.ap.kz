import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { Chat, Message } from '@/shared/lib/types'

export function useChatNotifications() {
  const toast = useToast()
  const unreadUpdates = ref<Map<number, number>>(new Map())

  const showNewMessageNotification = (chat: Chat, message: Message, senderName?: string) => {
    const messageText = message.message || 'Файл'
    const displayName = senderName || 'Клиент'

    toast.add({
      severity: 'info',
      summary: 'Новое сообщение',
      detail: `${displayName}: ${messageText}`,
      life: 5000,
      group: 'main'
    })
  }

  const showUnreadNotification = (chatName: string, userName: string, messageContent: string) => {
    toast.add({
      severity: 'info',
      summary: chatName,
      detail: `${userName}: ${messageContent}`,
      life: 5000,
      closable: true,
      group: 'main'
    })
  }

  const updateUnreadCount = (chatId: number, count: number) => {
    unreadUpdates.value.set(chatId, count)
  }

  const getUnreadCount = (chatId: number): number => {
    return unreadUpdates.value.get(chatId) || 0
  }

  const clearUnreadCount = (chatId: number) => {
    unreadUpdates.value.delete(chatId)
  }

  const shouldShowNotification = (
    selectedChat: Chat | null,
    messageChatId: number,
    isFromClient: boolean
  ): boolean => {
    return (!selectedChat || selectedChat.id !== messageChatId) && isFromClient
  }

  return {
    unreadUpdates,
    showNewMessageNotification,
    showUnreadNotification,
    updateUnreadCount,
    getUnreadCount,
    clearUnreadCount,
    shouldShowNotification
  }
}
