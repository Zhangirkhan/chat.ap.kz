<template>
  <AdminLayout>
    <template #title>Чаты</template>
    <template #subtitle>Корпоративные чаты и сообщения</template>

    <div class="h-[calc(100vh-120px)] md:h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="flex h-full">
        <!-- Левая панель - Список чатов -->
        <div class="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <!-- Заголовок и поиск -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Чаты</h3>
              <Button
                icon="pi pi-plus"
                @click="openCreateChatDialog"
                size="small"
                variant="primary"
              />
            </div>
            <Input
              v-model="searchQuery"
              placeholder="Поиск чатов..."
              icon="pi pi-search"
            />
          </div>

          <!-- Список чатов с виртуализацией -->
          <div class="flex-1 overflow-hidden">
            <VirtualList
              :items="filteredChats"
              :item-height="120"
              :container-height="chatListHeight"
              class="h-full"
            >
              <template #default="{ item: chat }">
                <ChatCard
                  :chat="chat"
                  :selected="selectedChat?.id === chat.id"
                  @select="selectChat"
                  class="m-2"
                />
              </template>
            </VirtualList>
          </div>
        </div>

        <!-- Правая панель - Область чата -->
        <div class="flex-1 flex flex-col">
          <ChatArea
            v-if="selectedChat"
            :selected-chat="selectedChat"
            :messages="selectedChatMessages"
            v-model:new-message="newMessage"
            :sending-message="sendingMessage"
            @send-message="sendMessage"
            @back-to-list="selectedChat = null"
          />
          <div v-else class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <i class="pi pi-comments text-4xl mb-4"></i>
              <p>Выберите чат для начала общения</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Универсальный диалог создания чата -->
    <UniversalDialog
      name="create-chat"
      title="Создать новый чат"
      width="600px"
      @confirm="handleCreateChat"
    >
      <form @submit.prevent="handleCreateChat" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Название чата *
          </label>
          <Input
            v-model="chatForm.title"
            placeholder="Введите название чата"
            :error="chatFormErrors.title"
            @blur="validateField('title')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Клиент *
          </label>
          <Select
            v-model="chatForm.client_id"
            :options="clients"
            option-label="name"
            option-value="id"
            placeholder="Выберите клиента"
            :error="chatFormErrors.client_id"
            @blur="validateField('client_id')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Отдел
          </label>
          <Select
            v-model="chatForm.department_id"
            :options="departments"
            option-label="name"
            option-value="id"
            placeholder="Выберите отдел (необязательно)"
          />
        </div>
      </form>
    </UniversalDialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { Button, Input, Select } from '@/shared/ui'
import ChatCard from '@/shared/ui/ChatCard.vue'
import VirtualList from '@/shared/ui/VirtualList.vue'
import UniversalDialog from '@/shared/ui/UniversalDialog.vue'
import ChatArea from './components/ChatArea.vue'
import { useChatStore } from '@/app/providers/stores/chatStore'
import { useForm } from '@/shared/composables/useForm'
import { chatValidationSchema } from '@/shared/lib/validation'
import { useApiCache } from '@/shared/composables/useCache'
import { clientsApi } from '@/shared/api/clients'
import { departmentsApi } from '@/shared/api/departments'

// Stores
const chatStore = useChatStore()

// Form
const { form: chatForm, errors: chatFormErrors, validateField } = useForm(chatValidationSchema, {
  title: '',
  client_id: 0,
  department_id: undefined,
  assigned_to: undefined
})

// API with caching
const { data: clients, execute: loadClients } = useApiCache(
  () => clientsApi.getClients({ per_page: 100 }),
  'clients',
  300000 // 5 minutes
)

const { data: departments, execute: loadDepartments } = useApiCache(
  () => departmentsApi.getDepartments({ per_page: 100 }),
  'departments',
  300000 // 5 minutes
)

// Local state
const newMessage = ref('')
const chatListHeight = ref(400)

// Computed
const filteredChats = computed(() => chatStore.filteredChats)
const selectedChat = computed(() => chatStore.selectedChat)
const selectedChatMessages = computed(() => chatStore.selectedChatMessages)
const sendingMessage = computed(() => chatStore.sendingMessage)
const searchQuery = computed({
  get: () => chatStore.searchQuery,
  set: (value) => chatStore.setSearchQuery(value)
})

// Methods
const selectChat = (chat: any) => {
  chatStore.selectChat(chat)
}

const sendMessage = async (messageData: any) => {
  await chatStore.sendMessage(messageData)
}

const openCreateChatDialog = () => {
  // Используем новый диалог
  const { open } = useDialog('create-chat')
  open()
}

const handleCreateChat = async () => {
  if (chatForm.validate()) {
    const success = await chatStore.createChat(chatForm.getFormData())
    if (success) {
      const { close } = useDialog('create-chat')
      close()
      chatForm.reset()
    }
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    chatStore.loadChats(),
    loadClients(),
    loadDepartments()
  ])
  
  // Устанавливаем высоту списка чатов
  const updateHeight = () => {
    chatListHeight.value = window.innerHeight - 200
  }
  
  updateHeight()
  window.addEventListener('resize', updateHeight)
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
  })
})
</script>
