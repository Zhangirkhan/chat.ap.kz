import { ref, computed } from 'vue'

export interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
  user_id?: number
}

export function useNotifications() {
  const notifications = ref<Notification[]>([])
  const showNotifications = ref(false)

  const unreadNotificationsCount = computed(() => {
    return notifications.value.filter(n => !n.is_read).length
  })

  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
  }

  const markAsRead = (notificationId: number) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.is_read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.is_read = true
    })
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      is_read: false,
      created_at: new Date().toISOString()
    }
    notifications.value.unshift(newNotification)
  }

  const removeNotification = (notificationId: number) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Только что'
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      info: 'pi pi-info-circle',
      success: 'pi pi-check-circle',
      warning: 'pi pi-exclamation-triangle',
      error: 'pi pi-times-circle'
    }
    return icons[type]
  }

  const getNotificationColor = (type: Notification['type']) => {
    const colors = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    }
    return colors[type]
  }

  return {
    notifications,
    showNotifications,
    unreadNotificationsCount,
    toggleNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications,
    formatTime,
    getNotificationIcon,
    getNotificationColor
  }
}
