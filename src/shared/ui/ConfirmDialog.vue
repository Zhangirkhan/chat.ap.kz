<template>
  <UniversalDialog
    :name="name"
    :title="title"
    :dialog-class="dialogClass"
    @confirm="onConfirm"
    @cancel="onCancel"
    @hide="onHide"
  >
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
  </UniversalDialog>
</template>

<script setup lang="ts">
import UniversalDialog from './UniversalDialog.vue'

interface Props {
  name: string
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

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}

const onHide = () => {
  emit('hide')
}
</script>

<style scoped>
.confirm-dialog-content {
  min-height: 80px;
}
</style>