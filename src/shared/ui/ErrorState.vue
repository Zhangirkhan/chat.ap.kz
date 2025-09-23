<template>
  <div class="flex items-center justify-center py-8">
    <div class="flex flex-col items-center gap-4 text-center">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ошибка</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ message }}</p>
      </div>
      <button
        v-if="showRetry"
        @click="$emit('retry')"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
      >
        Попробовать снова
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  showRetry?: boolean
}

defineProps<Props>()

defineEmits<{
  retry: []
}>()
</script>