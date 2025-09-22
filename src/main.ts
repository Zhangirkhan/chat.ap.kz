import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'
import App from './app/providers/AppProvider.vue'
import router from './app/router'
import { apiClient } from '@/shared/api/client'
import { useAuthStore } from '@/features/auth'
import { phoneMask } from '@/shared/directives/phoneMask'
import { emailMask } from '@/shared/directives/emailMask'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

// Глобальная директива маски телефона
app.directive('phone', phoneMask as any)
// Глобальная директива маски email
app.directive('email', emailMask as any)

// Инициализация токена из localStorage
const token = localStorage.getItem('token')
if (token) {
  apiClient.setToken(token)
}

// Инициализация authStore для синхронизации состояния
useAuthStore()

app.mount('#app')
