<template>
  <AdminLayout>
    <template #title>Чаты</template>
    <template #subtitle>Корпоративные чаты и сообщения</template>

    <div class="h-[calc(100vh-120px)] md:h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="flex h-full">
        <!-- Левая панель - Список чатов -->
        <ChatsList
          :chats="chats"
          :filtered-chats="filteredChats"
          :loading="loading"
          :error="error"
          :selected-chat="selectedChat"
          v-model:search-query="searchQuery"
          @select-chat="selectChat"
          @start-new-chat="startNewChat"
          @show-test-data="showTestDataDialog = true"
          @show-test-chats="showTestChatsDialog = true"
        />

        <!-- Правая панель - Область чата -->
        <ChatArea
          :selected-chat="selectedChat"
          :messages="messages"
          v-model:new-message="newMessage"
          :sending-message="sendingMessage"
          :uploading-file="uploadingFile"
          @back-to-list="selectedChat = null"
          @scroll="handleScroll"
          @open-image-preview="handleImagePreview"
          @file-selected="handleFileUpload"
          @file-error="handleFileError"
          @emoji-selected="handleEmojiSelectWrapper"
          @send-message="sendMessage"
          @container-ready="handleContainerReady"
          @chat-closed="handleChatClosed"
        />
      </div>
    </div>

    <!-- Модальное окно выбора контрагента -->
    <SelectContractorDialog
      :show="showContractorDialog"
      @close="closeContractorDialog"
      @select="handleContractorSelect"
      @create-new="handleCreateNewContractor"
    />

    <!-- Предварительный просмотр файлов -->
    <FilePreview
      v-if="showPreview"
      ref="filePreviewRef"
      :key="`file-preview-${Date.now()}`"
      :is-open="true"
      :files="previewFiles"
      :file-type="'mixed'"
      @close="handleFileCancel"
      @sendFiles="handleFileSendWrapper"
      @send-files="handleFileSendWrapper"
    />

    <!-- Просмотрщик изображений -->
    <ImageViewer
      :is-open="showImageViewer"
      :images="viewerImages"
      :initial-index="viewerInitialIndex"
      @close="closeImageViewer"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { useChatSSE } from '@/entities/chat/model/useChatSSE'
import { useUnreadMessages } from '@/entities/chat/model/useUnreadMessages'
import type { Chat, Message } from '@/shared/lib/types'
import type { Contractor } from '@/shared/api/contractors'
import { useToast } from 'primevue/usetoast'

// Компоненты
import ChatsList from './components/ChatsList.vue'
import ChatArea from './components/ChatArea.vue'
import SelectContractorDialog from './components/SelectContractorDialog.vue'
// import AddTestDataDialog from './components/AddTestDataDialog.vue'

import FilePreview from './components/FilePreview.vue'
import ImageViewer from './components/ImageViewer.vue'

// Композаблы
import { useChats } from './composables/useChats'
import { useMessages } from './composables/useMessages'
import { useFileUpload } from './composables/useFileUpload'
import { useChatUtils } from './composables/useChatUtils'

const toast = useToast()

// Композаблы
const {
  chats,
  loading,
  error,
  searchQuery,
  filteredChats,
  loadChats,
  searchChats,
  createChat
} = useChats()

// SSE для обновления списка чатов в реальном времени
const sseForChats = ref<EventSource | null>(null)

// Композаблы для сообщений
const {
  messages,
  sendingMessage,
  newMessage,
  loadChatMessages,
  sendMessage: sendMessageAction,
  scrollToBottom,
  handleScroll,
  setMessagesContainer
} = useMessages()

// Композаблы для загрузки файлов
const {
  uploadingFile,
  previewFiles,
  showPreview,
  handleFileUpload,
  handleFileError,
  handleFileSend,
  handleFileCancel
} = useFileUpload()

const {
  showImageViewer,
  viewerImages,
  viewerInitialIndex,
  openImagePreview,
  closeImageViewer,
  handleEmojiSelect
} = useChatUtils()

