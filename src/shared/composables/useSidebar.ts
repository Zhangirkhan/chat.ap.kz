import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useSidebar() {
  const route = useRoute()
  const router = useRouter()
  const sidebarCollapsed = ref(false)
  const openGroups = ref({
    companies: false,
    communication: false
  })

  // Определяем, какие группы должны быть открыты на основе текущего маршрута
  const companyRoutes = ['/organizations', '/departments', '/positions', '/employees']
  const communicationRoutes = ['/chats', '/templates', '/companies', '/clients', '/roles']

  const initSidebar = () => {
    // Загружаем состояние сайдбара из localStorage
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      sidebarCollapsed.value = savedState === 'true'
    }
  }

  const initializeOpenGroups = () => {
    if (companyRoutes.includes(route.path)) {
      openGroups.value.companies = true
    }
    if (communicationRoutes.includes(route.path)) {
      openGroups.value.communication = true
    }
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
  }

  const closeSidebar = () => {
    sidebarCollapsed.value = true
    localStorage.setItem('sidebarCollapsed', 'true')
  }

  const toggleGroup = (groupName: keyof typeof openGroups.value) => {
    openGroups.value[groupName] = !openGroups.value[groupName]
  }

  // Отслеживаем изменения маршрута
  const setupRouteWatcher = () => {
    router.afterEach((to) => {
      if (companyRoutes.includes(to.path)) {
        openGroups.value.companies = true
      }
      if (communicationRoutes.includes(to.path)) {
        openGroups.value.communication = true
      }
    })
  }

  onMounted(() => {
    initSidebar()
    initializeOpenGroups()
    setupRouteWatcher()
  })

  return {
    sidebarCollapsed,
    openGroups,
    toggleSidebar,
    closeSidebar,
    toggleGroup
  }
}
