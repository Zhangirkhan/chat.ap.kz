import { ref, reactive, watch } from 'vue'
import type { Organization } from '@/shared/lib/types'

export interface OrganizationFormData {
  name: string
  slug: string
  description: string
  phone: string
  webhook_url: string
  webhook_token: string
  wazzup24_enabled: boolean
  wazzup24_api_key: string
  wazzup24_channel_id: string
  is_active: boolean
}

export function useOrganizationForm(organization?: Organization | null) {
  const loading = ref(false)
  
  const errors = reactive({
    phone: ''
  })

  const form = reactive<OrganizationFormData>({
    name: '',
    slug: '',
    description: '',
    phone: '',
    webhook_url: '',
    webhook_token: '',
    wazzup24_enabled: false,
    wazzup24_api_key: '',
    wazzup24_channel_id: '',
    is_active: true
  })

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

  const formatPhoneFromString = (phoneString: string) => {
    let value = phoneString.replace(/\D/g, '')

    if (value.startsWith('8')) {
      value = '7' + value.slice(1)
    }

    if (!value.startsWith('7') && value.length > 0) {
      value = '7' + value
    }

    if (value.length > 11) {
      value = value.slice(0, 11)
    }

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

  const initForm = () => {
    errors.phone = ''

    if (organization) {
      Object.assign(form, {
        name: organization.name || '',
        slug: organization.slug || '',
        description: organization.description || '',
        phone: organization.phone || '',
        webhook_url: organization.webhook_url || '',
        webhook_token: organization.webhook_token || '',
        wazzup24_enabled: organization.wazzup24_enabled || false,
        wazzup24_api_key: organization.wazzup24_api_key || '',
        wazzup24_channel_id: organization.wazzup24_channel_id || '',
        is_active: organization.is_active ?? true
      })

      if (form.phone) {
        formatPhoneFromString(form.phone)
      }
    } else {
      Object.assign(form, {
        name: '',
        slug: '',
        description: '',
        phone: '',
        webhook_url: '',
        webhook_token: '',
        wazzup24_enabled: false,
        wazzup24_api_key: '',
        wazzup24_channel_id: '',
        is_active: true
      })
    }
  }

  const resetForm = () => {
    Object.assign(form, {
      name: '',
      slug: '',
      description: '',
      phone: '',
      webhook_url: '',
      webhook_token: '',
      wazzup24_enabled: false,
      wazzup24_api_key: '',
      wazzup24_channel_id: '',
      is_active: true
    })
    errors.phone = ''
  }

  const validateForm = () => {
    return validatePhone()
  }

  const getFormData = () => {
    return {
      ...form,
      id: organization?.id
    }
  }

  // Инициализируем форму при создании
  initForm()

  // Следим за изменениями organization
  watch(() => organization, initForm, { immediate: true })

  return {
    form,
    errors,
    loading,
    validateForm,
    resetForm,
    getFormData,
    formatPhoneFromString
  }
}