// Локальное состояние
const selectedChat = ref<Chat | null>(null)
const messageInput = ref<HTMLTextAreaElement | null>(null)
const filePreviewRef = ref<InstanceType<typeof FilePreview> | null>(null)

// SSE для реального времени
const {
  connect: sseConnect,
  disconnect: sseDisconnect,
  onNewMessage: sseOnNewMessage
} = useChatSSE()

// Система непрочитанных сообщений
const {
  startPolling: startUnreadPolling,
  stopPolling: stopUnreadPolling,
  onUnreadUpdate: onUnreadUpdate,
  markChatAsRead: markUnreadAsRead
} = useUnreadMessages()

// Диалоги
const showContractorDialog = ref(false)
const showTestDataDialog = ref(false)
const showTestChatsDialog = ref(false)

const selectChat = async (chat: Chat) => {
  selectedChat.value = chat
  await loadChatMessages(chat.id)
  await sseConnect(chat.id)

  // Принудительный скролл вниз с задержкой для рендеринга сообщений
  // Используем несколько попыток скролла для надежности
  setTimeout(() => {
    scrollToBottom(true)
  }, 100)

  setTimeout(() => {
    scrollToBottom(true)
  }, 300)

  setTimeout(() => {
    scrollToBottom(true)
  }, 500)

  // Сбрасываем счетчик непрочитанных для выбранного чата
  const chatInList = chats.value.find(c => c.id === chat.id)
  if (chatInList && chatInList.unread_count > 0) {
    chatInList.unread_count = 0
  }

  markUnreadAsRead(chat.id)
}

const sendMessage = async () => {
  if (!selectedChat.value) return
  await sendMessageAction(selectedChat.value.id)
}


const startNewChat = () => {
  showContractorDialog.value = true
}

const closeContractorDialog = () => {
  showContractorDialog.value = false
}

const handleContractorSelect = async (contractor: Contractor) => {
  const newChat = await createChat(contractor)
    if (newChat) {
      selectedChat.value = newChat
  }
    closeContractorDialog()
}

const handleCreateNewContractor = () => {
  window.open('/contractors', '_blank')
  closeContractorDialog()
}

// const closeTestDataDialog = () => {
//   showTestDataDialog.value = false
// }

// const handleTestDataCreated = () => {
//   closeTestDataDialog()
// }

// const closeTestChatsDialog = () => {
//   showTestChatsDialog.value = false
// }

// const handleTestChatsCreated = () => {
//   closeTestChatsDialog()
//   setTimeout(() => {
//     loadChats()
//   }, 1000)
// }

// Обработчики файлов с использованием композабла
const handleFileSendWrapper = async (files: Array<{preview?: string, caption?: string, id?: string} & File>, fileType: string) => {
  if (!selectedChat.value) {
    return
  }

  // Определяем тип чата (пока что проверяем наличие номера телефона для Wazzup24)
  const chatType = selectedChat.value.client_phone ? 'wazzup' : 'regular'

  await handleFileSend(files, fileType, selectedChat.value.id, () => {
    loadChatMessages(selectedChat.value!.id)
    // Превью закроется автоматически через FilePreview.closePreview()
    // Скролл вниз после отправки файла
  setTimeout(() => {
      scrollToBottom()
    }, 200)
  }, chatType)

  // Сигнализируем об успешной отправке (для отключения fallback в FilePreview)
  ;(window as unknown as { fileSendCompleted: boolean }).fileSendCompleted = true
}

const handleEmojiSelectWrapper = (emoji: string) => {
  handleEmojiSelect(emoji, messageInput.value, newMessage)
}

const handleImagePreview = (imagePath: string) => {
  openImagePreview(imagePath, messages.value)
}

const handleContainerReady = (container: HTMLElement) => {
  setMessagesContainer(container)
}

