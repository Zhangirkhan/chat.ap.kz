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
          @select-chat="handleSelectChat"
          @start-new-chat="openContractorDialog"
          @show-test-data="openTestDataDialog"
          @show-test-chats="openTestChatsDialog"
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
          @emoji-selected="handleEmojiSelect"
          @send-message="handleSendMessage"
          @container-ready="setMessagesContainer"
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { useToast } from 'primevue/usetoast'
import type { Chat, Message } from '@/shared/lib/types'
import type { Contractor } from '@/shared/api/contractors'

// Компоненты
import ChatsList from './components/ChatsList.vue'
import ChatArea from './components/ChatArea.vue'
import SelectContractorDialog from './components/SelectContractorDialog.vue'
import FilePreview from './components/FilePreview.vue'
import ImageViewer from './components/ImageViewer.vue'

// Composables
import { useChatManagement } from '@/shared/composables/useChatManagement'
import { useMessageManagement } from '@/shared/composables/useMessageManagement'
import { useChatSSE } from '@/shared/composables/useChatSSE'
import { useChatNotifications } from '@/shared/composables/useChatNotifications'
import { useChatDialogs } from '@/shared/composables/useChatDialogs'
import { useChatMedia } from '@/shared/composables/useChatMedia'

const toast = useToast()

// Основные composables
const {
  chats,
  selectedChat,
  loading,
  error,
  searchQuery,
  filteredChats,
  loadChats,
  searchChats,
  createChat,
  selectChat,
  updateChatInList,
  updateChatStatus,
  updateUnreadCount,
  resetUnreadCount
} = useChatManagement()

const {
  messages,
  sendingMessage,
  newMessage,
  loadChatMessages,
  sendMessage,
  addMessage,
  scrollToBottom,
  handleScroll,
  setMessagesContainer,
  clearMessages
} = useMessageManagement()

const {
  connect: sseConnect,
  disconnect: sseDisconnect,
  setupChatListSSE,
  disconnectChatListSSE,
  onNewMessage: sseOnNewMessage
} = useChatSSE()

const {
  showNewMessageNotification,
  showUnreadNotification,
  shouldShowNotification
} = useChatNotifications()

const {
  showContractorDialog,
  openContractorDialog,
  closeContractorDialog,
  openTestDataDialog,
  openTestChatsDialog,
  handleCreateNewContractor
} = useChatDialogs()

const {
  showImageViewer,
  viewerImages,
  viewerInitialIndex,
  previewFiles,
  showPreview,
  uploadingFile,
  openImagePreview,
  closeImageViewer,
  handleFileUpload,
  handleFileError,
  handleFileSend,
  handleFileCancel,
  handleEmojiSelect
} = useChatMedia()

// Локальные ссылки
const filePreviewRef = ref<InstanceType<typeof FilePreview> | null>(null)

// Обработчики событий
const handleSelectChat = async (chat: Chat) => {
  selectChat(chat)
  clearMessages()
  await loadChatMessages(chat.id)
  await sseConnect(chat.id)

  // Принудительный скролл вниз с задержкой для рендеринга сообщений
  setTimeout(() => scrollToBottom(true), 100)
  setTimeout(() => scrollToBottom(true), 300)
  setTimeout(() => scrollToBottom(true), 500)

  // Сбрасываем счетчик непрочитанных для выбранного чата
  resetUnreadCount(chat.id)
}

const handleSendMessage = async () => {
  if (selectedChat.value) {
    await sendMessage(selectedChat.value.id)
  }
}

const handleContractorSelect = async (contractor: Contractor) => {
  const newChat = await createChat(contractor)
  if (newChat) {
    selectedChat.value = newChat
  }
  closeContractorDialog()
}

const handleImagePreview = (imagePath: string) => {
  openImagePreview(imagePath, messages.value)
}

const handleChatClosed = (chatId: number) => {
  updateChatStatus(chatId, 'closed')
  loadChats()
}

const handleFileSendWrapper = async (files: Array<{preview?: string, caption?: string, id?: string} & File>, fileType: string) => {
  if (!selectedChat.value) return

  const chatType = selectedChat.value.client_phone ? 'wazzup' : 'regular'

  await handleFileSend(files, fileType, selectedChat.value.id, () => {
    loadChatMessages(selectedChat.value!.id)
    setTimeout(() => scrollToBottom(), 200)
  }, chatType)

  // Сигнализируем об успешной отправке
  ;(window as unknown as { fileSendCompleted: boolean }).fileSendCompleted = true
}

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.length >= 3) {
      searchChats()
    } else if (searchQuery.value.length === 0) {
      loadChats()
    }
  }, 800)
})

onMounted(async () => {
  // Добавляем функцию в window для тестирования
  ;(window as unknown as { testHandleFileSend: typeof handleFileSendWrapper }).testHandleFileSend = handleFileSendWrapper
  
  loadChats()

  // Подключаемся к SSE для обновления списка чатов в реальном времени
  setupChatListSSE(
    (chat: Chat) => updateChatInList(chat),
    (data: any) => handleNewMessageForList(data),
    () => loadChats()
  )

  // Настраиваем обработчик новых сообщений SSE для открытого чата
  sseOnNewMessage((message: Message) => {
    addMessage(message)

    if (selectedChat.value) {
      selectedChat.value.last_message = message
      selectedChat.value.updated_at = message.created_at

      // Обновляем в списке чатов
      const chatInList = chats.value.find(c => c.id === selectedChat.value?.id)
      if (chatInList) {
        chatInList.last_message = message
        chatInList.updated_at = message.created_at
      }
    }
  })
})

// Обработчик нового сообщения для обновления списка чатов
const handleNewMessageForList = (messageData: { chat_id: number; message: Message; sender_name?: string }) => {
  const chatInList = chats.value.find(c => c.id === messageData.chat_id)
  if (chatInList) {
    chatInList.last_message = messageData.message
    chatInList.updated_at = messageData.message.created_at

    const isCurrentOpenChat = selectedChat.value && selectedChat.value.id === messageData.chat_id
    const isFromClient = messageData.message.is_from_client

    if (!isCurrentOpenChat && isFromClient) {
      chatInList.unread_count = (chatInList.unread_count || 0) + 1
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
    loadChats()
  }

  // Показываем уведомление
  if (shouldShowNotification(selectedChat.value, messageData.chat_id, messageData.message.is_from_client)) {
    showNewMessageNotification(chatInList!, messageData.message, messageData.sender_name)
  }
}

onUnmounted(() => {
  sseDisconnect()
  disconnectChatListSSE()
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
