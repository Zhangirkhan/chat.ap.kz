import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'

export function useUserMenu() {
  const router = useRouter()
  const authStore = useAuthStore()
  const showUserMenu = ref(false)

  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
  }

  const closeUserMenu = () => {
    showUserMenu.value = false
  }

  const goToProfile = () => {
    showUserMenu.value = false
    router.push('/profile')
  }

  const handleLogout = async () => {
    try {
      showUserMenu.value = false
      await authStore.logout()
      await router.push('/login')
      // Принудительное обновление страницы для очистки состояния
      window.location.reload()
    } catch (error) {
      // Даже при ошибке перенаправляем на страницу входа
      await router.push('/login')
      window.location.reload()
    }
  }

  const setupClickOutside = () => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-menu-container')) {
        showUserMenu.value = false
      }
    }

    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }

  onMounted(() => {
    const cleanup = setupClickOutside()
    onUnmounted(cleanup)
  })

  return {
    showUserMenu,
    toggleUserMenu,
    closeUserMenu,
    goToProfile,
    handleLogout
  }
}