const handleChatClosed = (chatId: number) => {

  // Обновляем статус чата в списке
  const chatInList = chats.value.find(c => c.id === chatId)
  if (chatInList) {
    chatInList.status = 'closed'
  }

  // Если это текущий открытый чат, возвращаемся к списку
  if (selectedChat.value && selectedChat.value.id === chatId) {
    selectedChat.value = null
  }

  // Перезагружаем список чатов для актуальной информации
  loadChats()
}

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.length >= 3) { // Увеличили до 3 символов
      // Выполняем поиск через API
      searchChats()
    } else if (searchQuery.value.length === 0) {
      // Загружаем все чаты
      loadChats()
    }
    // Если 1-2 символа - используем только локальную фильтрацию
  }, 800) // Увеличили задержку до 800ms
})



// Отслеживаем изменения showPreview для отладки
watch(showPreview, (newValue) => {
  if (newValue) {
  }
})

onMounted(async () => {
  // Добавляем функцию в window для тестирования
  ;(window as unknown as { testHandleFileSend: typeof handleFileSendWrapper }).testHandleFileSend = handleFileSendWrapper
  loadChats()

  // Подключаемся к SSE для обновления списка чатов в реальном времени
  setupChatListSSE()

  // Запускаем polling для непрочитанных сообщений
  startUnreadPolling()

  // Настраиваем обработчик обновлений непрочитанных
  onUnreadUpdate((updates) => {
    updates.forEach(update => {
      // Обновляем счетчик в списке чатов
      const chatInList = chats.value.find(c => c.id === update.chat_id)
      if (chatInList) {
        chatInList.unread_count = update.unread_count

        // Обновляем последнее сообщение если есть
        if (update.last_message) {
          chatInList.last_message = {
            id: update.last_message.id,
            message: update.last_message.content,
            type: 'text' as const,
            created_at: update.last_message.created_at,
            user: {
              id: update.last_message.user.id,
              name: update.last_message.user.name,
              email: '',
              role: 'user' as const,
              permissions: [],
              roles: [],
              organization_id: undefined,
              phone: undefined,
              position: undefined,
              created_at: '',
              updated_at: '',
              status: 'active'
            },
            is_from_client: true,
            is_read: false
          }
          chatInList.updated_at = update.last_message.created_at
        }

        // Показываем уведомление если есть непрочитанные и чат не открыт
        if (update.unread_count > 0 &&
            (!selectedChat.value || selectedChat.value.id !== update.chat_id) &&
            update.last_message?.user?.name) {
          toast.add({
            severity: 'info',
            summary: chatInList.client_name,
            detail: `${update.last_message.user.name}: ${update.last_message.content}`,
            life: 5000,
            closable: true,
            group: 'main'
          })
        }
      }
    })
  })

  // Настраиваем обработчик новых сообщений SSE для открытого чата
  sseOnNewMessage((message: Message) => {
    // Проверяем, нет ли уже такого сообщения (избегаем дублирования)
    const existingMessage = messages.value.find((m: Message) => m.id === message.id)
    if (existingMessage) {
      return
    }

    // Добавляем новое сообщение в список текущего чата
    messages.value.push(message)

    // Прокручиваем к новому сообщению
    scrollToBottom()

    // Если это сообщение от клиента, не увеличиваем unread_count для открытого чата
    // так как пользователь видит сообщение
    if (selectedChat.value) {
      selectedChat.value.last_message = message
      selectedChat.value.updated_at = message.created_at

      // Обновляем в списке чатов (без увеличения unread_count для открытого чата)
      const chatInList = chats.value.find(c => c.id === selectedChat.value?.id)
      if (chatInList) {
        chatInList.last_message = message
        chatInList.updated_at = message.created_at
        // НЕ увеличиваем unread_count так как чат открыт
      }
    }
  })
})

