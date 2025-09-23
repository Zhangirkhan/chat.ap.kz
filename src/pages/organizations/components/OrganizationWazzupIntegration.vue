<template>
  <div v-if="isEdit" class="border-t border-gray-200 dark:border-gray-700 pt-6">
    <div class="flex items-center gap-3 mb-4">
      <i class="pi pi-whatsapp text-green-500 text-xl"></i>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Интеграция с WhatsApp (Wazzup24)</h3>
    </div>

    <div class="space-y-4">
      <div class="flex items-center">
        <input
          v-model="form.wazzup24_enabled"
          type="checkbox"
          id="wazzup_enabled"
          class="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
        />
        <label for="wazzup_enabled" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Включить интеграцию с WhatsApp через Wazzup24
        </label>
      </div>

      <div v-if="form.wazzup24_enabled" class="space-y-4 pl-6 border-l-2 border-green-200 dark:border-green-800">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Ключ Wazzup24 *
          </label>
          <input
            v-model="form.wazzup24_api_key"
            type="text"
            :required="form.wazzup24_enabled"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            placeholder="***"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            API ключ можно получить в личном кабинете Wazzup24
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID Канала WhatsApp *
          </label>
          <div class="flex gap-2">
            <input
              v-model="form.wazzup24_channel_id"
              type="text"
              :required="form.wazzup24_enabled"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="channel_123456"
            />
            <button
              v-if="form.wazzup24_api_key"
              type="button"
              @click="handleLoadChannels"
              :disabled="loadingChannels"
              class="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
              title="Загрузить каналы из Wazzup24"
            >
              <i v-if="loadingChannels" class="pi pi-spin pi-spinner text-xs"></i>
              <i v-else class="pi pi-download text-xs"></i>
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ID канала WhatsApp в системе Wazzup24
          </p>

          <!-- Список доступных каналов -->
          <WazzupChannelsList
            v-if="availableChannels.length > 0"
            :channels="availableChannels"
            :channels-message="channelsMessage"
            :channels-error="channelsError"
            @select-channel="handleSelectChannel"
          />
          <p v-else-if="channelsMessage" class="text-xs mt-2" :class="channelsError ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">{{ channelsMessage }}</p>
        </div>

        <!-- Webhook настройки Wazzup24 -->
        <WazzupWebhookSettings
          v-if="form.wazzup24_enabled"
          :form="form"
          :setting-up-webhooks="settingUpWebhooks"
          :webhook-setup-result="webhookSetupResult"
          @setup-webhooks="handleSetupWebhooks"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrganizationFormData } from '@/shared/composables/useOrganizationForm'
import type { WazzupChannel } from '@/shared/composables/useWazzupIntegration'
import WazzupChannelsList from './WazzupChannelsList.vue'
import WazzupWebhookSettings from './WazzupWebhookSettings.vue'

interface Props {
  form: OrganizationFormData
  isEdit: boolean
  loadingChannels: boolean
  availableChannels: WazzupChannel[]
  channelsMessage: string
  channelsError: boolean
  settingUpWebhooks: boolean
  webhookSetupResult: { success: boolean; message: string } | null
}

defineProps<Props>()

const emit = defineEmits<{
  loadChannels: []
  selectChannel: [channel: WazzupChannel]
  setupWebhooks: []
}>()

const handleLoadChannels = () => {
  emit('loadChannels')
}

const handleSelectChannel = (channel: WazzupChannel) => {
  emit('selectChannel', channel)
}

const handleSetupWebhooks = () => {
  emit('setupWebhooks')
}
</script>
