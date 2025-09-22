<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <div class="whatsapp-icon">
          <svg width="24" height="24" fill="#25D366" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </div>
        <span v-if="!collapsed">erp.ap.kz</span>
      </div>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link" :class="{ 'nav-link--collapsed': collapsed }">
            <i class="pi pi-home"></i>
            <span v-if="!collapsed">Панель управления</span>
          </router-link>
        </li>

        <!-- Показываем только для авторизованных пользователей -->
        <template v-if="authStore.isAuthenticated">
          <li class="nav-item">
            <router-link to="/chats" class="nav-link" :class="{ 'nav-link--collapsed': collapsed }">
              <i class="pi pi-comments"></i>
              <span v-if="!collapsed">Чаты</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/users" class="nav-link" :class="{ 'nav-link--collapsed': collapsed }">
              <i class="pi pi-users"></i>
              <span v-if="!collapsed">Пользователи</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/organizations" class="nav-link" :class="{ 'nav-link--collapsed': collapsed }">
              <i class="pi pi-building"></i>
              <span v-if="!collapsed">Организации</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link" :class="{ 'nav-link--collapsed': collapsed }">
              <i class="pi pi-user"></i>
              <span v-if="!collapsed">Профиль</span>
            </router-link>
          </li>
          <li class="nav-item nav-item--logout">
            <button class="nav-link nav-link--logout" :class="{ 'nav-link--collapsed': collapsed }" @click="handleLogout">
              <i class="pi pi-sign-out"></i>
              <span v-if="!collapsed">Выйти</span>
            </button>
          </li>
        </template>

        <!-- Показываем для неавторизованных пользователей -->
        <template v-else>
          <li class="nav-item">
            <router-link to="/login" class="nav-link" :class="{ 'nav-link--collapsed': collapsed }">
              <i class="pi pi-sign-in"></i>
              <span v-if="!collapsed">Войти</span>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
}

.sidebar--collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.logo i {
  font-size: 24px;
  color: #667eea;
}

.whatsapp-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.sidebar-toggle:hover {
  background: #f8f9fa;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #2c3e50;
}

.nav-link.router-link-active {
  background-color: #e3f2fd;
  color: #1976d2;
  border-right: 3px solid #1976d2;
}

.nav-link i {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.nav-link--collapsed {
  justify-content: center;
}

.nav-link--collapsed span {
  display: none;
}

.nav-item--logout {
  margin-top: auto;
  border-top: 1px solid #e9ecef;
  padding-top: 12px;
}

.nav-link--logout {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #dc3545;
}

.nav-link--logout:hover {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
