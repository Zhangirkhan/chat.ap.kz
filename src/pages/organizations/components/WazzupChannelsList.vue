<template>
  <div class="mt-2">
    <div class="space-y-1">
      <button
        v-for="channel in channels"
        :key="channel.channelId"
        type="button"
        @click="$emit('selectChannel', channel)"
        class="w-full text-left px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <span class="font-mono">{{ channel.channelId }}</span>
        <span class="text-gray-600 dark:text-gray-300 ml-2">{{ channel.name }}</span>
        <span v-if="channel.phone" class="text-gray-500 dark:text-gray-400 ml-1">({{ channel.phone }})</span>
        <span
          v-if="channel.status || channel.state"
          class="ml-2 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide"
          :class="getChannelStatusClass(channel.status || channel.state)"
        >
          {{ channel.status || channel.state }}
        </span>
      </button>
    </div>
    
    <!-- Текстовый список ID -->
    <div class="mt-2">
      <textarea
        readonly
        class="w-full text-xs font-mono px-2 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        rows="3"
      >{{ channels.map(c => c.channelId).join('\n') }}</textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WazzupChannel } from '@/shared/composables/useWazzupIntegration'

interface Props {
  channels: WazzupChannel[]
  channelsMessage: string
  channelsError: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  selectChannel: [channel: WazzupChannel]
}>()

const getChannelStatusClass = (status?: string) => {
  if (!status) return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
    case 'qridle':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
    default:
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}
</script>
