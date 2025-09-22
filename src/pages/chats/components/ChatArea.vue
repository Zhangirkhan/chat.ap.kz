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
          <button
            @click="handleCloseChat"
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

    <!-- Область сообщений -->
    <div
      v-if="selectedChat"
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      @scroll="$emit('scroll')"
    >
      <!-- Отладочная информация -->
      <div v-if="messages.length === 0" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">
          <i class="pi pi-comments text-3xl mb-2"></i>
          <p>Сообщений нет</p>
          <p class="text-sm">Начните диалог с клиентом</p>
        </div>
      </div>

      <!-- Отладка -->
      <div v-if="messages.length > 0" class="text-xs text-gray-400 text-center mb-4">
        Сообщений: {{ messages.length }}
      </div>
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
              <!-- Текстовое сообщение -->
              <div v-if="message.type === 'text'" class="whitespace-pre-wrap break-words">{{ message.message }}</div>

              <!-- Изображение -->
              <div v-else-if="message.type === 'image' && message.file_path" class="mb-2">
                <img
                  :src="message.file_path"
                  :alt="message.file_name || 'Изображение'"
                  class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  style="max-height: 250px; width: auto; object-fit: contain;"
                  @click="$emit('openImagePreview', message.file_path)"
                />
                <p v-if="message.file_name" class="text-xs text-gray-500 mt-1">{{ message.file_name }}</p>
              </div>

              <!-- Видео -->
              <div v-else-if="message.type === 'video' && message.file_path" class="mb-2">
                <video
                  :src="message.file_path"
                  controls
                  class="max-w-full h-auto rounded-lg"
                  style="max-height: 300px; object-fit: contain;"
                >
                  Ваш браузер не поддерживает видео.
                </video>
                <p v-if="message.file_name" class="text-xs text-gray-500 mt-1">{{ message.file_name }}</p>
              </div>

              <!-- Аудио (только отображение) -->
              <div v-else-if="message.type === 'file' && message.file_name && /\.(mp3|wav|ogg|m4a)$/i.test(message.file_name) && message.file_path" class="mb-2">
                <div class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg mb-2">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <i class="pi pi-volume-up text-green-600 dark:text-green-400"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium">{{ message.file_name || 'Аудио' }}</p>
                    <p v-if="message.file_size" class="text-xs text-gray-500">{{ formatFileSize(message.file_size) }}</p>
                  </div>
                </div>
                <audio controls class="w-full">
                  <source :src="message.file_path" />
                  Ваш браузер не поддерживает аудио.
                </audio>
              </div>

              <!-- Неизвестный тип -->
              <div v-else class="text-sm text-gray-500">
                {{ message.type === 'image' ? '📷 Изображение' :
                   message.type === 'video' ? '🎥 Видео' :
                   message.type === 'file' ? '📄 Документ' :
                   '📎 Файл' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Системное сообщение (по центру) -->
        <div v-else-if="message.type === 'system'" class="flex justify-center">
          <div class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm max-w-md shadow-sm border border-green-200 dark:border-green-700">
            <!-- Заголовок с именем и временем -->
            <div class="flex items-center justify-between mb-2 text-xs">
              <span class="font-medium">Система</span>
              <span class="opacity-75">{{ formatTime(message.created_at) }}</span>
            </div>
            <!-- Текст сообщения выровнен слева -->
            <div class="text-left leading-relaxed">
              {{ message.message }}
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
              <!-- Текстовое сообщение -->
              <div v-if="message.type === 'text'" class="whitespace-pre-wrap break-words">{{ message.message }}</div>

              <!-- Изображение -->
              <div v-else-if="message.type === 'image' && message.file_path" class="mb-2">
                <img
                  :src="message.file_path"
                  :alt="message.file_name || 'Изображение'"
                  class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  style="max-height: 250px; width: auto; object-fit: contain;"
                  @click="$emit('openImagePreview', message.file_path)"
                />
                <p v-if="message.file_name" class="text-xs text-white opacity-75 mt-1">{{ message.file_name }}</p>
              </div>

              <!-- Видео -->
              <div v-else-if="message.type === 'video' && message.file_path" class="mb-2">
                <video
                  :src="message.file_path"
                  controls
                  class="max-w-full h-auto rounded-lg"
                  style="max-height: 300px; object-fit: contain;"
                >
                  Ваш браузер не поддерживает видео.
                </video>
                <p v-if="message.file_name" class="text-xs text-white opacity-75 mt-1">{{ message.file_name }}</p>
              </div>

              <!-- Документ -->
              <div v-else-if="message.type === 'file' && message.file_path" class="flex items-center gap-3 p-2 bg-blue-600 rounded-lg">
                <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i class="pi pi-file text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">{{ message.file_name || 'Документ' }}</p>
                  <p v-if="message.file_size" class="text-xs text-white opacity-75">{{ formatFileSize(message.file_size) }}</p>
                </div>
                <a
                  :href="message.file_path"
                  :download="message.file_name"
                  class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title="Скачать файл"
                >
                  <i class="pi pi-download text-sm"></i>
                </a>
              </div>

              <!-- Аудио исходящее (только отображение) -->
              <div v-else-if="message.type === 'audio'" class="mb-2">
                <div class="flex items-center gap-3 p-2 bg-blue-600 rounded-lg mb-2">
                  <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i class="pi pi-volume-up text-white"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white">{{ message.file_name || 'Аудио' }}</p>
                    <p v-if="message.file_size" class="text-xs text-white opacity-75">{{ formatFileSize(message.file_size) }}</p>
                  </div>
                </div>
                <audio controls class="w-full">
                  <source :src="message.file_path" />
                  Ваш браузер не поддерживает аудио.
                </audio>
              </div>

              <!-- Неизвестный тип -->
              <div v-else class="text-sm opacity-90">
                {{ message.type === 'image' ? '📷 Изображение' :
                   message.type === 'video' ? '🎥 Видео' :
                   message.type === 'file' ? '📄 Документ' :
                   '📎 Файл' }}
              </div>
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
      <div class="flex items-end gap-3">
        <!-- Меню загрузки файлов -->
        <div class="flex-shrink-0">
          <FileUploadMenu
            @file-selected="$emit('fileSelected', $event)"
            @file-error="$emit('fileError', $event)"
          />
        </div>

        <!-- Поле ввода с эмодзи -->
        <div class="flex-1 relative">
          <div class="flex items-end border border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <!-- Textarea для сообщения -->
            <textarea
              :value="props.newMessage || messageText"
              @input="handleInput"
              ref="messageInput"
              @keydown.enter.prevent="handleSendMessage"
              placeholder="Введите сообщение..."
              rows="1"
              class="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none bg-transparent dark:text-white resize-none"
              style="max-height: 120px; min-height: 48px;"
            ></textarea>

            <!-- Кнопка эмодзи -->
            <div class="flex-shrink-0 p-2">
              <EmojiPicker @emoji-selected="$emit('emojiSelected', $event)" />
            </div>
          </div>
        </div>

        <!-- Кнопка отправки -->
        <div class="flex-shrink-0">
          <button
            @click="handleSendMessage"
            :disabled="!(props.newMessage || messageText).trim() || sendingMessage"
            class="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
          >
            <i v-if="sendingMessage" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-send text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Индикатор загрузки файла -->
      <div v-if="uploadingFile" class="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <i class="pi pi-spin pi-spinner"></i>
        <span>Загрузка файла...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import type { Chat, Message } from '@/shared/lib/types'
import FileUploadMenu from './FileUploadMenu.vue'
import EmojiPicker from './EmojiPicker.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { chatApi } from '@/entities/chat/api/chatApi'

interface Props {
  selectedChat: Chat | null
  messages: Message[]
  newMessage?: string
  sendingMessage?: boolean
  uploadingFile?: boolean
}

const props = defineProps<Props>()

const messageText = ref('')
const messageInput = ref<HTMLTextAreaElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

// Эмитим событие когда контейнер сообщений готов
onMounted(() => {
  nextTick(() => {
    if (messagesContainer.value) {
      emit('containerReady', messagesContainer.value)
    }
  })
})

// Следим за изменением selectedChat и эмитим containerReady
watch(() => props.selectedChat, (newChat) => {
  if (newChat) {
    nextTick(() => {
      if (messagesContainer.value) {
        emit('containerReady', messagesContainer.value)
      }
    })
  }
}, { immediate: true })
const confirm = useConfirm()
const toast = useToast()

// Функции для получения имен и инициалов
const getClientName = (message: Message) => {
  if (props.selectedChat?.client_name) {
    return props.selectedChat.client_name
  }
  return message.user?.name || 'Клиент'
}

const getClientInitial = (message: Message) => {
  const name = getClientName(message)
  return name.charAt(0).toUpperCase()
}

const getStaffName = (message: Message) => {
  if ((message as unknown as Record<string, unknown>).user_id === 1) {
    return '🤖 Бот'
  }
  return message.user?.name || 'Сотрудник'
}

const getStaffInitial = (message: Message) => {
  if ((message as unknown as Record<string, unknown>).user_id === 1) {
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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Обработка ввода текста
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = target.value

  // Обновляем локальную переменную
  messageText.value = value

  // Эмитим обновление для v-model
  emit('update:newMessage', value)

  // Автоматически изменяем высоту
  adjustTextareaHeight()
}

// Автоматическое изменение высоты textarea
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
      messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
    }
  })
}

