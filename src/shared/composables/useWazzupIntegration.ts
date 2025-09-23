import { ref } from 'vue'
import { organizationApi } from '@/entities/organization/api/organizationApi'

export interface WazzupChannel {
  channelId: string
  name: string
  phone?: string
  status?: string
  state?: string
  chatType?: string
}

export function useWazzupIntegration() {
  const loadingChannels = ref(false)
  const availableChannels = ref<WazzupChannel[]>([])
  const channelsMessage = ref<string>('')
  const channelsError = ref<boolean>(false)
  const settingUpWebhooks = ref(false)
  const webhookSetupResult = ref<{ success: boolean; message: string } | null>(null)

  const loadWazzupChannels = async (organizationId: number, apiKey: string) => {
    if (!apiKey || !organizationId) {
      channelsMessage.value = 'Введите API ключ и сохраните организацию, затем повторите.'
      channelsError.value = true
      return
    }

    loadingChannels.value = true
    availableChannels.value = []
    channelsMessage.value = ''
    channelsError.value = false

    try {
      const response = await organizationApi.getWazzupChannels(organizationId)

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

  const selectChannel = (channel: WazzupChannel) => {
    return channel.channelId
  }

  const setupWazzupWebhooks = async (organizationId: number) => {
    if (!organizationId) {
      webhookSetupResult.value = {
        success: false,
        message: 'ID организации не найден'
      }
      return
    }

    settingUpWebhooks.value = true
    webhookSetupResult.value = null

    try {
      const response = await organizationApi.setupWazzupWebhooks(organizationId)

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

  const getChannelStatusClass = (status?: string) => {
    if (!status) return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      case 'qridle':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const clearChannels = () => {
    availableChannels.value = []
    channelsMessage.value = ''
    channelsError.value = false
  }

  const clearWebhookResult = () => {
    webhookSetupResult.value = null
  }

  return {
    loadingChannels,
    availableChannels,
    channelsMessage,
    channelsError,
    settingUpWebhooks,
    webhookSetupResult,
    loadWazzupChannels,
    selectChannel,
    setupWazzupWebhooks,
    getChannelStatusClass,
    clearChannels,
    clearWebhookResult
  }
}
