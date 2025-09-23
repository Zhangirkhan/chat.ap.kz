<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="header-title">
          <slot name="title">Админ панель</slot>
        </h1>
        <p v-if="$slots.subtitle" class="header-subtitle">
          <slot name="subtitle" />
        </p>
      </div>

      <div class="header-right">
        <div class="user-menu">
          <button class="user-button" @click="toggleUserMenu">
            <i class="pi pi-user"></i>
            <span>{{ authStore.user?.name || 'Пользователь' }}</span>
            <i class="pi pi-chevron-down"></i>
          </button>

          <div v-if="showUserMenu" class="user-dropdown">
            <router-link to="/profile" class="dropdown-item">
              <i class="pi pi-user"></i>
              Профиль
            </router-link>
            <button class="dropdown-item" @click="handleLogout">
              <i class="pi pi-sign-out"></i>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}

// Закрытие меню при клике вне его
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showUserMenu.value = false
  }
})
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  flex: 1;
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.header-subtitle {
  margin: 4px 0 0 0;
  color: #7f8c8d;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #2c3e50;
  font-weight: 500;
}

.user-button:hover {
  background: #e9ecef;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #2c3e50;
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item:first-child {
  border-radius: 6px 6px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 6px 6px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 16px 20px;
  }

  .header-title {
    font-size: 20px;
  }

  .user-button span {
    display: none;
  }
}
</style>
