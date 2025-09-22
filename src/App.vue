<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import '@/assets/styles/main.css'

// TODO: Add auth initialization logic here
</script>

<template>
  <div id="app">
    <RouterView />
    <Toast />
  </div>
</template>

<style>
/* Все стили теперь в Tailwind CSS */
</style>
