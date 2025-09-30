<template>
  <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
    <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Настройки Webhook</h4>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Webhook URL
        </label>
        <input
          v-model="form.webhook_url"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          placeholder="https://your-system.com/webhook/wazzup24"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          URL для получения webhook'ов от Wazzup24. Оставьте пустым для автоматической генерации.
        </p>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="flex items-center gap-2 mt-4">
      <button
        type="button"
        @click="$emit('setupWebhooks')"
        :disabled="settingUpWebhooks"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <i v-if="settingUpWebhooks" class="pi pi-spin pi-spinner"></i>
        <i v-else class="pi pi-link"></i>
        {{ settingUpWebhooks ? 'Настраиваем...' : 'Подключить webhook' }}
      </button>

      <button
        type="button"
        @click="handleCheckWebhook"
        :disabled="checkingWebhook"
        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <i v-if="checkingWebhook" class="pi pi-spin pi-spinner"></i>
        <i v-else class="pi pi-check"></i>
        {{ checkingWebhook ? 'Проверяем...' : 'Проверить webhook' }}
      </button>

      <span v-if="webhookSetupResult" :class="[
        'text-sm ml-2',
        webhookSetupResult.success ? 'text-green-600' : 'text-red-600'
      ]">
        {{ webhookSetupResult.message }}
      </span>

      <span v-if="checkResultMessage" :class="[
        'text-sm ml-2',
        checkResultSuccess ? 'text-green-600' : 'text-red-600'
      ]">
        {{ checkResultMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrganizationFormData } from '@/shared/composables/useOrganizationForm'
import { ref } from 'vue'
import { apiClient } from '@/shared/api/client'

interface Props {
  form: OrganizationFormData
  settingUpWebhooks: boolean
  webhookSetupResult: { success: boolean; message: string } | null
}

defineProps<Props>()

const emit = defineEmits<{
  setupWebhooks: []
}>()

const checkingWebhook = ref(false)
const checkResultMessage = ref('')
const checkResultSuccess = ref(false)

const handleCheckWebhook = async () => {
  if (checkingWebhook.value) return
  checkingWebhook.value = true
  checkResultMessage.value = ''
  checkResultSuccess.value = false

  try {
    const response = await apiClient.get<{ ok: boolean; message?: string }>('/wazzup24/connection')
    const ok = (response && typeof response === 'object' && 'success' in response) ? (response as any).success : (response as any)?.data?.ok
    const message = (response as any)?.message || (response as any)?.data?.message

    if (ok) {
      checkResultSuccess.value = true
      checkResultMessage.value = message || 'Подключение активно'
    } else {
      checkResultSuccess.value = false
      checkResultMessage.value = message || 'Проверка неуспешна'
    }
  } catch (e: unknown) {
    let msg = 'Ошибка проверки подключения'
    if (e && typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string') {
      msg = (e as any).message
    }
    checkResultSuccess.value = false
    checkResultMessage.value = msg
  } finally {
    checkingWebhook.value = false
  }
}
</script>
