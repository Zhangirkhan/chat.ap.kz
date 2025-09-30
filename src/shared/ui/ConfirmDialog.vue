<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    :draggable="false"
    :resizable="false"
    appendTo="body"
    :blockScroll="true"
    :style="{ width: '480px' }"
    :class="dialogClass"
    @hide="handleHide"
  >
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white m-0">
        {{ title }}
      </h3>
    </template>

    <div class="confirm-dialog-content">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="iconClass">
            <i :class="icon" class="text-2xl"></i>
          </div>
        </div>
        <div class="flex-1">
          <p class="text-gray-700 dark:text-gray-300 mb-4" v-html="message"></p>
          <div v-if="details" class="text-sm text-gray-500 dark:text-gray-400">
            {{ details }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button label="Отмена" icon="pi pi-times" severity="secondary" class="p-button-text" @click="handleCancel" />
        <Button label="Удалить" icon="pi pi-trash" severity="danger" @click="handleConfirm" />
      </div>
    </template>
  </Dialog>
  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

interface Props {
  title: string
  message: string
  details?: string
  type?: 'warning' | 'danger' | 'info' | 'success'
  dialogClass?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'hide'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'warning',
  dialogClass: ''
})

const emit = defineEmits<Emits>()

const visible = ref(true)

const iconMap = {
  warning: 'pi pi-exclamation-triangle',
  danger: 'pi pi-times-circle',
  info: 'pi pi-info-circle',
  success: 'pi pi-check-circle'
}

const iconClassMap = {
  warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
}

const icon = computed(() => iconMap[props.type])
const iconClass = computed(() => iconClassMap[props.type])

const handleConfirm = () => {
  emit('confirm')
  visible.value = false
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleHide = () => {
  emit('hide')
}
</script>

<style scoped>
.confirm-dialog-content {
  min-height: 80px;
}

/* Приводим внешний вид к стилю остальных диалогов */
::deep(.p-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

::deep(.p-dialog-header) {
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
}

::deep(.p-dialog-content) {
  padding: 1.5rem;
}

::deep(.p-dialog-footer) {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
}

.dark :deep(.p-dialog) {
  background: #1f2937;
  color: white;
}

.dark :deep(.p-dialog-header) {
  border-bottom-color: #374151;
}

.dark :deep(.p-dialog-footer) {
  border-top-color: #374151;
}

::deep(.p-dialog-mask) {
  backdrop-filter: blur(4px);
}
</style>