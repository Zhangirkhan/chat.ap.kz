import { ref, computed, reactive, watch } from 'vue'
import { z } from 'zod'
import type { ZodSchema } from 'zod'

export function useForm<T extends Record<string, unknown>>(schema: ZodSchema<T>, initialData?: Partial<T>) {
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  const isDirty = ref(false)
  const isValid = ref(false)
  
  // Создаем реактивную форму на основе схемы
  const form = reactive<T>({} as T)
  
  // Инициализируем форму начальными данными
  if (initialData) {
    Object.assign(form, initialData)
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const hasFieldError = (field: keyof T) => computed(() => !!errors.value[field as string])

  const validate = (data: unknown = form): data is T => {
    try {
      schema.parse(data)
      errors.value = {}
      isValid.value = true
      return true
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err: unknown) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
        errors.value = newErrors
      }
      isValid.value = false
      return false
    }
  }

  const validateField = (field: keyof T) => {
    try {
      const fieldSchema = (schema as any).pick({ [field]: true })
      fieldSchema.parse({ [field]: form[field] })
      delete errors.value[field as string]
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        errors.value[field as string] = error.issues[0]?.message || 'Ошибка валидации'
      }
    }
  }

  const getFieldError = (field: keyof T) => {
    return errors.value[field as string] || ''
  }

  const setFieldError = (field: keyof T, error: string) => {
    errors.value[field as string] = error
  }

  const clearFieldError = (field: keyof T) => {
    delete errors.value[field as string]
  }

  const clearAllErrors = () => {
    errors.value = {}
  }

  const reset = (newData?: Partial<T>) => {
    Object.keys(form).forEach(key => {
      delete form[key as keyof T]
    })
    
    if (newData) {
      Object.assign(form, newData)
    }
    
    clearAllErrors()
    isSubmitting.value = false
    isDirty.value = false
    isValid.value = false
  }

  const setFormData = (data: Partial<T>) => {
    Object.assign(form, data)
    isDirty.value = true
  }

  const getFormData = () => {
    return { ...form }
  }

  // Отслеживаем изменения формы
  watch(form, () => {
    isDirty.value = true
    // Валидируем форму при изменениях
    validate()
  }, { deep: true })

  return {
    form,
    errors: computed(() => errors.value),
    isSubmitting,
    isDirty,
    isValid,
    hasErrors,
    hasFieldError,
    validate,
    validateField,
    getFieldError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    reset,
    setFormData,
    getFormData
  }
}

// Composable для работы с формами с API
export function useFormApi<T>(
  schema: ZodSchema<T>,
  submitFn: (data: T) => Promise<any>,
  initialData?: Partial<T>
) {
  const form = useForm(schema, initialData)
  const { isSubmitting } = form

  const submit = async (): Promise<boolean> => {
    if (!form.validate()) {
      return false
    }

    try {
      isSubmitting.value = true
      await submitFn(form.getFormData())
      form.isDirty.value = false
      return true
    } catch (error) {
      console.error('Ошибка отправки формы:', error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    ...form,
    submit
  }
}

// Composable для работы с формами с валидацией в реальном времени
export function useReactiveForm<T>(
  schema: ZodSchema<T>,
  initialData?: Partial<T>
) {
  const form = useForm(schema, initialData)
  const { validateField } = form

  // Валидируем поле при изменении
  const watchField = (field: keyof T) => {
    return computed({
      get: () => form.form[field],
      set: (value) => {
        form.form[field] = value
        validateField(field)
      }
    })
  }

  return {
    ...form,
    watchField
  }
}

// Composable для работы с формами с debounced валидацией
export function useDebouncedForm<T>(
  schema: ZodSchema<T>,
  initialData?: Partial<T>,
  debounceMs: number = 300
) {
  const form = useForm(schema, initialData)
  let debounceTimer: number | null = null

  const debouncedValidate = (field: keyof T) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      form.validateField(field)
    }, debounceMs)
  }

  const watchFieldDebounced = (field: keyof T) => {
    return computed({
      get: () => form.form[field],
      set: (value) => {
        form.form[field] = value
        debouncedValidate(field)
      }
    })
  }

  return {
    ...form,
    watchFieldDebounced,
    debouncedValidate
  }
}