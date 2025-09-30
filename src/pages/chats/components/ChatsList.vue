<template>
  <div :class="[
    'border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
    selectedChat
      ? 'hidden md:flex md:w-1/3 lg:w-1/4 xl:w-1/3'
      : 'w-full md:w-1/3 lg:w-1/4 xl:w-1/3'
  ]">
    <!-- Заголовок левой панели -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Чаты</h2>
        <div class="flex items-center gap-1 md:gap-2">
          <!-- Временно скрыты тестовые кнопки -->
          <!--
          <button
            @click="$emit('showTestData')"
            class="hidden md:flex w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg items-center justify-center transition-colors duration-200"
            title="Добавить тестовые контрагенты"
          >
            <i class="pi pi-database text-sm"></i>
          </button>
          <button
            @click="$emit('showTestChats')"
            class="hidden sm:flex w-8 h-8 bg-purple-500 hover:bg-purple-600 text-white rounded-lg items-center justify-center transition-colors duration-200"
            title="Добавить тестовые чаты"
          >
            <i class="pi pi-comments text-sm"></i>
          </button>
          -->
          <button
            @click="$emit('startNewChat')"
            class="w-8 h-8 md:w-8 md:h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
            title="Новый чат"
          >
            <i class="pi pi-plus text-sm"></i>
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Активные диалоги</p>
    </div>

    <!-- Поиск -->
    <div class="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="relative">
        <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск чатов..."
          class="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <!-- Индикатор результатов поиска -->
        <div v-if="searchQuery && filteredChats.length !== chats.length" class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
            {{ filteredChats.length }}{{ filteredChats.length >= 50 ? '+' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="loading" class="p-4 text-center">
      <div class="flex items-center justify-center gap-2">
        <i class="pi pi-spin pi-spinner text-blue-500"></i>
        <span class="text-gray-600 dark:text-gray-400">Загрузка чатов...</span>
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg m-4">
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-triangle text-red-500"></i>
        <span class="text-red-700 dark:text-red-300 text-sm">{{ error }}</span>
      </div>
    </div>

    <!-- Список чатов -->
    <div v-if="!loading" class="flex-1 overflow-y-auto chat-scrollbar hover-grow-scroll">
      <div v-if="chats.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
        <i class="pi pi-comments text-2xl mb-2"></i>
        <p>Чаты не найдены</p>
        <p class="text-sm">Создайте новый чат, нажав кнопку "+"</p>
      </div>

      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        @click="$emit('selectChat', chat)"
        :class="[
          'p-3 md:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200',
          selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
        ]"
      >
        <div class="flex items-start gap-2 md:gap-3">
          <!-- Аватар -->
          <div class="flex-shrink-0">
            <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span class="text-white font-semibold text-xs md:text-sm">{{ getClientInitial(getClientDisplayName(chat)) }}</span>
            </div>
          </div>

          <!-- Информация о чате -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ getClientDisplayName(chat) }}
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTime(chat.last_message?.created_at || chat.updated_at) }}
              </span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-300 truncate mb-1 emoji-message">
              <span v-if="getMessageTypeIndicator(chat.last_message)" class="inline-flex items-center gap-1">
                <i :class="getMessageTypeIcon(chat.last_message)" class="text-xs"></i>
                <span class="font-medium">{{ getMessageTypeIndicator(chat.last_message) }}</span>
                <span v-if="chat.last_message?.message" class="mx-1">•</span>
              </span>
              <span v-html="formatMessageWithEmoji(chat.last_message?.message || 'Нет сообщений')"></span>
            </p>
            
            <!-- Дополнительная информация о клиенте -->
            <div v-if="chat.client_phone || chat.client?.phone" class="text-xs text-gray-500 dark:text-gray-400 mb-1">
              📞 {{ chat.client?.phone || chat.client_phone }}
            </div>

            <div class="flex items-center justify-end">
              <div class="flex items-center gap-1">
                <!-- Индикатор непрочитанных сообщений -->
                <span
                  v-if="chat.unread_count && chat.unread_count > 0"
                  class="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-medium"
                >
                  {{ chat.unread_count > 99 ? '99+' : chat.unread_count }}
                </span>
                
                <!-- Кнопка удаления чата -->
                <button
                  @click.stop="$emit('deleteChat', chat.id)"
                  class="w-6 h-6 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full flex items-center justify-center transition-colors duration-200"
                  title="Удалить чат"
                >
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Chat } from '@/shared/lib/types'
import { useChatUtils } from '../composables/useChatUtils'

interface Props {
  chats: Chat[]
  filteredChats: Chat[]
  loading: boolean
  error: string | null
  selectedChat: Chat | null
}

interface Emits {
  (e: 'selectChat', chat: Chat): void
  (e: 'startNewChat'): void
  (e: 'showTestData'): void
  (e: 'showTestChats'): void
  (e: 'deleteChat', chatId: number): void
  (e: 'update:searchQuery', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const {
  formatTime,
  getStatusText,
  getStatusColor,
  formatMessageWithEmoji,
  getMessageTypeIndicator,
  getMessageTypeIcon
} = useChatUtils()

const searchQuery = defineModel<string>('searchQuery')

// Computed для проверки режима разработки
const isDev = computed(() => import.meta.env.DEV)

// Функция для получения отображаемого имени клиента
const getClientDisplayName = (chat: Chat) => {
  // Если есть имя клиента в объекте client, показываем его
  if (chat.client?.name && chat.client.name.trim()) {
    return chat.client.name
  }
  
  // Если есть имя клиента в старом формате, показываем его
  if (chat.client_name && chat.client_name.trim()) {
    return chat.client_name
  }
  
  // Если есть заголовок чата, показываем его
  if (chat.title && chat.title.trim()) {
    return chat.title
  }
  
  // Если нет имени, но есть номер телефона в объекте client, показываем его
  if (chat.client?.phone && chat.client.phone.trim()) {
    return chat.client.phone
  }
  
  // Если нет имени, но есть номер телефона в старом формате, показываем его
  if (chat.client_phone && chat.client_phone.trim()) {
    return chat.client_phone
  }
  
  // Если есть телефон мессенджера, показываем его
  if (chat.messenger_phone && chat.messenger_phone.trim()) {
    return chat.messenger_phone
  }
  
  // Если есть email клиента, показываем его
  if (chat.client?.email && chat.client.email.trim()) {
    return chat.client.email
  }
  
  if (chat.client_email && chat.client_email.trim()) {
    return chat.client_email
  }
  
  // Если нет ни имени, ни телефона, ни email, показываем ID чата
  return `Чат #${chat.id}`
}

// Функция для получения инициалов клиента
const getClientInitial = (clientName: string) => {
  if (!clientName) return '?'

  // Если это номер телефона, берем последнюю цифру
  if (/^\+?[0-9]+$/.test(clientName)) {
    return clientName.slice(-1)
  }

  // Если это email, берем первую букву до @
  if (clientName.includes('@')) {
    const emailName = clientName.split('@')[0]
    return emailName.charAt(0).toUpperCase()
  }

  // Если это имя, берем первую букву
  return clientName.charAt(0).toUpperCase()
}
</script>

<style scoped>
.emoji-message {
  line-height: 1.5;
}

.emoji-message :deep(.emoji-large) {
  font-size: 1.4em;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  margin: 0 1px;
}
</style>
