<template>
  <Dialog
    v-model:visible="isOpen"
    :modal="config.modal"
    :closable="config.closable"
    :draggable="config.draggable"
    :resizable="config.resizable"
    :maximizable="config.maximizable"
    :position="config.position"
    :style="{ 
      width: config.width, 
      height: config.height 
    }"
    :class="dialogClass"
    @hide="onHide"
  >
    <!-- Заголовок -->
    <template v-if="config.showHeader" #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white m-0">
          {{ title }}
        </h3>
        <button
          v-if="config.closable"
          @click="close"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>
    </template>
    
    <!-- Содержимое -->
    <div class="dialog-content" :class="{ 'loading': loading }">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <i class="pi pi-spin pi-spinner text-2xl text-blue-500"></i>
        <span class="ml-2 text-gray-600 dark:text-gray-400">Загрузка...</span>
      </div>
      <slot v-else />
    </div>
    
    <!-- Футер -->
    <template v-if="config.showFooter" #footer>
      <slot name="footer">
        <div class="flex justify-end gap-3">
          <Button
            :label="config.cancelLabel"
            :icon="config.cancelIcon"
            :severity="config.cancelSeverity"
            @click="onCancel"
            :disabled="loading"
            class="p-button-text"
          />
          <Button
            :label="config.confirmLabel"
            :icon="config.confirmIcon"
            :severity="config.confirmSeverity"
            @click="onConfirm"
            :loading="loading"
            :disabled="loading"
          />
        </div>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useDialog } from '@/shared/composables/useDialog'

interface Props {
  name: string
  title: string
  dialogClass?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'hide'): void
}

const props = withDefaults(defineProps<Props>(), {
  dialogClass: ''
})

const emit = defineEmits<Emits>()

const { isOpen, config, loading, close } = useDialog(props.name)

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}

const onHide = () => {
  emit('hide')
  close()
}
</script>

<style scoped>
.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
}

.dialog-content.loading {
  min-height: 100px;
}

:deep(.p-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.p-dialog-header) {
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 1.5rem;
}

:deep(.p-dialog-footer) {
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

/* Анимации */
:deep(.p-dialog) {
  transition: all 0.3s ease;
}

:deep(.p-dialog-mask) {
  backdrop-filter: blur(4px);
}
</style>