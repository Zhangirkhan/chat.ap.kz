<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col" @click.stop>
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Информация об организации
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Содержимое -->
      <div class="p-6 space-y-6 overflow-y-auto">
        <!-- Основная информация -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
              Название организации
            </label>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ organization.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
              Статус
            </label>
            <span :class="[
              'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
              (organization.is_active === true) || (organization.status === 'active')
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            ]">
              {{ (organization.is_active === true) || (organization.status === 'active') ? 'Активна' : 'Неактивна' }}
            </span>
          </div>

          <div v-if="organization.email">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
              Email
            </label>
            <p class="text-gray-900 dark:text-white">
              <a :href="`mailto:${organization.email}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ organization.email }}
              </a>
            </p>
          </div>

          <div v-if="organization.phone">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
              Телефон
            </label>
            <p class="text-gray-900 dark:text-white">
              <a :href="`tel:${organization.phone}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ organization.phone }}
              </a>
            </p>
          </div>

          <div v-if="organization.address" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
              Адрес
            </label>
            <p class="text-gray-900 dark:text-white">{{ organization.address }}</p>
          </div>

          <div v-if="organization.description" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
              Описание
            </label>
            <p class="text-gray-900 dark:text-white">{{ organization.description }}</p>
          </div>
        </div>

        <!-- Webhook информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Настройки Webhook</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-1">
                Webhook URL
              </label>
              <div v-if="organization.webhook_url" class="flex items-center gap-2">
                <p class="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded flex-1">
                  {{ organization.webhook_url }}
                </p>
                <button
                  @click="copyToClipboard(organization.webhook_url)"
                  class="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm transition-colors duration-200"
                  title="Копировать URL"
                >
                  <i class="pi pi-copy"></i>
                </button>
              </div>
              <p v-else class="text-gray-900 dark:text-gray-400 italic">Не настроен</p>
            </div>

            

            <div v-if="organization.webhook_url" class="flex items-center gap-2">
              <button
                @click="testWebhook"
                :disabled="testing"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <i v-if="testing" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-play"></i>
                {{ testing ? 'Тестирование...' : 'Тестировать Webhook' }}
              </button>
              <span v-if="webhookTestResult" :class="[
                'text-sm',
                webhookTestResult.success ? 'text-green-600' : 'text-red-600'
              ]">
                {{ webhookTestResult.message }}
              </span>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-users text-blue-500"></i>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-400">Пользователи</span>
              </div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ organization.users_count || 0 }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-green-500"></i>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-400">Дата создания</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white mt-1">
                {{ formatDate(organization.created_at) }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-link text-purple-500"></i>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-400">Webhook</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white mt-1">
                {{ organization.webhook_url ? 'Настроен' : 'Не настроен' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  organization: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const testing = ref(false)
const webhookTestResult = ref(null)

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Копирование в буфер обмена
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Можно добавить уведомление об успешном копировании
  } catch (err) {
  }
}

// Тестирование webhook
const testWebhook = async () => {
  if (!props.organization.webhook_url) {
    webhookTestResult.value = {
      success: false,
      message: 'Webhook не настроен'
    }
    return
  }

  testing.value = true
  webhookTestResult.value = null

  try {
    const response = await fetch(props.organization.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.organization.webhook_token}`,
        'X-Webhook-Source': 'ERP.AP.KZ'
      },
      body: JSON.stringify({
        event: 'test',
        organization_id: props.organization.id,
        organization_name: props.organization.name,
        timestamp: new Date().toISOString(),
        message: 'Тестовое сообщение от системы корпоративного чата'
      })
    })

    if (response.ok) {
      webhookTestResult.value = {
        success: true,
        message: 'Webhook успешно протестирован!'
      }
    } else {
      webhookTestResult.value = {
        success: false,
        message: 'Ошибка при тестировании webhook'
      }
    }
  } catch (error) {
    webhookTestResult.value = {
      success: false,
      message: 'Ошибка при тестировании webhook: ' + error.message
    }
  } finally {
    testing.value = false
  }
}
</script>
