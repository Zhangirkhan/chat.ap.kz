<template>
  <div class="flex items-center justify-center py-8">
    <div class="flex flex-col items-center gap-4">
      <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
      <p class="text-gray-600 dark:text-gray-400">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Загрузка...'
})
</script>