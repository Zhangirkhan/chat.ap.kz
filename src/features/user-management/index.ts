// Публичный API фичи user-management
export { default as UserForm } from './ui/UserForm.vue'
export { default as UserList } from './ui/UserList.vue'
export { default as UserCard } from './ui/UserCard.vue'

// Экспорт типов
export type { User, UserFormData, UserRole } from './model/types'

// Экспорт хуков
export { useUserForm } from './model/useUserForm'

// Экспорт констант
export { roleOptions } from './lib/constants'
