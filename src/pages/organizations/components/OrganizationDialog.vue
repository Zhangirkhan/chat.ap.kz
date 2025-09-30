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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Название организации *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите название организации"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug
            </label>
            <input
              v-model="form.slug"
              type="text"
              readonly
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              placeholder="Генерируется автоматически"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Уникальный идентификатор организации (генерируется автоматически)
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              v-phone
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+7 777 123 45 67"
            />
            <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
          </div>

          

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              v-model="form.is_active"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option :value="true">Активна</option>
              <option :value="false">Неактивна</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Описание
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Введите описание организации"
          ></textarea>
        </div>

        <!-- Интеграция с WhatsApp (Wazzup24) -->
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
                    @click="loadWazzupChannels"
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

                <!-- Список доступных каналов (без textarea списка) -->
                <div v-if="availableChannels.length > 0" class="mt-2">
                  <div class="space-y-1">
                    <button
                      v-for="channel in availableChannels"
                      :key="channel.channelId"
                      type="button"
                      @click="selectChannel(channel)"
                      class="w-full text-left px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      <span class="font-mono">{{ channel.channelId }}</span>
                      <span class="text-gray-600 dark:text-gray-300 ml-2">{{ channel.name }}</span>
                      <span v-if="channel.phone" class="text-gray-500 dark:text-gray-400 ml-1">({{ channel.phone }})</span>
                      <span
                        v-if="channel.status"
                        class="ml-2 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide"
                        :class="[
                          channel.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                          channel.status === 'qridle' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                          'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        ]"
                      >
                        {{ channel.status }}
                      </span>
                    </button>
                  </div>
                </div>
                <p v-else-if="channelsMessage" class="text-xs mt-2" :class="channelsError ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">{{ channelsMessage }}</p>
              </div>

              

              <!-- Webhook настройки Wazzup24 -->
              <div v-if="form.wazzup24_enabled" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              </div>

              <!-- Кнопки действий -->
              <div v-if="form.wazzup24_api_key && form.wazzup24_channel_id" class="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  @click="setupWazzupWebhooks"
                  :disabled="settingUpWebhooks"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <i v-if="settingUpWebhooks" class="pi pi-spin pi-spinner"></i>
                  <i v-else class="pi pi-link"></i>
                  {{ settingUpWebhooks ? 'Настраиваем...' : 'Подключить webhook' }}
                </button>

                <button
                  type="button"
                  @click="checkWazzupWebhookStatus"
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
          </div>
        </div>


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
import { ref, reactive, watch, onMounted } from 'vue'
import { organizationApi } from '@/entities/organization/api/organizationApi'
import { API_CONFIG } from '@/shared/config/api'

interface Organization {
  id?: number
  name: string
  slug?: string
  description: string
  domain?: string | null
  phone: string
  webhook_url?: string
  webhook_token?: string
  wazzup24_enabled?: boolean
  wazzup24_api_key?: string
  wazzup24_channel_id?: string
  wazzup24_webhook_url?: string
  wazzup24_settings?: Record<string, unknown>
  is_active: boolean
  created_at?: string
  updated_at?: string
}

const props = defineProps<{
  organization?: Organization | null
  isEdit?: boolean
}>()

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
// Убрана проверка подключения Wazzup
const loadingChannels = ref(false)
const availableChannels = ref<Array<{ channelId: string; name: string; phone?: string; status?: string }>>([])
const channelsMessage = ref<string>('')
const channelsError = ref<boolean>(false)
const settingUpWebhooks = ref(false)
const webhookSetupResult = ref<{ success: boolean; message: string } | null>(null)
const checkingWebhook = ref(false)
const checkResultMessage = ref('')
const checkResultSuccess = ref(false)

interface WazzupChannel {
  channelId: string
  name: string
  phone?: string
  status?: string
  state?: string
  chatType?: string
}

const errors = reactive({
  phone: ''
})

const form = reactive({
  name: '',
  slug: '',
  description: '',
  
  phone: '',
  webhook_url: '',
  wazzup24_enabled: false,
  wazzup24_api_key: '',
  wazzup24_channel_id: '',
  is_active: true
})

// Убрали локальное форматирование, применяется v-phone

// Валидация телефона
const validatePhone = () => {
  const phoneDigits = form.phone.replace(/\D/g, '')
  if (!form.phone) {
    errors.phone = 'Телефон обязателен для заполнения'
    return false
  }
  if (phoneDigits.length !== 11) {
    errors.phone = 'Введите корректный номер телефона'
    return false
  }
  if (!phoneDigits.startsWith('7')) {
    errors.phone = 'Номер должен начинаться с +7'
    return false
  }
  errors.phone = ''
  return true
}