// Отправка сообщения
const handleSendMessage = () => {
  const currentMessage = props.newMessage || messageText.value
  if (!currentMessage.trim() || props.sendingMessage) return

  // Эмитим событие отправки сообщения
  emit('sendMessage')

  // Очищаем поле ввода
  messageText.value = ''
  emit('update:newMessage', '')

  // Сбрасываем высоту textarea
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = '48px'
    }
  })
}

// Закрытие чата с подтверждением
const handleCloseChat = () => {
  if (!props.selectedChat) return

  confirm.require({
    message: 'Вы уверены, что хотите закрыть этот чат?',
    header: 'Подтверждение закрытия',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Закрыть чат',
    accept: async () => {
      try {
        const response = await chatApi.closeMessengerChat(props.selectedChat!.id)

        if (response.success) {
          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Чат закрыт. Клиенту отправлено уведомление.',
            life: 5000
          })

          // Эмитим событие о закрытии чата
          emit('chatClosed', props.selectedChat!.id)
        }
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось закрыть чат',
          life: 5000
        })
      }
    }
  })
}

const emit = defineEmits([
  'backToList',
  'scroll',
  'sendMessage',
  'fileSelected',
  'fileError',
  'emojiSelected',
  'openImagePreview',
  'update:newMessage',
  'chatClosed',
  'containerReady'
])
</script>
