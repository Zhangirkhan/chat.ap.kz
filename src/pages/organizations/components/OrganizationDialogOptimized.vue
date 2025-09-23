<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Редактировать организацию' : 'Добавить организацию' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Форма -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Основная информация -->
        <OrganizationBasicInfo
          :form="form"
          :errors="errors"
        />

        <!-- Интеграция с WhatsApp -->
        <OrganizationWazzupIntegration
          :form="form"
          :is-edit="isEdit"
          :loading-channels="loadingChannels"
          :available-channels="availableChannels"
          :channels-message="channelsMessage"
          :channels-error="channelsError"
          :setting-up-webhooks="settingUpWebhooks"
          :webhook-setup-result="webhookSetupResult"
          @load-channels="handleLoadChannels"
          @select-channel="handleSelectChannel"
          @setup-webhooks="handleSetupWebhooks"
        />

        <!-- Кнопки -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-save"></i>
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Organization } from '@/shared/lib/types'
import { useOrganizationForm } from '@/shared/composables/useOrganizationForm'
import { useWazzupIntegration } from '@/shared/composables/useWazzupIntegration'
import OrganizationBasicInfo from './OrganizationBasicInfo.vue'
import OrganizationWazzupIntegration from './OrganizationWazzupIntegration.vue'

interface Props {
  organization?: Organization | null
  isEdit?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

// Composables
const { form, errors, loading, validateForm, getFormData } = useOrganizationForm(props.organization)

const {
  loadingChannels,
  availableChannels,
  channelsMessage,
  channelsError,
  settingUpWebhooks,
  webhookSetupResult,
  loadWazzupChannels,
  selectChannel,
  setupWazzupWebhooks
} = useWazzupIntegration()

// Обработчики событий
const handleLoadChannels = async () => {
  if (props.organization?.id && form.wazzup24_api_key) {
    await loadWazzupChannels(props.organization.id, form.wazzup24_api_key)
  }
}

const handleSelectChannel = (channel: any) => {
  form.wazzup24_channel_id = selectChannel(channel)
}

const handleSetupWebhooks = async () => {
  if (props.organization?.id) {
    await setupWazzupWebhooks(props.organization.id)
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Здесь будет API запрос для сохранения
    await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация загрузки

    emit('save', getFormData())
  } catch (error) {
    console.error('Ошибка сохранения организации:', error)
  } finally {
    loading.value = false
  }
}
</script>
