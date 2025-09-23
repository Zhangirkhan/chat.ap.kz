<template>
  <div class="whitespace-pre-wrap break-words">{{ message.message }}</div>
</template>

<script setup lang="ts">
import type { Message } from '@/shared/lib/types'

interface Props {
  message: Message
}

defineProps<Props>()
</script>
