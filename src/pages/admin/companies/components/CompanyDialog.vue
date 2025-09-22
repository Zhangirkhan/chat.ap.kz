<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Редактировать компанию' : 'Добавить компанию' }}
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
              Название компании *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите название компании"
            />
            <div v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.name }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите email"
            />
            <div v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.email }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон
            </label>
            <input
              v-model="form.phone"
              type="tel"
              @input="formatPhone"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+7 (___) ___-__-__"
            />
            <div v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.phone }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Активна</option>
              <option value="inactive">Неактивна</option>
              <option value="blocked">Заблокирована</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Адрес
          </label>
          <input
            v-model="form.address"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Введите адрес"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Описание
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Введите описание компании"
          ></textarea>
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
import type { Organization, CreateOrganizationData, UpdateOrganizationData } from '@/shared/lib/types'

const props = defineProps<{
  company?: Organization | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: CreateOrganizationData | UpdateOrganizationData]
}>()

const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  status: 'active' as 'active' | 'inactive' | 'blocked'
})

const errors = reactive({
  name: '',
  email: '',
  phone: ''
})

// Форматирование номера телефона
const formatPhone = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')

  if (value.startsWith('8')) {
    value = '7' + value.slice(1)
  }

  if (value.startsWith('7')) {
    value = value.slice(1)
  }

  if (value.length > 10) {
    value = value.slice(0, 10)
  }

  let formatted = '+7'
  if (value.length > 0) {
    formatted += ' (' + value.slice(0, 3)
  }
  if (value.length > 3) {
    formatted += ') ' + value.slice(3, 6)
  }
  if (value.length > 6) {
    formatted += '-' + value.slice(6, 8)
  }
  if (value.length > 8) {
    formatted += '-' + value.slice(8, 10)
  }

  target.value = formatted
  form.phone = formatted
}

// Валидация формы
const validateForm = () => {
  // Очищаем предыдущие ошибки
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Название компании обязательно'
    isValid = false
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  }

  if (form.phone) {
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith('7')) {
      errors.phone = 'Введите корректный номер телефона'
      isValid = false
    }
  }

  return isValid
}

// Инициализация формы
const initForm = () => {
  if (props.company) {
    Object.assign(form, {
      name: props.company.name || '',
      email: props.company.email || '',
      phone: props.company.phone || '',
      address: props.company.address || '',
      description: props.company.description || '',
      status: props.company.status || 'active'
    })
  } else {
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      status: 'active'
    })
  }
}

// Отправка формы
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const companyData = {
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.replace(/\D/g, '') || undefined,
      address: form.address.trim() || undefined,
      description: form.description.trim() || undefined,
      status: form.status
    }

    emit('save', companyData)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Следим за изменениями company
watch(() => props.company, initForm, { immediate: true })

onMounted(() => {
  initForm()
})
</script>
