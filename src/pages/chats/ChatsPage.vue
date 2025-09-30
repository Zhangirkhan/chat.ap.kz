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
          @delete-chat="handleDeleteChat"
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
          :reply-to-message="replyToMessage"
          @back-to-list="selectedChat = null"
          @scroll="handleScroll"
          @open-image-preview="handleImagePreview"
          @file-selected="handleFileUpload"
          @file-error="handleFileError"
          @emoji-selected="handleEmojiSelectWrapper"
          @send-message="sendMessage"
          @container-ready="handleContainerReady"
          @chat-closed="handleChatClosed"
          @reply-to="replyToMessage = $event"
          @cancel-reply="replyToMessage = null"
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

    <!-- Диалоговое окно подтверждения -->
    <ConfirmDialog />
    
    <!-- Toast уведомления -->
    <Toast />
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
import { chatApi } from '@/entities/chat/api/chatApi'

// Компоненты
import ChatsList from './components/ChatsList.vue'
import ChatArea from './components/ChatArea.vue'
import SelectContractorDialog from './components/SelectContractorDialog.vue'
// import AddTestDataDialog from './components/AddTestDataDialog.vue'

import FilePreview from './components/FilePreview.vue'
import ImageViewer from './components/ImageViewer.vue'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

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
  createChat,
  deleteChat
} = useChats()

// SSE для обновления списка чатов в реальном времени
const sseForChats = ref<EventSource | null>(null)
let chatListPoller: number | null = null

// Композаблы для сообщений
const {
  messages,
  systemMessages,
  regularMessages,
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
const replyToMessage = ref<Message | null>(null)

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
  if (!selectedChat.value || !newMessage.value.trim()) {
    return
  }
  
  try {
    sendingMessage.value = true

    const messageData: any = {
      message: newMessage.value.trim(),
      type: 'text'
    }

    // Добавляем ID цитируемого сообщения если есть
    if (replyToMessage.value) {
      messageData.reply_to_message_id = replyToMessage.value.id
    }

    const response = await chatApi.sendMessage(selectedChat.value.id, messageData)

    // Добавляем отправленное сообщение в локальный массив
    if (response.data) {
      const newMsg: Message = {
        id: response.data.id,
        message: response.data.message || response.data.content,
        type: response.data.type || 'text',
        is_from_client: false,
        file_path: response.data.file_path,
        file_name: response.data.file_name,
        file_size: response.data.file_size,
        created_at: response.data.created_at,
        is_read: response.data.is_read,
        user: response.data.user,
        metadata: response.data.metadata
      }
      
      // Проверяем, нет ли уже такого сообщения (избегаем дублирования)
      const exists = messages.value.find((m: Message) => m.id === newMsg.id)
      if (!exists) {
        messages.value.push(newMsg)
        
        // Скроллим вниз после добавления
        setTimeout(() => {
          scrollToBottom(true)
        }, 100)
      }
    }

    newMessage.value = ''
    replyToMessage.value = null // Сбрасываем ответ

    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Сообщение отправлено',
      life: 3000
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка отправки сообщения',
      life: 5000
    })
  } finally {
    sendingMessage.value = false
  }
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

const handleDeleteChat = async (chatId: number) => {
  // Если удаляемый чат открыт, закрываем его
  if (selectedChat.value && selectedChat.value.id === chatId) {
    selectedChat.value = null
    messages.value = [] // Очищаем сообщения
    sseDisconnect() // Отключаемся от SSE
  }
  
  // Вызываем функцию удаления из композабла
  await deleteChat(chatId)
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

  // Fallback-пуллинг списка чатов, если SSE недоступен
  const POLL_INTERVAL_MS = 3000
  chatListPoller = window.setInterval(() => {
    if (!sseForChats.value || sseForChats.value.readyState !== 1) {
      loadChats()
    }
  }, POLL_INTERVAL_MS)

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
  sseOnNewMessage((raw: any) => {
    console.log('📨 SSE: Получено новое сообщение через SSE:', raw)
    
    // Нормализуем структуру: backend шлёт 'content', приводим к Message.message
    const message: Message = {
      id: raw.id,
      message: raw.message ?? raw.content ?? '',
      type: raw.type || 'text',
      is_from_client: !!raw.is_from_client,
      file_path: raw.file_path,
      file_name: raw.file_name,
      file_size: raw.file_size,
      created_at: raw.created_at,
      is_read: !!raw.is_read,
      user: raw.user,
      metadata: raw.metadata
    }
    
    console.log('📝 SSE: Нормализованное сообщение:', message)
    
    // Проверяем, нет ли уже такого сообщения (избегаем дублирования)
    const existingMessage = messages.value.find((m: Message) => m.id === message.id)
    if (existingMessage) {
      console.log('⚠️ SSE: Сообщение уже существует, пропускаем')
      return
    }

    // Добавляем новое сообщение в список текущего чата
    console.log('✅ SSE: Добавляем сообщение в список. Было сообщений:', messages.value.length)
    messages.value.push(message)
    console.log('✅ SSE: Стало сообщений:', messages.value.length)

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
          case 'chat_deleted':
            handleChatDeleted(data)
            break
          case 'chats_cleared':
            handleChatsCleared()
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

  // Если обновился текущий открытый чат и сообщения ещё не подгружены — подгружаем
  if (selectedChat.value && selectedChat.value.id === updatedChat.id && messages.value.length === 0) {
    loadChatMessages(updatedChat.id)
  }
}

// Обработчик удаления чата
const handleChatDeleted = (data: { chat_id: number; deleted_by: number; timestamp: string }) => {
  // Удаляем чат из локального списка
  const chatIndex = chats.value.findIndex(c => c.id === data.chat_id)
  if (chatIndex >= 0) {
    chats.value.splice(chatIndex, 1)
  }

  // Если удаленный чат был открыт, закрываем его
  if (selectedChat.value && selectedChat.value.id === data.chat_id) {
    selectedChat.value = null
    messages.value = [] // Очищаем сообщения
    sseDisconnect() // Отключаемся от SSE
  }

  // Показываем уведомление об удалении
  toast.add({
    severity: 'info',
    summary: 'Чат удален',
    detail: 'Чат был удален и удален из списка',
    life: 3000,
    group: 'main'
  })
}

// Обработчик полной очистки чатов
const handleChatsCleared = () => {
  // Очищаем список чатов
  chats.value = []
  
  // Закрываем открытый чат
  if (selectedChat.value) {
    selectedChat.value = null
    sseDisconnect() // Отключаемся от SSE
  }
  
  // Очищаем сообщения
  messages.value = []
  
  // Показываем уведомление
  toast.add({
    severity: 'info',
    summary: 'Чаты очищены',
    detail: 'Все чаты и сообщения были удалены',
    life: 3000,
    group: 'main'
  })
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

  // Если открыт именно этот чат и локально нет сообщений — добавим для мгновенного отображения
  if (selectedChat.value && selectedChat.value.id === messageData.chat_id) {
    const exists = messages.value.find(m => m.id === messageData.message.id)
    if (!exists) {
      // Нормализуем на случай, если приходит content
      const normalized = {
        ...messageData.message,
        message: (messageData.message as any).message ?? (messageData.message as any).content ?? ''
      } as Message
      messages.value.push(normalized)
    }
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
  if (chatListPoller) {
    clearInterval(chatListPoller)
    chatListPoller = null
  }
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
