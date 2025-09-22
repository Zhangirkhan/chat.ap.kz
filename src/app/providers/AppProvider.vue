<template>
  <div id="app">
    <RouterView />
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Toast } from '@/shared/ui'
import ConfirmDialog from 'primevue/confirmdialog'

onMounted(async () => {
  // Инициализация authStore уже происходит автоматически
  // Не нужно дублировать логику здесь
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
