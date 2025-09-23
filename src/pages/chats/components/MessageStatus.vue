<template>
  <div v-if="!isFromClient" class="flex justify-end mt-1">
    <i v-if="message.is_read" class="pi pi-check-double text-blue-400 text-xs"></i>
    <i v-else class="pi pi-check text-gray-400 text-xs"></i>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/shared/lib/types'

interface Props {
  message: Message
  isFromClient: boolean
}

defineProps<Props>()
</script>
