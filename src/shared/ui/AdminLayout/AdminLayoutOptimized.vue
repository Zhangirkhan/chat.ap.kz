<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Mobile Overlay -->
    <div
      v-if="!sidebarCollapsed"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      :sidebar-collapsed="sidebarCollapsed"
      :open-groups="openGroups"
      @toggle-group="toggleGroup"
    />

    <!-- Main Content -->
    <div
      :class="[
        'flex-1 transition-all duration-300 chat-scrollbar',
        sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-72'
      ]"
    >
      <!-- Top Header -->
      <PageHeader
        :is-dark-mode="isDarkMode"
        :show-notifications="showNotifications"
        :unread-notifications-count="unreadNotificationsCount"
        :show-user-menu="showUserMenu"
        :user="user"
        @toggle-sidebar="toggleSidebar"
        @toggle-theme="toggleTheme"
        @toggle-notifications="toggleNotifications"
        @mark-as-read="markAsRead"
        @mark-all-as-read="markAllAsRead"
        @toggle-user-menu="toggleUserMenu"
        @go-to-profile="goToProfile"
        @handle-logout="handleLogout"
      >
        <template #title>
          <slot name="title"></slot>
        </template>
        <template #subtitle>
          <slot name="subtitle"></slot>
        </template>
      </PageHeader>

      <!-- Main Content Area -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/features/auth'
import { useSidebar } from '@/shared/composables/useSidebar'
import { useTheme } from '@/shared/composables/useTheme'
import { useNotifications } from '@/shared/composables/useNotifications'
import { useUserMenu } from '@/shared/composables/useUserMenu'
import Sidebar from './components/Sidebar.vue'
import PageHeader from './components/PageHeader.vue'

// Composables
const {
  sidebarCollapsed,
  openGroups,
  toggleSidebar,
  closeSidebar,
  toggleGroup
} = useSidebar()

const { isDarkMode, toggleTheme } = useTheme()

const {
  notifications,
  showNotifications,
  unreadNotificationsCount,
  toggleNotifications,
  markAsRead,
  markAllAsRead
} = useNotifications()

const {
  showUserMenu,
  toggleUserMenu,
  goToProfile,
  handleLogout
} = useUserMenu()

const authStore = useAuthStore()

const user = computed(() => authStore.user)

// Закрываем меню при клике вне его
const setupClickOutside = () => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.notifications-container')) {
      showNotifications.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)
  
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
}

onMounted(() => {
  const cleanup = setupClickOutside()
  onUnmounted(cleanup)
})
</script>

<style scoped>
/* Все стили теперь в Tailwind CSS */

/* Стили для скроллбара */
.chat-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.chat-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.chat-scrollbar::-webkit-scrollbar-track {
  background: #f7fafc;
}

.chat-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.chat-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}

/* Темная тема для скроллбара */
.dark .chat-scrollbar {
  scrollbar-color: #4a5568 #2d3748;
}

.dark .chat-scrollbar::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark .chat-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4a5568;
}

.dark .chat-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
</style>
