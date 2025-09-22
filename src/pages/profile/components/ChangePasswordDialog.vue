<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Изменить пароль
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
        <!-- Текущий пароль -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Текущий пароль *
          </label>
          <div class="relative">
            <input
              v-model="form.current_password"
              :type="showCurrentPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': errors.current_password }"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i :class="showCurrentPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="errors.current_password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.current_password }}
          </p>
        </div>

        <!-- Новый пароль -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Новый пароль *
          </label>
          <div class="relative">
            <input
              v-model="form.new_password"
              :type="showNewPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': errors.new_password }"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="errors.new_password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.new_password }}
          </p>
          <!-- Индикатор силы пароля -->
          <div v-if="form.new_password" class="mt-2">
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="passwordStrength.color"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">
                {{ passwordStrength.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Подтверждение пароля -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Подтвердите новый пароль *
          </label>
          <div class="relative">
            <input
              v-model="form.new_password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': errors.new_password_confirmation }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="errors.new_password_confirmation" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.new_password_confirmation }}
          </p>
        </div>

        <!-- Требования к паролю -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Требования к паролю:
          </h4>
          <ul class="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li class="flex items-center gap-2">
              <i :class="passwordRequirements.length ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
              Минимум 8 символов
            </li>
            <li class="flex items-center gap-2">
              <i :class="passwordRequirements.uppercase ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
              Заглавная буква
            </li>
            <li class="flex items-center gap-2">
              <i :class="passwordRequirements.lowercase ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
              Строчная буква
            </li>
            <li class="flex items-center gap-2">
              <i :class="passwordRequirements.number ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
              Цифра
            </li>
            <li class="flex items-center gap-2">
              <i :class="passwordRequirements.special ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
              Специальный символ
            </li>
          </ul>
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
            :disabled="loading || !isFormValid"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-check"></i>
            {{ loading ? 'Изменение...' : 'Изменить пароль' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface Emits {
  (e: 'close'): void
  (e: 'save', data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string
  }): void
}

const emit = defineEmits<Emits>()

const loading = ref(false)

const form = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const errors = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

// Видимость паролей
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Требования к паролю
const passwordRequirements = computed(() => {
  const password = form.new_password
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

// Сила пароля
const passwordStrength = computed(() => {
  const requirements = passwordRequirements.value
  const validCount = Object.values(requirements).filter(Boolean).length

  if (validCount < 2) {
    return { width: '25%', color: 'bg-red-500', text: 'Слабый' }
  } else if (validCount < 4) {
    return { width: '50%', color: 'bg-yellow-500', text: 'Средний' }
  } else if (validCount < 5) {
    return { width: '75%', color: 'bg-blue-500', text: 'Хороший' }
  } else {
    return { width: '100%', color: 'bg-green-500', text: 'Отличный' }
  }
})

// Валидность формы
const isFormValid = computed(() => {
  const requirements = passwordRequirements.value
  const allRequirementsMet = Object.values(requirements).every(Boolean)
  const passwordsMatch = form.new_password === form.new_password_confirmation

  return form.current_password &&
         form.new_password &&
         form.new_password_confirmation &&
         allRequirementsMet &&
         passwordsMatch
})

// Валидация формы
const validateForm = () => {
  errors.current_password = ''
  errors.new_password = ''
  errors.new_password_confirmation = ''

  if (!form.current_password) {
    errors.current_password = 'Введите текущий пароль'
  }

  if (!form.new_password) {
    errors.new_password = 'Введите новый пароль'
  } else {
    const requirements = passwordRequirements.value
    if (!requirements.length) {
      errors.new_password = 'Пароль должен содержать минимум 8 символов'
    } else if (!requirements.uppercase) {
      errors.new_password = 'Пароль должен содержать заглавную букву'
    } else if (!requirements.lowercase) {
      errors.new_password = 'Пароль должен содержать строчную букву'
    } else if (!requirements.number) {
      errors.new_password = 'Пароль должен содержать цифру'
    } else if (!requirements.special) {
      errors.new_password = 'Пароль должен содержать специальный символ'
    }
  }

  if (!form.new_password_confirmation) {
    errors.new_password_confirmation = 'Подтвердите новый пароль'
  } else if (form.new_password !== form.new_password_confirmation) {
    errors.new_password_confirmation = 'Пароли не совпадают'
  }

  return !errors.current_password && !errors.new_password && !errors.new_password_confirmation
}

// Обработка отправки формы
const handleSubmit = () => {
  if (!validateForm()) return

  loading.value = true

  const passwordData = {
    current_password: form.current_password,
    new_password: form.new_password,
    new_password_confirmation: form.new_password_confirmation
  }

  emit('save', passwordData)

  // Сброс состояния загрузки через небольшую задержку
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>
