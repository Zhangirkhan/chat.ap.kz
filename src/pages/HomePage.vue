<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-5">
    <div class="w-full max-w-md">
      <!-- Логотип и заголовок -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-3">ERP.AP.KZ</h1>
        <p class="text-lg text-gray-600">Система корпоративного общения</p>
      </div>

      <!-- Форма входа -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Вход в систему</h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Email
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Введите email"
              :class="[
                'block w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg',
                errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              ]"
              @input="clearError"
              required
            />
            <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Пароль
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              :class="[
                'block w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg',
                errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              ]"
              @input="clearError"
              required
            />
            <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Вход...
            </span>
            <span v-else>Войти в систему</span>
          </button>

          <!-- Сообщение об ошибке -->
          <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-lg text-center border-2 border-red-200">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ errorMessage }}
            </div>
          </div>
        </form>

      </div>

      <!-- Футер -->
      <div class="text-center mt-8 text-gray-600">
        <div class="text-sm">© 2025 ERP.AP.KZ</div>
        <div class="text-xs mt-1">Система корпоративного общения</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')

// Очистка ошибки при изменении полей
const clearError = () => {
  errorMessage.value = ''
  errors.email = ''
  errors.password = ''
}


const validateForm = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email обязателен'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Некорректный email'
  }

  if (!form.password) {
    errors.password = 'Пароль обязателен'
  }

  return !errors.email && !errors.password
}

const handleLogin = async () => {
  if (!validateForm()) return

  errorMessage.value = ''

  try {
    const result = await authStore.login(form.email, form.password)

    if (result.success) {
      // Перенаправляем на dashboard
      await router.push('/dashboard')
    } else {
      // Показываем ошибку после кнопки входа
      if (result.error?.includes('credentials') || result.error?.includes('неверные')) {
        errorMessage.value = 'Неверный email или пароль'
      } else if (result.error?.includes('email')) {
        errorMessage.value = 'Пользователь с таким email не найден'
      } else if (result.error?.includes('password')) {
        errorMessage.value = 'Неверный пароль'
      } else {
        errorMessage.value = result.error || 'Ошибка входа в систему'
      }
    }
  } catch {
    errorMessage.value = 'Ошибка входа в систему'
  }
}
</script>

<style scoped>
/* Все стили в Tailwind CSS */
</style>