// Инициализация формы
const initForm = () => {
  // Сбрасываем ошибки
  errors.phone = ''

  if (props.organization) {
    Object.assign(form, {
      name: props.organization.name || '',
      slug: props.organization.slug || '',
      description: props.organization.description || '',
      
      phone: props.organization.phone || '',
      webhook_url: props.organization.webhook_url || '',
      wazzup24_enabled: props.organization.wazzup24_enabled || false,
      wazzup24_api_key: props.organization.wazzup24_api_key || '',
      wazzup24_channel_id: props.organization.wazzup24_channel_id || '',
      is_active: props.organization.is_active ?? true
    })

    // Форматируем телефон при редактировании
    if (form.phone) {
      formatPhoneFromString(form.phone)
    }
    if (form.slug && !form.webhook_url) {
      const base = API_CONFIG.BACKEND_URL || 'https://back-erp.ap.kz'
      form.webhook_url = `${base}/api/webhooks/organization/${encodeURIComponent(form.slug)}`
    }
  } else {
    Object.assign(form, {
      name: '',
      slug: '',
      description: '',
      
      phone: '',
      webhook_url: '',
      wazzup24_enabled: false,
      wazzup24_api_key: '',
      wazzup24_channel_id: '',
      is_active: true
    })
  }
}

// Форматирование номера телефона из строки (для инициализации)
const formatPhoneFromString = (phoneString: string) => {
  let value = phoneString.replace(/\D/g, '') // Удаляем все нецифровые символы

  // Если номер начинается с 8, заменяем на 7
  if (value.startsWith('8')) {
    value = '7' + value.slice(1)
  }

  // Если номер не начинается с 7, добавляем 7
  if (!value.startsWith('7') && value.length > 0) {
    value = '7' + value
  }

  // Ограничиваем длину (7 + 10 цифр)
  if (value.length > 11) {
    value = value.slice(0, 11)
  }

  // Форматируем номер
  let formatted = ''
  if (value.length > 0) {
    formatted = '+7'
    if (value.length > 1) {
      formatted += ' (' + value.slice(1, 4)
      if (value.length >= 4) {
        formatted += ')'
      }
    }
    if (value.length > 4) {
      formatted += ' ' + value.slice(4, 7)
    }
    if (value.length > 7) {
      formatted += '-' + value.slice(7, 9)
    }
    if (value.length > 9) {
      formatted += '-' + value.slice(9, 11)
    }
  }

  form.phone = formatted
}




// Удалена функция testWazzupConnection

