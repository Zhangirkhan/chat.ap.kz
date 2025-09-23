import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface NavigationItem {
  to: string
  label: string
  icon: string
  group?: string
}

export function useNavigation() {
  const route = useRoute()

  const navigationItems = computed(() => [
    // Панель управления
    {
      to: '/admin',
      label: 'Панель управления',
      icon: 'pi pi-home',
      group: 'main'
    },
    // Компании
    {
      to: '/organizations',
      label: 'Организации',
      icon: 'pi pi-building',
      group: 'companies'
    },
    {
      to: '/departments',
      label: 'Отделы',
      icon: 'pi pi-sitemap',
      group: 'companies'
    },
    {
      to: '/positions',
      label: 'Должности',
      icon: 'pi pi-briefcase',
      group: 'companies'
    },
    {
      to: '/employees',
      label: 'Сотрудники',
      icon: 'pi pi-users',
      group: 'companies'
    },
    // Общение
    {
      to: '/chats',
      label: 'Чаты',
      icon: 'pi pi-comments',
      group: 'communication'
    },
    {
      to: '/companies',
      label: 'Компании',
      icon: 'pi pi-briefcase',
      group: 'communication'
    },
    {
      to: '/clients',
      label: 'Клиенты',
      icon: 'pi pi-users',
      group: 'communication'
    },
    {
      to: '/templates',
      label: 'Шаблоны ответов',
      icon: 'pi pi-file-edit',
      group: 'communication'
    },
    {
      to: '/roles',
      label: 'Роли',
      icon: 'pi pi-shield',
      group: 'communication'
    }
  ])

  const getActiveClasses = (item: NavigationItem) => {
    const isActive = route.path === item.to
    return [
      'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group text-sm lg:text-base',
      isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600' : ''
    ]
  }

  const getGroupItems = (groupName: string) => {
    return navigationItems.value.filter(item => item.group === groupName)
  }

  const isRouteActive = (path: string) => {
    return route.path === path
  }

  return {
    navigationItems,
    getActiveClasses,
    getGroupItems,
    isRouteActive
  }
}