// Функция для настройки SSE подключения для обновления списка чатов
const setupChatListSSE = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    // Создаем SSE соединение для получения обновлений списка чатов
    const url = `https://back-erp.ap.kz/api/chats/stream?token=${encodeURIComponent(token)}`
    sseForChats.value = new EventSource(url, {
      withCredentials: true
    })

    sseForChats.value.onopen = () => {
    }

    sseForChats.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case 'chat_created':
          case 'chat_updated':
            handleChatUpdate(data.chat)
            break
          case 'new_message':
            handleNewMessageForList(data)
            break
          case 'chat_list_refresh':
            // Полное обновление списка чатов
            loadChats()
            break
          default:
        }
      } catch {
        // Ошибка парсинга SSE сообщения
      }
    }

    sseForChats.value.onerror = () => {
      // Переподключение через 5 секунд
      setTimeout(() => {
        if (!sseForChats.value || sseForChats.value.readyState === EventSource.CLOSED) {
          setupChatListSSE()
        }
      }, 5000)
    }

  } catch {
    // Ошибка подключения SSE
  }
}

// Обработчик обновления чата
const handleChatUpdate = (updatedChat: Chat) => {

  // Обновляем чат в локальном списке
  const chatIndex = chats.value.findIndex(c => c.id === updatedChat.id)
  if (chatIndex >= 0) {
    chats.value[chatIndex] = updatedChat
    // Перемещаем обновленный чат в начало списка
    if (chatIndex > 0) {
      const chat = chats.value.splice(chatIndex, 1)[0]
      chats.value.unshift(chat)
    }
  } else {
    // Новый чат - добавляем в начало списка
    chats.value.unshift(updatedChat)
  }
}

// Обработчик нового сообщения для обновления списка чатов
const handleNewMessageForList = (messageData: { chat_id: number; message: Message; sender_name?: string }) => {

  // Обновляем последнее сообщение в списке чатов
  const chatInList = chats.value.find(c => c.id === messageData.chat_id)
  if (chatInList) {
    chatInList.last_message = messageData.message
    chatInList.updated_at = messageData.message.created_at

    // Увеличиваем счетчик непрочитанных ТОЛЬКО если:
    // 1. Это не текущий открытый чат ИЛИ
    // 2. Это сообщение от клиента (is_from_client = true)
    const isCurrentOpenChat = selectedChat.value && selectedChat.value.id === messageData.chat_id
    const isFromClient = messageData.message.is_from_client

    if (!isCurrentOpenChat && isFromClient) {
      chatInList.unread_count = (chatInList.unread_count || 0) + 1
    } else {
    }

    // Перемещаем чат в начало списка только если это новое сообщение от клиента
    if (isFromClient) {
      const chatIndex = chats.value.findIndex(c => c.id === messageData.chat_id)
      if (chatIndex > 0) {
        const chat = chats.value.splice(chatIndex, 1)[0]
        chats.value.unshift(chat)
      }
    }
  } else {
    // Если чата нет в списке, перезагружаем список
    loadChats()
  }

  // Показываем уведомление только если:
  // 1. Это не текущий открытый чат И
  // 2. Это сообщение от клиента
  const shouldShowNotification = (!selectedChat.value || selectedChat.value.id !== messageData.chat_id) &&
                                messageData.message.is_from_client

  if (shouldShowNotification) {
    toast.add({
      severity: 'info',
      summary: 'Новое сообщение',
      detail: `${messageData.sender_name || 'Клиент'}: ${messageData.message.message || 'Файл'}`,
      life: 5000,
      group: 'main'
    })
  }
}

onUnmounted(() => {
  // Отключаемся от SSE при размонтировании
  if (sseForChats.value) {
    sseForChats.value.close()
    sseForChats.value = null
  }
  sseDisconnect()
  stopUnreadPolling()
})
</script>

<style scoped>
/* Стили для сообщений с эмодзи */
.emoji-message {
  line-height: 1.5;
}

/* Увеличиваем эмодзи в списке чатов */
.emoji-message :global(.emoji-large) {
  font-size: 1.4em;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  margin: 0 1px;
}

/* Увеличиваем сообщения с эмодзи */
.emoji-message-large {
  font-size: 1.1rem !important;
  line-height: 1.4;
}

/* Принудительно устанавливаем шрифт для эмодзи */
.text-base {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
}
</style>
