import { ref, computed } from 'vue'
import type { UserFormData, UserFormOptions, UserFormErrors } from './types'
import { validateUserForm } from '../lib/validation'

export function useUserForm(options: UserFormOptions = {}) {
  const isSubmitting = ref(false)
  const errors = ref<UserFormErrors>({})

  const form = ref<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    is_active: true,
    description: '',
    ...options.initialData
  })

  const isEditing = computed(() => !!options.userId)

  const handleSubmit = async () => {
    // Очищаем предыдущие ошибки
    errors.value = {}

    // Валидация
    const validationErrors = validateUserForm(form.value)
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors
      return
    }

    try {
      isSubmitting.value = true

      // Здесь будет API вызов
      // const result = await userApi.createOrUpdate(form.value, options.userId)
      
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Вызываем callback успеха
      options.onSuccess?.(form.value)
      
    } catch (error) {
      // Здесь можно добавить обработку ошибок API
    } finally {
      isSubmitting.value = false
    }
  }

  const handleCancel = () => {
    options.onCancel?.()
  }

  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    handleSubmit,
    handleCancel
  }
}
