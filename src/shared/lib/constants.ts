/**
 * Константы приложения
 */

// Роли пользователей
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  USER: 'user'
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Администратор',
  [USER_ROLES.SUPERVISOR]: 'Руководитель',
  [USER_ROLES.MANAGER]: 'Менеджер',
  [USER_ROLES.OPERATOR]: 'Оператор',
  [USER_ROLES.USER]: 'Пользователь'
} as const

// Статусы пользователей
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked'
} as const

export const USER_STATUS_LABELS = {
  [USER_STATUSES.ACTIVE]: 'Активный',
  [USER_STATUSES.INACTIVE]: 'Неактивный',
  [USER_STATUSES.BLOCKED]: 'Заблокирован'
} as const

// Статусы чатов
export const CHAT_STATUSES = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  TRANSFERRED: 'transferred'
} as const

export const CHAT_STATUS_LABELS = {
  [CHAT_STATUSES.ACTIVE]: 'Активный',
  [CHAT_STATUSES.CLOSED]: 'Закрытый',
  [CHAT_STATUSES.TRANSFERRED]: 'Переданный'
} as const

// Типы сообщений
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  FILE: 'file',
  SYSTEM: 'system'
} as const

export const MESSAGE_TYPE_LABELS = {
  [MESSAGE_TYPES.TEXT]: 'Текст',
  [MESSAGE_TYPES.IMAGE]: 'Изображение',
  [MESSAGE_TYPES.VIDEO]: 'Видео',
  [MESSAGE_TYPES.FILE]: 'Файл',
  [MESSAGE_TYPES.SYSTEM]: 'Системное'
} as const

// Статусы организаций
export const ORGANIZATION_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked'
} as const

export const ORGANIZATION_STATUS_LABELS = {
  [ORGANIZATION_STATUSES.ACTIVE]: 'Активная',
  [ORGANIZATION_STATUSES.INACTIVE]: 'Неактивная',
  [ORGANIZATION_STATUSES.BLOCKED]: 'Заблокированная'
} as const

// Пагинация
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
} as const

// Время ожидания
export const TIMEOUTS = {
  API_REQUEST: 10000,
  DEBOUNCE_SEARCH: 300,
  TOAST_DURATION: 3000
} as const

// Локальное хранилище
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const

// Маршруты
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  USERS: '/users',
  CHATS: '/chats',
  ORGANIZATIONS: '/organizations',
  DEPARTMENTS: '/departments',
  POSITIONS: '/positions',
  TEMPLATES: '/templates'
} as const

// Разрешения
export const PERMISSIONS = {
  // Базовые разрешения
  READ_CHATS: 'read_chats',
  WRITE_MESSAGES: 'write_messages',
  MANAGE_OWN_PROFILE: 'manage_own_profile',

  // Расширенные разрешения
  VIEW_REPORTS: 'view_reports',
  MANAGE_TEAM: 'manage_team',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_ORGANIZATIONS: 'manage_organizations',
  MANAGE_DEPARTMENTS: 'manage_departments',
  MANAGE_POSITIONS: 'manage_positions',
  MANAGE_USERS: 'manage_users',

  // Административные разрешения
  ADMIN_ACCESS: 'admin_access',
  SYSTEM_SETTINGS: 'system_settings',
  VIEW_LOGS: 'view_logs'
} as const

export const PERMISSION_LABELS = {
  [PERMISSIONS.READ_CHATS]: 'Чтение чатов',
  [PERMISSIONS.WRITE_MESSAGES]: 'Написание сообщений',
  [PERMISSIONS.MANAGE_OWN_PROFILE]: 'Управление собственным профилем',
  [PERMISSIONS.VIEW_REPORTS]: 'Просмотр отчетов',
  [PERMISSIONS.MANAGE_TEAM]: 'Управление командой',
  [PERMISSIONS.VIEW_ANALYTICS]: 'Просмотр аналитики',
  [PERMISSIONS.MANAGE_ORGANIZATIONS]: 'Управление организациями',
  [PERMISSIONS.MANAGE_DEPARTMENTS]: 'Управление отделами',
  [PERMISSIONS.MANAGE_POSITIONS]: 'Управление должностями',
  [PERMISSIONS.MANAGE_USERS]: 'Управление пользователями',
  [PERMISSIONS.ADMIN_ACCESS]: 'Административный доступ',
  [PERMISSIONS.SYSTEM_SETTINGS]: 'Настройки системы',
  [PERMISSIONS.VIEW_LOGS]: 'Просмотр логов'
} as const

// Цвета для статусов
export const STATUS_COLORS = {
  [USER_STATUSES.ACTIVE]: 'green',
  [USER_STATUSES.INACTIVE]: 'gray',
  [USER_STATUSES.BLOCKED]: 'red',
  [CHAT_STATUSES.ACTIVE]: 'green',
  [CHAT_STATUSES.CLOSED]: 'red',
  [CHAT_STATUSES.TRANSFERRED]: 'blue',
  [ORGANIZATION_STATUSES.ACTIVE]: 'green',
  [ORGANIZATION_STATUSES.INACTIVE]: 'gray',
  [ORGANIZATION_STATUSES.BLOCKED]: 'red'
} as const
