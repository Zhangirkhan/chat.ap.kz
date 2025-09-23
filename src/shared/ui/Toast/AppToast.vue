<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.severity}`]"
      >
        <div class="toast-content">
          <i :class="getToastIcon(toast.severity)"></i>
          <div class="toast-message">
            <div class="toast-title">{{ toast.summary }}</div>
            <div v-if="toast.detail" class="toast-detail">{{ toast.detail }}</div>
          </div>
          <button class="toast-close" @click="removeToast(toast.id)">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Toast {
  id: string
  severity: 'success' | 'info' | 'warn' | 'error'
  summary: string
  detail?: string
  life?: number
}

const toasts = ref<Toast[]>([])

const getToastIcon = (severity: string) => {
  const icons = {
    success: 'pi pi-check-circle',
    info: 'pi pi-info-circle',
    warn: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle'
  }
  return icons[severity as keyof typeof icons] || 'pi pi-info-circle'
}

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast = { ...toast, id }

  toasts.value.push(newToast)

  if (toast.life && toast.life > 0) {
    setTimeout(() => {
      removeToast(id)
    }, toast.life)
  }
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Глобальный API для уведомлений
const toastService = {
  success: (summary: string, detail?: string, life?: number) => {
    addToast({ severity: 'success', summary, detail, life })
  },
  info: (summary: string, detail?: string, life?: number) => {
    addToast({ severity: 'info', summary, detail, life })
  },
  warn: (summary: string, detail?: string, life?: number) => {
    addToast({ severity: 'warn', summary, detail, life })
  },
  error: (summary: string, detail?: string, life?: number) => {
    addToast({ severity: 'error', summary, detail, life })
  }
}

// Экспорт сервиса в глобальную область
onMounted(() => {
  ;(window as any).$toast = toastService
})

onUnmounted(() => {
  delete (window as any).$toast
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  border-left: 4px solid;
}

.toast--success {
  border-left-color: #28a745;
}

.toast--info {
  border-left-color: #17a2b8;
}

.toast--warn {
  border-left-color: #ffc107;
}

.toast--error {
  border-left-color: #dc3545;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.toast-content i {
  font-size: 20px;
  margin-top: 2px;
}

.toast--success i {
  color: #28a745;
}

.toast--info i {
  color: #17a2b8;
}

.toast--warn i {
  color: #ffc107;
}

.toast--error i {
  color: #dc3545;
}

.toast-message {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.toast-detail {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.toast-close:hover {
  background: #f8f9fa;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
