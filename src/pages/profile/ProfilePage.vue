<template>
  <AdminLayout>
    <template #title>Профиль пользователя</template>
    <template #subtitle>Управление личными данными и настройками</template>

    <div class="space-y-6">
      <!-- Информация о пользователе -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Личная информация</h2>
          <button
            @click="showEditProfile = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i class="pi pi-pencil"></i>
            Редактировать
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Имя</label>
            <p class="text-gray-900 dark:text-white">{{ authStore.user?.name || 'Не указано' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <p class="text-gray-900 dark:text-white">{{ authStore.user?.email || 'Не указано' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Телефон</label>
            <p class="text-gray-900 dark:text-white">{{ authStore.user?.phone || 'Не указано' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Должность</label>
            <p class="text-gray-900 dark:text-white">{{ authStore.user?.position || 'Не указано' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Роль</label>
            <p class="text-gray-900 dark:text-white">{{ authStore.user?.role || 'Пользователь' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Организация</label>
            <p class="text-gray-900 dark:text-white">{{ authStore.user?.organization?.name || 'Не указано' }}</p>
          </div>
        </div>
      </div>

      <!-- Настройки аккаунта -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Настройки аккаунта</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Уведомления по email</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Получать уведомления о новых сообщениях</p>
            </div>
            <button
              @click="toggleEmailNotifications"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="emailNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                :class="emailNotifications ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Темная тема</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Использовать темную тему интерфейса</p>
            </div>
            <button
              @click="toggleTheme"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="isDarkMode ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                :class="isDarkMode ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Безопасность -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Безопасность</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Пароль</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Последнее изменение: {{ formatDate(lastPasswordChange) }}</p>
            </div>
            <button
              @click="showChangePassword = true"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <i class="pi pi-key"></i>
              Изменить пароль
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Двухфакторная аутентификация</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Дополнительная защита аккаунта</p>
            </div>
            <button
              @click="toggle2FA"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                :class="twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Действия</h2>
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <i class="pi pi-sign-out"></i>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования профиля -->
    <EditProfileDialog
      v-if="showEditProfile"
      :user="authStore.user"
      @close="showEditProfile = false"
      @save="handleProfileUpdate"
    />

    <!-- Модальное окно изменения пароля -->
    <ChangePasswordDialog
      v-if="showChangePassword"
      @close="showChangePassword = false"
      @save="handlePasswordChange"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import EditProfileDialog from './components/EditProfileDialog.vue'
import ChangePasswordDialog from './components/ChangePasswordDialog.vue'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Состояние модальных окон
const showEditProfile = ref(false)
const showChangePassword = ref(false)

// Настройки пользователя
const isDarkMode = ref(false)
const emailNotifications = ref(true)
const twoFactorEnabled = ref(false)
const lastPasswordChange = ref<string | null>(null)

// Проверка аутентификации
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Форматирование даты
const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'Не указано'
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Переключение темы
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }

  toast.add({
    severity: 'success',
    summary: 'Настройки сохранены',
    detail: `Тема изменена на ${isDarkMode.value ? 'темную' : 'светлую'}`,
    life: 3000
  })
}

// Переключение уведомлений
const toggleEmailNotifications = () => {
  emailNotifications.value = !emailNotifications.value
  localStorage.setItem('emailNotifications', emailNotifications.value.toString())

  toast.add({
    severity: 'success',
    summary: 'Настройки сохранены',
    detail: `Email уведомления ${emailNotifications.value ? 'включены' : 'отключены'}`,
    life: 3000
  })
}

// Переключение 2FA
const toggle2FA = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  localStorage.setItem('twoFactorEnabled', twoFactorEnabled.value.toString())

  toast.add({
    severity: 'success',
    summary: 'Настройки сохранены',
    detail: `Двухфакторная аутентификация ${twoFactorEnabled.value ? 'включена' : 'отключена'}`,
    life: 3000
  })
}

// Обновление профиля
const handleProfileUpdate = async (profileData: { name?: string; phone?: string; position?: string }) => {
  try {
    const result = await authStore.updateProfile(profileData)

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Профиль обновлен',
        detail: 'Ваши данные успешно сохранены',
        life: 4000
      })
      showEditProfile.value = false
    } else {
      toast.add({
        severity: 'error',
        summary: 'Ошибка обновления',
        detail: result.error || 'Не удалось обновить профиль',
        life: 5000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка обновления',
      detail: 'Произошла ошибка при обновлении профиля',
      life: 5000
    })
  }
}

// Изменение пароля
const handlePasswordChange = async (passwordData: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string
}) => {
  try {
    const result = await authStore.changePassword(passwordData)

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Пароль изменен',
        detail: 'Ваш пароль успешно обновлен',
        life: 4000
      })
      showChangePassword.value = false
      lastPasswordChange.value = new Date().toISOString()
      localStorage.setItem('lastPasswordChange', lastPasswordChange.value)
    } else {
      toast.add({
        severity: 'error',
        summary: 'Ошибка изменения пароля',
        detail: result.error || 'Не удалось изменить пароль',
        life: 5000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка изменения пароля',
      detail: 'Произошла ошибка при изменении пароля',
      life: 5000
    })
  }
}

// Выход из системы
const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.add({
      severity: 'info',
      summary: 'Выход выполнен',
      detail: 'Вы успешно вышли из системы',
      life: 3000
    })
    router.push('/')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка выхода',
      detail: 'Произошла ошибка при выходе из системы',
      life: 5000
    })
  }
}

// Инициализация при монтировании
onMounted(async () => {
  // Проверяем аутентификацию
  if (!isAuthenticated.value) {
    router.push('/')
    return
  }

  // Загружаем данные пользователя если их нет
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser(true) // silent = true
  }

  // Инициализируем настройки из localStorage
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'

  const savedEmailNotifications = localStorage.getItem('emailNotifications')
  emailNotifications.value = savedEmailNotifications !== 'false'

  const saved2FA = localStorage.getItem('twoFactorEnabled')
  twoFactorEnabled.value = saved2FA === 'true'

  const savedLastPasswordChange = localStorage.getItem('lastPasswordChange')
  lastPasswordChange.value = savedLastPasswordChange
})
</script>
