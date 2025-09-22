<template>
  <div :class="[
    'flex-1 flex-col transition-all duration-300',
    selectedChat ? 'flex' : 'hidden md:flex'
  ]">
    <!-- Заголовок чата -->
    <div v-if="selectedChat" class="p-4 border-b border-gray-200 dark:border-gray-700">
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
          <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <span class="text-white font-semibold text-sm">{{ selectedChat.client_name?.charAt(0) || '?' }}</span>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedChat.client_name || 'Неизвестный' }}</h3>
            <div class="flex items-center gap-2">
              <span :class="[
                'text-sm',
                getStatusColor(selectedChat.status) === 'green'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              ]">
                {{ getStatusText(selectedChat.status) }}
              </span>
              <i v-if="getStatusColor(selectedChat.status) === 'green'" class="pi pi-circle-fill text-green-500 text-xs"></i>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1 md:gap-2">
          <button class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="pi pi-phone text-sm md:text-base"></i>
          </button>
          <button class="hidden sm:block p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="pi pi-video text-sm md:text-base"></i>
          </button>
          <button class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="pi pi-ellipsis-v text-sm md:text-base"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Область сообщений -->
    <div
      v-if="selectedChat"
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      @scroll="$emit('scroll')"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        :data-message-id="message.id"
        :class="[
          'flex w-full',
          message.type === 'system' ? 'justify-center' :
          message.is_from_client ? 'justify-start' : 'justify-end'
        ]"
      >
        <!-- Сообщение клиента (слева) -->
        <div v-if="message.is_from_client" class="flex items-start gap-3 max-w-[70%]">
          <!-- Аватар клиента -->
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
            <span class="text-white font-semibold text-xs">{{ getClientInitial(message) }}</span>
          </div>

          <div class="flex flex-col">
            <!-- Имя клиента и время -->
            <div class="mb-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span class="font-medium">{{ getClientName(message) }}</span>
              <span>{{ formatTime(message.created_at) }}</span>
            </div>

            <!-- Сообщение клиента -->
            <div class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border dark:border-gray-600">
              <div v-if="message.type === 'text'" class="whitespace-pre-wrap break-words">{{ message.content }}</div>
              <div v-else-if="message.type === 'image'" class="text-sm text-gray-500">📷 Изображение</div>
              <div v-else-if="message.type === 'video'" class="text-sm text-gray-500">🎥 Видео</div>
              <div v-else-if="message.type === 'document'" class="text-sm text-gray-500">📄 Документ</div>
              <div v-else-if="message.type === 'audio'" class="text-sm text-gray-500">🎵 Аудио</div>
            </div>
          </div>
        </div>

        <!-- Системное сообщение (по центру) -->
        <div v-else-if="message.type === 'system'" class="flex justify-center">
          <div class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm max-w-md text-center shadow-sm">
            <div class="flex items-center gap-2 justify-center">
              <i class="pi pi-info-circle text-xs"></i>
              <span>{{ message.content }}</span>
              <span class="text-xs opacity-75">{{ formatTime(message.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Наше сообщение (справа) -->
        <div v-else class="flex items-start gap-3 max-w-[70%] flex-row-reverse">
          <!-- Аватар сотрудника -->
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
            <span class="text-white font-semibold text-xs">{{ getStaffInitial(message) }}</span>
          </div>

          <div class="flex flex-col items-end">
            <!-- Имя сотрудника и время -->
            <div class="mb-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>{{ formatTime(message.created_at) }}</span>
              <span class="font-medium">{{ getStaffName(message) }}</span>
            </div>

            <!-- Сообщение сотрудника -->
            <div class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm transition-colors">
              <div v-if="message.type === 'text'" class="whitespace-pre-wrap break-words">{{ message.content }}</div>
              <div v-else-if="message.type === 'image'" class="text-sm opacity-90">📷 Изображение</div>
              <div v-else-if="message.type === 'video'" class="text-sm opacity-90">🎥 Видео</div>
              <div v-else-if="message.type === 'document'" class="text-sm opacity-90">📄 Документ</div>
              <div v-else-if="message.type === 'audio'" class="text-sm opacity-90">🎵 Аудио</div>
            </div>

            <!-- Статус прочтения -->
            <div class="flex justify-end mt-1">
              <i v-if="message.is_read" class="pi pi-check-double text-blue-400 text-xs"></i>
              <i v-else class="pi pi-check text-gray-400 text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Поле ввода сообщения -->
    <div v-if="selectedChat" class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="flex items-center gap-3">
        <!-- Кнопка файлов -->
        <button class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="pi pi-paperclip text-lg"></i>
        </button>

        <!-- Поле ввода -->
        <div class="flex-1 relative">
          <textarea
            v-model="messageText"
            @keydown.enter.prevent="handleSendMessage"
            placeholder="Введите сообщение..."
            rows="1"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            style="max-height: 120px;"
          ></textarea>
        </div>

        <!-- Кнопка отправки -->
        <button
          @click="handleSendMessage"
          :disabled="!messageText.trim() || sendingMessage"
          class="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
        >
          <i v-if="sendingMessage" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Chat, Message } from '@/shared/lib/types'

interface Props {
  selectedChat: Chat | null
  messages: Message[]
  sendingMessage?: boolean
}

const props = defineProps<Props>()

const messageText = ref('')

// Функции для получения имен и инициалов
const getClientName = (message: Message) => {
  if (props.selectedChat?.messenger_phone) {
    return props.selectedChat.client_name || props.selectedChat.messenger_phone
  }
  return message.user?.name || 'Клиент'
}

const getClientInitial = (message: Message) => {
  const name = getClientName(message)
  return name.charAt(0).toUpperCase()
}

const getStaffName = (message: Message) => {
  if (message.user_id === 1) {
    return '🤖 Бот'
  }
  return message.user?.name || 'Сотрудник'
}

const getStaffInitial = (message: Message) => {
  if (message.user_id === 1) {
    return '🤖'
  }
  const name = message.user?.name || 'С'
  return name.charAt(0).toUpperCase()
}

// Функции для статуса и времени
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'green'
    case 'pending': return 'yellow'
    default: return 'gray'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Активен'
    case 'pending': return 'Ожидает'
    case 'closed': return 'Закрыт'
    default: return 'Неизвестно'
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Отправка сообщения
const handleSendMessage = () => {
  if (!messageText.value.trim() || props.sendingMessage) return

  // Эмитим событие отправки сообщения
  emit('sendMessage', messageText.value.trim())
  messageText.value = ''
}

const emit = defineEmits(['backToList', 'scroll', 'sendMessage'])
</script>
