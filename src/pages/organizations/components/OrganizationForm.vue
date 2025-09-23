<template>
  <div class="space-y-6">
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
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Телефон *
        </label>
        <input
          v-model="form.phone"
          type="tel"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="+7 (777) 123-45-67"
        />
        <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
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

    <div class="flex items-center">
      <input
        v-model="form.is_active"
        type="checkbox"
        id="is_active"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
      />
      <label for="is_active" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
        Организация активна
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { organizationValidationSchema } from '@/shared/lib/validation'
import type { Organization } from '@/shared/lib/types'

interface Props {
  mode: 'create' | 'edit'
  organization?: Organization | null
}

interface Emits {
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  organization: null
})

const emit = defineEmits<Emits>()

const form = reactive({
  name: '',
  phone: '',
  description: '',
  is_active: true
})

const errors = reactive({
  name: '',
  phone: '',
  description: ''
})

const validateForm = () => {
  const result = organizationValidationSchema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach((issue: unknown) => {
      const field = issue.path[0] as string
      errors[field as keyof typeof errors] = issue.message
    })
    return false
  }
  return true
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...form })
  }
}

watch(() => props.organization, (newOrg) => {
  if (newOrg) {
    Object.assign(form, {
      name: newOrg.name || '',
      phone: newOrg.phone || '',
      description: newOrg.description || '',
      is_active: newOrg.is_active ?? true
    })
  }
}, { immediate: true })

// Экспортируем метод для родительского компонента
defineExpose({
  handleSubmit
})
</script>
