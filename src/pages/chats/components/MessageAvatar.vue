<template>
  <div 
    :class="[
      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
      avatarClasses
    ]"
  >
    <span class="text-white font-semibold text-xs">{{ initial }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/shared/lib/types'

interface Props {
  message: Message
  isFromClient: boolean
  selectedChat?: any
}

const props = defineProps<Props>()

const initial = computed(() => {
  if (props.isFromClient) {
    return getClientInitial()
  } else {
    return getStaffInitial()
  }
})

const avatarClasses = computed(() => {
  if (props.isFromClient) {
    return 'bg-gradient-to-r from-blue-500 to-purple-600'
  } else {
    return 'bg-gradient-to-r from-green-500 to-blue-500'
  }
})

const getClientInitial = () => {
  if (props.selectedChat?.client_name) {
    return props.selectedChat.client_name.charAt(0).toUpperCase()
  }
  return props.message.user?.name?.charAt(0).toUpperCase() || 'К'
}

const getStaffInitial = () => {
  if ((props.message as unknown as Record<string, unknown>).user_id === 1) {
    return '🤖'
  }
  const name = props.message.user?.name || 'С'
  return name.charAt(0).toUpperCase()
}
</script>
