<template>
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Кнопка "Назад" для мобильных -->
        <button
          @click="$emit('backToList')"
          class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Назад к списку чатов"
        >
          <i class="pi pi-arrow-left text-lg"></i>
        </button>
        
        <!-- Аватар клиента -->
        <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <span class="text-white font-semibold text-sm">{{ clientInitial }}</span>
        </div>
        
        <!-- Информация о клиенте -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedChat.client_name || 'Неизвестный' }}</h3>
          <div class="flex items-center gap-2">
            <span :class="statusClasses">
              {{ statusText }}
            </span>
            <i v-if="statusColor === 'green'" class="pi pi-circle-fill text-green-500 text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex items-center gap-1 md:gap-2">
        <button class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="pi pi-phone text-sm md:text-base"></i>
        </button>
        <button
          @click="$emit('closeChat')"
          class="hidden sm:block p-2 text-red-500 hover:text-red-700 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          title="Закрыть чат"
        >
          <i class="pi pi-times text-sm md:text-base"></i>
        </button>
        <button class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="pi pi-ellipsis-v text-sm md:text-base"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Chat } from '@/shared/lib/types'
import { useMessageStatus } from '@/shared/composables/useMessageStatus'

interface Props {
  selectedChat: Chat
}

const props = defineProps<Props>()

const emit = defineEmits<{
  backToList: []
  closeChat: []
}>()

const { getStatusColor, getStatusText } = useMessageStatus()

const clientInitial = computed(() => 
  props.selectedChat.client_name?.charAt(0) || '?'
)

const statusColor = computed(() => 
  getStatusColor(props.selectedChat.status)
)

const statusText = computed(() => 
  getStatusText(props.selectedChat.status)
)

const statusClasses = computed(() => [
  'text-sm',
  statusColor.value === 'green'
    ? 'text-green-600 dark:text-green-400'
    : 'text-gray-500 dark:text-gray-400'
])
</script>
