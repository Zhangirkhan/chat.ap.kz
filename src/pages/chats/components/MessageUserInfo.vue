<template>
  <div class="mb-0.5 text-xs flex items-center gap-2" :class="textClasses">
    <span v-if="isFromClient" class="font-medium">{{ getClientName() }}</span>
    <span v-else class="font-medium">{{ getStaffName() }}</span>
    <span>{{ formatTime(message.created_at) }}</span>
    <!-- Статус доставки для исходящих сообщений -->
    <div v-if="!isFromClient && message.metadata?.wazzup_status" class="flex items-center gap-1">
      <i 
        :class="getDeliveryStatusIcon(message.metadata.wazzup_status)" 
        :title="getDeliveryStatusText(message.metadata.wazzup_status)"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/shared/lib/types'
import { useMessageFormatting } from '@/shared/composables/useMessageFormatting'
import { useMessageStatus } from '@/shared/composables/useMessageStatus'

interface Props {
  message: Message
  isFromClient: boolean
  selectedChat?: any
}

const props = defineProps<Props>()

const { formatTime } = useMessageFormatting()
const { getDeliveryStatusIcon, getDeliveryStatusText } = useMessageStatus()

const textClasses = computed(() => {
  return props.isFromClient 
    ? 'text-gray-600 dark:text-gray-400' 
    : 'text-gray-500 dark:text-gray-400'
})

const getClientName = () => {
  if (props.selectedChat?.client_name) {
    return props.selectedChat.client_name
  }
  return props.message.user?.name || 'Клиент'
}

const getStaffName = () => {
  if ((props.message as unknown as Record<string, unknown>).user_id === 1) {
    return '🤖 Бот'
  }
  return props.message.user?.name || 'Сотрудник'
}
</script>
