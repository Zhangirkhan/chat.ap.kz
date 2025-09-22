// Конфигурация API
export const API_CONFIG = {
  // Базовый URL бэкенда
  BACKEND_URL: 'https://back-erp.ap.kz',

  // Endpoints
  ENDPOINTS: {
    // CSRF
    CSRF_COOKIE: '/csrf-token',

    // Аутентификация
    AUTH: {
      LOGIN: '/auth/spa/login',
      REGISTER: '/auth/spa/register',
      LOGOUT: '/auth/logout',
      USER: '/user',
      PROFILE: '/auth/profile',
      PASSWORD: '/auth/password',
      STATS: '/auth/stats'
    },

    // Пользователи
    USERS: '/users',

    // Организации
    ORGANIZATIONS: '/organizations',

    // Отделы
    DEPARTMENTS: '/departments',
    DEPARTMENT_SUPERVISORS: '/department-supervisors',
    DEPARTMENT_MANAGERS: '/department-managers',

    // Чаты
    CHATS: '/chats',

    // Сообщения
    MESSAGES: '/messages',

    // Роли
    ROLES: '/roles',
    PERMISSIONS: '/permissions',

    // Шаблоны
    TEMPLATES: '/templates',

    // Контрагенты
    CONTRACTORS: '/contractors',

    // Компании
    COMPANIES: '/companies',

    // Клиенты
    CLIENTS: '/clients'
  }
} as const

// Полные URL для удобства
export const API_URLS = {
  CSRF_COOKIE: `${API_CONFIG.BACKEND_URL}/api${API_CONFIG.ENDPOINTS.CSRF_COOKIE}`,
  AUTH_LOGIN: `${API_CONFIG.BACKEND_URL}/api${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
  AUTH_REGISTER: `${API_CONFIG.BACKEND_URL}/api${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
  AUTH_LOGOUT: `${API_CONFIG.BACKEND_URL}/api${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
  AUTH_USER: `${API_CONFIG.BACKEND_URL}/api${API_CONFIG.ENDPOINTS.AUTH.USER}`,
  AUTH_PROFILE: `${API_CONFIG.BACKEND_URL}/api${API_CONFIG.ENDPOINTS.AUTH.PROFILE}`,
  AUTH_PASSWORD: `${API_CONFIG.BACKEND_URL}/api${API_CONFIG.ENDPOINTS.AUTH.PASSWORD}`
} as const
