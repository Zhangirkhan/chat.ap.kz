# Исправление проблемы с восстановлением авторизации

## Проблема

При перезагрузке страницы происходила следующая последовательность:

1. **Инициализация authStore** - токен загружался из localStorage
2. **Попытка загрузки пользователя** - запрос к API превышал таймаут
3. **Очистка токена** - при ошибке токен удалялся из localStorage
4. **Перенаправление на главную** - пользователь терял авторизацию

## Решение

### 1. Улучшенная инициализация authStore

**Добавлено состояние инициализации:**
```typescript
const isInitialized = ref(false)
```

**Улучшенная функция fetchUser:**
- Добавлен параметр `silent` для тихой загрузки
- Различение сетевых ошибок от ошибок авторизации
- Сохранение токена при сетевых проблемах

```typescript
const fetchUser = async (silent = false) => {
  // ... логика загрузки
  
  // Если это ошибка таймаута или сети, не очищаем токен
  if (errorMessage.includes('превышено время ожидания') || 
      errorMessage.includes('Ошибка сети')) {
    if (!silent) {
      console.warn('Сетевая ошибка, сохраняем токен')
    }
    return false
  }
}
```

### 2. Централизованная функция очистки

**Функция clearAuth:**
```typescript
const clearAuth = () => {
  token.value = null
  user.value = null
  localStorage.removeItem('token')
  apiClient.clearToken()
  isInitialized.value = false
  
  // Очищаем кэш организаций
  const organizationStore = useOrganizationStore()
  organizationStore.clearCache()
}
```

### 3. Улучшенные router guards

**Ожидание инициализации:**
```typescript
// Ждем инициализации authStore
if (!authStore.isInitialized) {
  const waitForInit = new Promise<void>((resolve) => {
    const checkInit = () => {
      if (authStore.isInitialized) {
        resolve()
      } else {
        setTimeout(checkInit, 100)
      }
    }
    checkInit()
  })
  
  await Promise.race([waitForInit, initTimeout])
}
```

**Умная обработка ошибок:**
- Не очищаем токен при сетевых ошибках
- Повторные попытки загрузки пользователя
- Graceful degradation

### 4. Composable для авторизации

**Единый интерфейс useAuth:**
```typescript
export function useAuth() {
  const authStore = useAuthStore()
  
  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isInitialized: computed(() => authStore.isInitialized),
    isReady: computed(() => authStore.isInitialized),
    user: computed(() => authStore.user),
    login: async (email, password) => { /* ... */ },
    logout: async () => { /* ... */ },
    refreshUser: async () => { /* ... */ }
  }
}
```

## Преимущества решения

### 1. Надежность
- Токен сохраняется при сетевых проблемах
- Graceful degradation при ошибках
- Автоматическое восстановление при восстановлении сети

### 2. Производительность
- Быстрая инициализация приложения
- Кэширование состояния авторизации
- Минимальные API запросы

### 3. Пользовательский опыт
- Сохранение авторизации при перезагрузке
- Плавные переходы между страницами
- Отсутствие неожиданных выходов из системы

### 4. Разработка
- Единый интерфейс для работы с авторизацией
- Централизованная логика очистки
- Легкое тестирование и отладка

## Использование

### В компонентах:
```typescript
import { useAuth } from '@/shared/composables/useAuth'

const { isAuthenticated, isReady, user, login, logout } = useAuth()

// Проверка готовности системы
if (!isReady.value) {
  return // Показываем загрузку
}

// Проверка авторизации
if (!isAuthenticated.value) {
  // Показываем форму входа
}
```

### В router guards:
```typescript
// Автоматическое ожидание инициализации
if (!authStore.isInitialized) {
  await waitForInitialization()
}
```

## Мониторинг

### Логирование:
- Все этапы инициализации логируются
- Сетевые ошибки отличаются от ошибок авторизации
- Время инициализации отслеживается

### Отладка:
```typescript
console.log('Auth state:', {
  isAuthenticated: authStore.isAuthenticated,
  isInitialized: authStore.isInitialized,
  hasToken: !!authStore.token,
  hasUser: !!authStore.user
})
```

## Результат

Теперь при перезагрузке страницы:

1. ✅ **Токен сохраняется** в localStorage
2. ✅ **Инициализация происходит** без блокировки UI
3. ✅ **Сетевые ошибки не очищают** токен
4. ✅ **Пользователь остается авторизованным** при проблемах с сетью
5. ✅ **Автоматическое восстановление** при восстановлении соединения
