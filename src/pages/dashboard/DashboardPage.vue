<template>
  <AdminLayout>
    <template #title>Dashboard</template>
    <template #subtitle v-if="authStore.isAuthenticated">Ваша персональная панель управления</template>

    <div class="space-y-8">
      <!-- Приветствие -->
      <div v-if="authStore.isAuthenticated" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transition-colors duration-300">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Добро пожаловать, {{ authStore.user?.name || 'Администратор' }}!
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">Ваша персональная панель управления</p>

        <!-- Информация о пользователе -->
        <div v-if="authStore.user" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
              <p class="text-gray-900 dark:text-white">{{ authStore.user.email }}</p>
            </div>
            <div v-if="authStore.user.phone">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Телефон:</span>
              <p class="text-gray-900 dark:text-white">{{ authStore.user.phone }}</p>
            </div>
            <div v-if="authStore.user.position">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Должность:</span>
              <p class="text-gray-900 dark:text-white">{{ authStore.user.position }}</p>
            </div>
            <div v-if="authStore.user.organization">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Организация:</span>
              <p class="text-gray-900 dark:text-white">{{ authStore.user.organization.name }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Роль:</span>
              <p class="text-gray-900 dark:text-white">{{ authStore.user.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Моя активность -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Моя активность</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-comments text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Мои сообщения</div>
          </div>

          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-comments text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Мои чаты</div>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-clock text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Активные чаты</div>
          </div>

          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-comments text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Мессенджер чаты</div>
          </div>
        </div>
      </div>

      <!-- Мои недавние чаты -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Мои недавние чаты</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">Чаты, которые вы ведете</p>
        <div class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400 mb-4">У вас пока нет активных чатов</div>
          <button
            @click="$router.push('/chats')"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Перейти к чатам
          </button>
        </div>
      </div>

      <!-- Мои недавние сообщения -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Мои недавние сообщения</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">Последние отправленные сообщения</p>
        <div class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400">У вас пока нет отправленных сообщений</div>
        </div>
      </div>

      <!-- Общая статистика системы -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Общая статистика системы</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-users text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Всего пользователей</div>
          </div>

          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-building text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Организаций</div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-comments text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Всего сообщений</div>
          </div>

          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-comments text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Активные чаты</div>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center transition-colors duration-300">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-clock text-white text-xl"></i>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Мессенджер чаты</div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'
import { useToast } from 'primevue/usetoast'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

onMounted(() => {

  // Показываем уведомление об успешном входе
  if (authStore.isAuthenticated && authStore.user) {
    toast.add({
      severity: 'success',
      summary: 'Добро пожаловать!',
      detail: `Вы успешно вошли в систему как ${authStore.user.name}`,
      life: 3000
    })
  } else {
    // Если пользователь не аутентифицирован, перенаправляем на главную
    router.push('/')
  }
})
</script>

<style scoped>
/* Все стили теперь в Tailwind CSS */
</style>
