<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Mobile Overlay -->
    <div
      v-if="!sidebarCollapsed"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        'w-72',
        sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center gap-3 p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-lg">
          <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </div>
        <span class="text-base lg:text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          erp.ap.kz
        </span>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="p-2 lg:p-4">
        <ul class="space-y-1 lg:space-y-2">
          <!-- Панель управления -->
          <li>
            <router-link
              to="/admin"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/admin' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
            >
              <i class="pi pi-home text-base lg:text-lg"></i>
              <span class="font-medium">
                Панель управления
              </span>
            </router-link>
          </li>

          <!-- Группа: Компании -->
          <li class="pt-4">
            <button
              @click="toggleGroup('companies')"
              class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <span>Компании</span>
              <i :class="[
                'pi transition-transform duration-200',
                openGroups.companies ? 'pi-chevron-down' : 'pi-chevron-right'
              ]"></i>
            </button>
          </li>

          <!-- Элементы группы Компании -->
          <div v-if="openGroups.companies" class="ml-4 space-y-1">
            <li>
              <router-link
                to="/organizations"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/organizations' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-building text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Организации
                </span>
              </router-link>
            </li>


            <li>
              <router-link
                to="/departments"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/departments' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-sitemap text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Отделы
                </span>
              </router-link>
            </li>

            <li>
              <router-link
                to="/positions"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/positions' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-briefcase text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Должности
                </span>
              </router-link>
            </li>

            <li>
              <router-link
                to="/employees"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/employees' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-users text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Сотрудники
                </span>
              </router-link>
            </li>
          </div>


          <!-- Группа: Общение -->
          <li class="pt-4">
            <button
              @click="toggleGroup('communication')"
              class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
            >
              <span>Общение</span>
              <i :class="[
                'pi transition-transform duration-200',
                openGroups.communication ? 'pi-chevron-down' : 'pi-chevron-right'
              ]"></i>
            </button>
          </li>

          <!-- Элементы группы Общение -->
          <div v-if="!sidebarCollapsed && openGroups.communication" class="ml-4 space-y-1">
            <li>
              <router-link
                to="/chats"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/chats' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-comments text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Чаты
                </span>
              </router-link>
            </li>

            <li>
              <router-link
                to="/companies"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/companies' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-briefcase text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Компании
                </span>
              </router-link>
            </li>

            <li>
              <router-link
                to="/clients"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/clients' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-users text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Клиенты
                </span>
              </router-link>
            </li>

            <li>
              <router-link
                to="/templates"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/templates' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-file-edit text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Шаблоны ответов
                </span>
              </router-link>
            </li>

            <li>
              <router-link
                to="/roles"
                :class="[
                  'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
                  $route.path === '/roles' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
                ]"
              >
                <i class="pi pi-shield text-base lg:text-lg"></i>
                <span class="font-medium transition-opacity duration-300">
                  Роли
                </span>
              </router-link>
            </li>
          </div>

        </ul>
      </nav>
    </div>

    <!-- Main Content -->
    <div
      :class="[
        'flex-1 transition-all duration-300 chat-scrollbar',
        sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-72'
      ]"
    >
      <!-- Top Header -->
      <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div class="flex items-center gap-2 sm:gap-4">
            <Button
              icon="pi pi-bars"
              text
              rounded
              @click="toggleSidebar"
              class="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            />
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <h1 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                <slot name="title"></slot>
              </h1>
              <p v-if="$slots.subtitle" class="text-sm sm:text-base text-gray-600 dark:text-gray-300 hidden sm:block">
                <slot name="subtitle"></slot>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Переключатель темы -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              :title="isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'"
            >
              <i v-if="isDarkMode" class="pi pi-sun text-lg"></i>
              <i v-else class="pi pi-moon text-lg"></i>
            </button>

            <!-- Уведомления -->
            <div class="relative notifications-container">
              <button
                @click="toggleNotifications"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
                :title="'Уведомления'"
              >
                <i class="pi pi-bell text-lg"></i>
                <!-- Индикатор новых уведомлений -->
                <span
                  v-if="unreadNotificationsCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
                </span>
              </button>

              <!-- Выпадающее меню уведомлений -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Уведомления</h3>
                      <button
                        @click="markAllAsRead"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Отметить все как прочитанные
                      </button>
                    </div>
                  </div>

                  <div class="max-h-96 overflow-y-auto minimal-scrollbar">
                    <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                      Нет новых уведомлений
                    </div>

                    <div
                      v-for="notification in notifications"
                      :key="notification.id"
                      :class="[
                        'p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      ]"
                      @click="markAsRead(notification.id)"
                    >
                      <div class="flex items-start gap-3">
                        <div class="flex-shrink-0">
                          <div :class="[
                            'w-2 h-2 rounded-full mt-2',
                            !notification.is_read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                          ]"></div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ notification.title }}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {{ notification.message }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {{ formatTime(notification.created_at) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      @click="viewAllNotifications"
                      class="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Посмотреть все уведомления
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="relative user-menu-container">
              <Button
                :label="userStore.currentUser?.name || 'Пользователь'"
                icon="pi pi-user"
                text
                rounded
                @click="toggleUserMenu"
                class="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium text-sm sm:text-base"
              />

              <!-- Выпадающее меню пользователя -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                >
                <div class="py-1">
                  <button
                    @click="goToProfile"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i class="pi pi-user mr-3"></i>
                    Профиль
                  </button>
                  <div class="border-t border-gray-100 dark:border-gray-700"></div>
                  <button
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i class="pi pi-sign-out mr-3"></i>
                    Выйти
                  </button>
                </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="p-4 sm:p-6 lg:p-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/features/auth'