// Загрузка каналов из Wazzup24
const loadWazzupChannels = async () => {
  if (!form.wazzup24_api_key || !props.organization?.id) {
    channelsMessage.value = 'Введите API ключ и сохраните организацию, затем повторите.'
    channelsError.value = true
    return
  }

  loadingChannels.value = true
  availableChannels.value = []
  channelsMessage.value = ''
  channelsError.value = false

  try {

    const response = await organizationApi.getWazzupChannels(props.organization.id)

    // Поддержка обоих форматов ответа: { success, channels, error } ИЛИ { data: { success, channels, error } }
    const raw: any = response as any
    const success = (raw && typeof raw === 'object' && 'success' in raw) ? raw.success : raw?.data?.success
    const channels = (raw && typeof raw === 'object' && 'channels' in raw) ? raw.channels : raw?.data?.channels
    const errMsg = (raw && typeof raw === 'object' && 'error' in raw) ? raw.error : (raw?.data?.error || raw?.message)

    if (success && Array.isArray(channels)) {
      availableChannels.value = channels.map((channel: any) => ({
        channelId: channel.channelId,
        name: channel.name || 'Unnamed Channel',
        phone: channel.phone,
        status: channel.status || channel.state,
        state: channel.state
      }))
      if (availableChannels.value.length === 0) {
        channelsMessage.value = 'Каналы не найдены для данного ключа.'
        channelsError.value = false
      } else {
        channelsMessage.value = `${availableChannels.value.length} канал(ов) загружено.`
        channelsError.value = false
      }
    } else {
      channelsMessage.value = errMsg || 'Не удалось загрузить каналы. Проверьте API ключ.'
      channelsError.value = true
    }
  } catch (error: unknown) {
    let errorMessage = 'Ошибка загрузки каналов'
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>
      const response = err.response as Record<string, unknown> | undefined
      const data = response?.data as Record<string, unknown> | undefined
      if (data?.message && typeof data.message === 'string') {
        errorMessage = data.message
      } else if (data?.error && typeof data.error === 'string') {
        errorMessage = data.error
      } else if (err.message && typeof err.message === 'string') {
        errorMessage = err.message
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    channelsMessage.value = errorMessage
    channelsError.value = true
  } finally {
    loadingChannels.value = false
  }
}

// Выбор канала из списка
const selectChannel = (channel: { channelId: string; name: string; phone?: string; status?: string; state?: string }) => {
  form.wazzup24_channel_id = channel.channelId
}

// Настройка webhook'ов в Wazzup24
const setupWazzupWebhooks = async () => {
  if (!props.organization?.id) {
    webhookSetupResult.value = {
      success: false,
      message: 'ID организации не найден'
    }
    return
  }

  settingUpWebhooks.value = true
  webhookSetupResult.value = null

  try {
    const response = await organizationApi.setupWazzupWebhooks(props.organization.id, {
      webhook_url: form.webhook_url || undefined,
      subscriptions: {
        messagesAndStatuses: true,
        contactsAndDealsCreation: false,
        channelsUpdates: false,
        templateStatus: false
      }
    })

    // Поддержка обоих форматов ответа: { success, data, error } ИЛИ { data: { success, error } }
    const raw: any = response as any
    const success = (raw && typeof raw === 'object' && 'success' in raw) ? raw.success : raw?.data?.success
    const errMsg = (raw && typeof raw === 'object' && 'error' in raw) ? raw.error : (raw?.data?.error || raw?.message)

    if (success) {
      webhookSetupResult.value = {
        success: true,
        message: 'Webhook успешно настроен!'
      }
    } else {
      webhookSetupResult.value = {
        success: false,
        message: errMsg || 'Не удалось настроить webhook'
      }
    }
  } catch (error: unknown) {

    // Извлекаем детальную ошибку из ответа API
    let errorMessage = 'Ошибка настройки webhook'

    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>
      const response = err.response as Record<string, unknown> | undefined
      const data = response?.data as Record<string, unknown> | undefined

      if (data?.message && typeof data.message === 'string') {
        errorMessage = data.message
      } else if (data?.error && typeof data.error === 'string') {
        errorMessage = data.error
      } else if (err.message && typeof err.message === 'string') {
        errorMessage = err.message
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    webhookSetupResult.value = {
      success: false,
      message: errorMessage
    }
  } finally {
    settingUpWebhooks.value = false
  }
}

// Проверка текущего статуса webhook в Wazzup24
const checkWazzupWebhookStatus = async () => {
  if (!props.organization?.id) {
    checkResultSuccess.value = false
    checkResultMessage.value = 'ID организации не найден'
    return
  }

  checkingWebhook.value = true
  checkResultMessage.value = ''
  checkResultSuccess.value = false

  try {
    const response = await organizationApi.getWazzupWebhooksStatus(props.organization.id)
    const raw: any = response as any
    const success = (raw && typeof raw === 'object' && 'success' in raw) ? raw.success : raw?.data?.success
    const data = (raw && typeof raw === 'object' && 'data' in raw) ? raw.data : raw?.data?.data

    if (success) {
      checkResultSuccess.value = true
      const uri = data?.webhooksUri || data?.webhookUri || form.webhook_url || ''
      checkResultMessage.value = uri ? `Webhook активен: ${uri}` : 'Webhook активен'
    } else {
      checkResultSuccess.value = false
      const errMsg = (raw && typeof raw === 'object' && 'error' in raw) ? raw.error : (raw?.data?.error || raw?.message)
      checkResultMessage.value = errMsg || 'Не удалось получить статус webhook'
    }
  } catch (e: unknown) {
    let msg = 'Ошибка проверки webhook'
    if (e && typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string') {
      msg = (e as any).message
    }
    checkResultSuccess.value = false
    checkResultMessage.value = msg
  } finally {
    checkingWebhook.value = false
  }
}

// Отправка формы
const handleSubmit = async () => {
  // Валидация формы
  if (!validatePhone()) {
    return
  }

  loading.value = true

  try {
    // Здесь будет API запрос для сохранения
    await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация загрузки

    emit('save', {
      ...form,
      id: props.organization?.id
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Следим за изменениями organization
watch(() => props.organization, initForm, { immediate: true })

onMounted(() => {
  initForm()
})

// Автогенерация webhook_url из slug, если пользователь не задал вручную
watch(() => form.slug, (newSlug) => {
  if (!newSlug) return
  if (!form.webhook_url) {
    const base = (API_CONFIG.BACKEND_URL || 'https://back-erp.ap.kz').replace(/\/$/, '')
    const candidate = `${base}/api/webhooks/organization/${encodeURIComponent(newSlug)}`
    form.webhook_url = candidate.substring(0, 200)
  }
})

// Транслитерация и slugify для кириллицы
const translitMap: Record<string, string> = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
}

function slugifyCyrillic(input: string): string {
  if (!input) return ''
  const transliterated = input.split('').map(ch => translitMap[ch] ?? ch).join('')
  return transliterated
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

// Автогенерация slug при изменении name (только если пользователь не менял slug вручную)
let userEditedSlug = false
watch(() => form.slug, (val, oldVal) => {
  if (oldVal !== undefined && val !== slugifyCyrillic(form.name)) {
    userEditedSlug = true
  }
})

watch(() => form.name, (newName) => {
  if (!userEditedSlug || !form.slug) {
    form.slug = slugifyCyrillic(newName)
  }
})

// Сброс флага при загрузке другой организации
watch(() => props.organization?.id, () => {
  userEditedSlug = false
})
</script>
