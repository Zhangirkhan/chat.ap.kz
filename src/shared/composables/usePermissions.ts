import { computed } from 'vue'
import { useAuthStore } from '@/features/auth'

/**
 * Composable для работы с разрешениями пользователя
 * Реализует лучшие практики для проверки доступа
 */
export function usePermissions() {
  const authStore = useAuthStore()

  // Проверка разрешения
  const hasPermission = (permission: string): boolean => {
    if (!authStore.user) return false

    // Супер-админ имеет все разрешения
    if (authStore.hasRole('super_admin') || authStore.hasPermission('*')) {
      return true
    }

    return authStore.hasPermission(permission)
  }

  // Проверка роли
  const hasRole = (role: string): boolean => {
    if (!authStore.user) return false
    return authStore.hasRole(role)
  }

  // Проверка множественных разрешений (все должны быть)
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  // Проверка множественных разрешений (любое из них)
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  // Проверка множественных ролей (любая из них)
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  // Проверка доступа к модулю
  const canAccessModule = (module: string): boolean => {
    const modulePermissions = {
      users: ['users.view', 'users.create', 'users.edit', 'users.delete'],
      organizations: ['organizations.view', 'organizations.create', 'organizations.edit', 'organizations.delete'],
      departments: ['departments.view', 'departments.create', 'departments.edit', 'departments.delete'],
      positions: ['positions.view', 'positions.create', 'positions.edit', 'positions.delete'],
      roles: ['roles.view', 'roles.create', 'roles.edit', 'roles.delete'],
      chats: ['chats.view', 'chats.create', 'chats.edit', 'chats.delete'],
      contractors: ['contractors.view', 'contractors.create', 'contractors.edit', 'contractors.delete'],
      templates: ['templates.view', 'templates.create', 'templates.edit', 'templates.delete'],
      broadcasts: ['broadcasts.view', 'broadcasts.create', 'broadcasts.edit', 'broadcasts.delete'],
      reports: ['reports.view', 'reports.export'],
      settings: ['settings.view', 'settings.edit']
    }

    const permissions = modulePermissions[module as keyof typeof modulePermissions]
    if (!permissions) return false

    return hasAnyPermission(permissions)
  }

  // Проверка доступа к действию
  const canPerformAction = (module: string, action: string): boolean => {
    const permission = `${module}.${action}`
    return hasPermission(permission)
  }

  // Получение доступных модулей
  const availableModules = computed(() => {
    const modules = [
      'users', 'organizations', 'departments', 'positions', 'roles',
      'chats', 'contractors', 'templates', 'broadcasts',
      'reports', 'settings'
    ]

    return modules.filter(module => canAccessModule(module))
  })

  // Проверка административных прав
  const isAdmin = computed(() => {
    return hasAnyRole(['super_admin', 'admin'])
  })

  // Проверка прав модератора
  const isModerator = computed(() => {
    return hasAnyRole(['super_admin', 'admin', 'manager'])
  })

  // Проверка прав оператора
  const isOperator = computed(() => {
    return hasAnyRole(['super_admin', 'admin', 'manager', 'operator'])
  })

  return {
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAnyPermission,
    hasAnyRole,
    canAccessModule,
    canPerformAction,
    availableModules,
    isAdmin,
    isModerator,
    isOperator
  }
}