import { useUserStore } from '@/entities/user'
import { Button } from '@/shared/ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()

const sidebarCollapsed = ref(false)
const showUserMenu = ref(false)
const showNotifications = ref(false)

// Логика переключения темы
const isDarkMode = ref(false)

// Логика уведомлений
interface Notification {
  id: number
  title: string
  message: string
  type: 'message' | 'system' | 'warning' | 'info'
  is_read: boolean
  created_at: string
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'Новое сообщение',
    message: 'Айгуль Нурланова отправила сообщение в чате',
    type: 'message',
    is_read: false,
    created_at: '2024-01-20T16:45:00Z'
  },
  {
    id: 2,
    title: 'Новое сообщение',
    message: 'Марат Кенжебаев отправил сообщение в чате',
    type: 'message',
    is_read: false,
    created_at: '2024-01-20T16:30:00Z'
  },
  {
    id: 3,
    title: 'Системное уведомление',
    message: 'Обновление системы завершено успешно',
    type: 'system',
    is_read: true,
    created_at: '2024-01-20T15:00:00Z'
  },
  {
    id: 4,
    title: 'Новое сообщение',
    message: 'Асель Толеуова отправила сообщение в чате',
    type: 'message',
    is_read: true,
    created_at: '2024-01-20T14:15:00Z'
  }
])

const unreadNotificationsCount = computed(() =>
  notifications.value.filter(n => !n.is_read).length
)

// Инициализация темы из localStorage
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
}

const initSidebar = () => {
  const savedSidebarState = localStorage.getItem('sidebarCollapsed')
  if (savedSidebarState === 'true') {
    sidebarCollapsed.value = true
  } else {
    sidebarCollapsed.value = false
  }
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
}

// Методы для работы с уведомлениями
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    showUserMenu.value = false
  }
}

const markAsRead = (notificationId: number) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.is_read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.is_read = true
  })
}

const viewAllNotifications = () => {
  showNotifications.value = false
  // Здесь можно добавить переход на страницу всех уведомлений
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Только что'
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// Инициализируем тему при монтировании компонента
onMounted(() => {
  initTheme()
  initSidebar()

  // Закрываем меню при клике вне его
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu-container')) {
      showUserMenu.value = false
    }
    if (!target.closest('.notifications-container')) {
      showNotifications.value = false
    }
  })
})

// Состояние открытых групп
const openGroups = ref({
  companies: false,
  communication: false
})

// Определяем, какие группы должны быть открыты на основе текущего маршрута
const companyRoutes = ['/organizations', '/departments', '/positions', '/employees']
const communicationRoutes = ['/chats', '/templates']

// Инициализируем открытые группы на основе текущего маршрута
const initializeOpenGroups = () => {
  if (companyRoutes.includes(route.path)) {
    openGroups.value.companies = true
  }
  if (communicationRoutes.includes(route.path)) {
    openGroups.value.communication = true
  }
}

// Вызываем инициализацию при создании компонента
initializeOpenGroups()

// Отслеживаем изменения маршрута
router.afterEach((to) => {
  if (companyRoutes.includes(to.path)) {
    openGroups.value.companies = true
  }
  if (communicationRoutes.includes(to.path)) {
    openGroups.value.communication = true
  }
})

const toggleGroup = (groupName: keyof typeof openGroups.value) => {
  openGroups.value[groupName] = !openGroups.value[groupName]
}


const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  // Сохраняем состояние сайдбара в localStorage
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
}

const closeSidebar = () => {
  sidebarCollapsed.value = true
  localStorage.setItem('sidebarCollapsed', 'true')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const goToProfile = () => {
  showUserMenu.value = false
  router.push('/profile')
}

const handleLogout = async () => {
  try {
    showUserMenu.value = false

    await authStore.logout()

    // Перенаправляем на страницу входа
    await router.push('/login')

    // Принудительное обновление страницы для очистки состояния
    window.location.reload()
  } catch (error) {
    // Даже при ошибке перенаправляем на страницу входа
    await router.push('/login')
    window.location.reload()
  }
}
</script>

<style scoped>
/* Все стили теперь в Tailwind CSS */

/* Стили для меню пользователя */
:deep(.p-menu.p-menu-overlay.user-menu-dropdown) {
  margin-top: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  min-width: 200px;
  z-index: 1000;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown) {
  background: #1f2937;
  border-color: #374151;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menu-list) {
  padding: 8px;
  background: white;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menu-list) {
  background: #1f2937;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem) {
  border-radius: 6px;
  margin-bottom: 4px;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem:last-child) {
  margin-bottom: 0;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:hover) {
  background-color: #f3f4f6;
  color: #111827;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link) {
  color: #d1d5db;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:hover) {
  background-color: #374151;
  color: #f9fafb;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link .p-menuitem-icon) {
  color: #6b7280;
  font-size: 14px;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:hover .p-menuitem-icon) {
  color: #374151;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link .p-menuitem-icon) {
  color: #9ca3af;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:hover .p-menuitem-icon) {
  color: #d1d5db;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menu-separator) {
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
  height: 1px;
  background: #e5e7eb;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menu-separator) {
  border-color: #374151;
  background: #374151;
}

/* Стили для активного состояния */
:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:focus) {
  background-color: #dbeafe;
  color: #1e40af;
  outline: none;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:focus) {
  background-color: #1e3a8a;
  color: #93c5fd;
}

:deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:focus .p-menuitem-icon) {
  color: #1e40af;
}

.dark :deep(.p-menu.p-menu-overlay.user-menu-dropdown .p-menuitem-link:focus .p-menuitem-icon) {
  color: #93c5fd;
}
</style>
