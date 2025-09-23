<template>
  <div class="relative notifications-container">
    <button
      @click="$emit('toggle')"
      class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
      title="Уведомления"
    >
      <i class="pi pi-bell text-lg"></i>
      <!-- Индикатор новых уведомлений -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Выпадающее меню уведомлений -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showNotifications"
        class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      >
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Уведомления</h3>
            <button
              @click="$emit('markAllRead')"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Отметить все как прочитанные
            </button>
          </div>
        </div>
        
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
            Нет уведомлений
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              @click="$emit('markAsRead', notification.id)"
            >
              <div class="flex items-start gap-3">
                <i :class="[
                  'mt-1',
                  getNotificationIcon(notification.type),
                  getNotificationColor(notification.type)
                ]"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {{ formatTime(notification.created_at) }}
                  </p>
                </div>
                <div v-if="!notification.is_read" class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="$emit('viewAll')"
            class="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Посмотреть все уведомления
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '@/shared/composables/useNotifications'

interface Props {
  showNotifications: boolean
  unreadCount: number
  notifications: Notification[]
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
  markAsRead: [id: number]
  markAllRead: []
  viewAll: []
}>()

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

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Только что'
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>
