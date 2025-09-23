<template>
  <div class="relative user-menu-container">
    <button
      @click="$emit('toggle')"
      class="flex items-center gap-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <span class="text-white text-sm font-medium">
          {{ userInitials }}
        </span>
      </div>
      <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ user?.name || 'Пользователь' }}
      </span>
      <i class="pi pi-chevron-down text-xs"></i>
    </button>

    <!-- Выпадающее меню пользователя -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showUserMenu"
        class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      >
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ userInitials }}
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user?.name || 'Пользователь' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ user?.email || 'email@example.com' }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="py-1">
          <button
            @click="$emit('profile')"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
          >
            <i class="pi pi-user text-gray-400"></i>
            Профиль
          </button>
          
          <button
            @click="$emit('settings')"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
          >
            <i class="pi pi-cog text-gray-400"></i>
            Настройки
          </button>
          
          <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          
          <button
            @click="$emit('logout')"
            class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-3"
          >
            <i class="pi pi-sign-out text-red-500"></i>
            Выйти
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/shared/lib/types'

interface Props {
  showUserMenu: boolean
  user: User | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: []
  profile: []
  settings: []
  logout: []
}>()

const userInitials = computed(() => {
  if (!props.user?.name) return 'U'
  return props.user.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>
