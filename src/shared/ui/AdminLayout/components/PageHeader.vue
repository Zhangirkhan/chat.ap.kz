<template>
  <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div class="flex items-center gap-2 sm:gap-4">
        <Button
          icon="pi pi-bars"
          text
          rounded
          @click="$emit('toggleSidebar')"
          class="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        />
        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <h1 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
            <slot name="title"></slot>
          </h1>
          <p v-if="$slots.subtitle" class="text-sm sm:text-base text-gray-600 dark:text-gray-300 hidden sm:block">
            <slot name="subtitle"></slot>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Переключатель темы -->
        <button
          @click="$emit('toggleTheme')"
          class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :title="isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'"
        >
          <i v-if="isDarkMode" class="pi pi-sun text-lg"></i>
          <i v-else class="pi pi-moon text-lg"></i>
        </button>

        <!-- Уведомления -->
        <NotificationsButton
          :show-notifications="showNotifications"
          :unread-count="unreadNotificationsCount"
          @toggle="$emit('toggleNotifications')"
          @mark-as-read="$emit('markAsRead', $event)"
          @mark-all-read="$emit('markAllAsRead')"
        />

        <!-- Меню пользователя -->
        <UserMenuButton
          :show-user-menu="showUserMenu"
          :user="user"
          @toggle="$emit('toggleUserMenu')"
          @profile="$emit('goToProfile')"
          @logout="$emit('handleLogout')"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { User } from '@/shared/lib/types'

interface Props {
  isDarkMode: boolean
  showNotifications: boolean
  unreadNotificationsCount: number
  showUserMenu: boolean
  user: User | null
}

defineProps<Props>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleTheme: []
  toggleNotifications: []
  markAsRead: [id: number]
  markAllAsRead: []
  toggleUserMenu: []
  goToProfile: []
  handleLogout: []
}>()
</script>
