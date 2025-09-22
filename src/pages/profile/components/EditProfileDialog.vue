<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Редактировать профиль
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Форма -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Имя -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Имя *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.name }}
          </p>
        </div>

        <!-- Телефон -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Телефон
          </label>
          <input
            v-model="form.phone"
            v-phone
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': errors.phone }"
            placeholder="8 777 123 45 67"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Должность -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Должность
          </label>
          <input
            v-model="form.position"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': errors.position }"
          />
          <p v-if="errors.position" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.position }}
          </p>
        </div>

        <!-- Email (только для чтения) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            :value="user?.email"
            type="email"
            disabled
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Email нельзя изменить
          </p>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-check"></i>
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { User } from '@/features/auth'

interface Props {
  user: User | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: { name?: string; phone?: string; position?: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const form = reactive({
  name: '',
  phone: '',
  position: ''
})

const errors = reactive({
  name: '',
  phone: '',
  position: ''
})

// Инициализация формы данными пользователя
watch(() => props.user, (user) => {
  if (user) {
    form.name = user.name || ''
    form.phone = user.phone || ''
    form.position = user.position || ''
  }
}, { immediate: true })

// Валидация формы
const validateForm = () => {
  errors.name = ''
  errors.phone = ''
  errors.position = ''

  if (!form.name.trim()) {
    errors.name = 'Имя обязательно для заполнения'
  }

  if (form.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(form.phone)) {
    errors.phone = 'Введите корректный номер телефона'
  }

  return !errors.name && !errors.phone && !errors.position
}

// Обработка отправки формы
const handleSubmit = () => {
  if (!validateForm()) return

  loading.value = true

  const profileData = {
    name: form.name.trim(),
    phone: form.phone.trim() || undefined,
    position: form.position.trim() || undefined
  }

  emit('save', profileData)

  // Сброс состояния загрузки через небольшую задержку
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>
