# Управление данными в приложении

## Обзор

В приложении реализована централизованная система управления данными с использованием Pinia stores. Данные загружаются один раз после авторизации и кэшируются для использования во всех компонентах.

## Архитектура

### 1. Organization Store (`src/entities/organization/model/organizationStore.ts`)

**Функциональность:**
- Кэширование списка организаций на 5 минут
- Автоматическая загрузка после авторизации
- Методы для поиска, добавления, обновления и удаления организаций
- Проверка свежести данных

**Основные методы:**
- `getOrganizations(forceRefresh?)` - получение организаций с кэшированием
- `getOrganizationById(id)` - получение организации по ID
- `searchOrganizations(query)` - поиск организаций
- `addOrganization(organization)` - добавление организации
- `updateOrganization(id, organization)` - обновление организации
- `removeOrganization(id)` - удаление организации
- `clearCache()` - очистка кэша
- `refresh()` - принудительное обновление

**Computed свойства:**
- `isDataFresh` - проверка свежести данных
- `hasOrganizations` - наличие организаций в кэше

### 2. Интеграция с Auth Store

**Автоматическая загрузка:**
- После успешной авторизации организации загружаются в фоне
- При выходе из системы кэш организаций очищается
- Проверка аутентификации перед загрузкой данных

**Код интеграции:**
```typescript
// В authStore.login()
const organizationStore = useOrganizationStore()
organizationStore.getOrganizations().catch(err => {
  console.warn('Не удалось загрузить организации после авторизации:', err)
})

// В authStore.logout()
const organizationStore = useOrganizationStore()
organizationStore.clearCache()
```

### 3. Использование в компонентах

**Страница шаблонов:**
```typescript
import { useOrganizationStore } from '@/entities/organization'

const organizationStore = useOrganizationStore()

// Загрузка организаций (с кэшированием)
await organizationStore.getOrganizations()

// Использование данных
organizationStore.organizations
```

**Страница контрагентов:**
```typescript
import { useOrganizationStore } from '@/entities/organization'

const organizationStore = useOrganizationStore()

// Передача в компоненты
:organizations="organizationStore.organizations"
```

## Преимущества

### 1. Производительность
- Данные загружаются один раз после авторизации
- Кэширование на 5 минут предотвращает лишние запросы
- Быстрый доступ к данным из любого компонента

### 2. Согласованность
- Единый источник данных для всех компонентов
- Автоматическая синхронизация при изменениях
- Централизованная обработка ошибок

### 3. Пользовательский опыт
- Мгновенная загрузка страниц с кэшированными данными
- Фоновая загрузка не блокирует интерфейс
- Graceful degradation при ошибках сети

### 4. Разработка
- Простое использование в компонентах
- Автоматическое управление состоянием
- Легкое тестирование и отладка

## Настройки

### Таймаут API
```typescript
// src/shared/api/client.ts
const API_TIMEOUT = 30000 // 30 секунд
```

### Кэширование
```typescript
// src/entities/organization/model/organizationStore.ts
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут
```

## Расширение

### Добавление новых stores

1. Создать store в соответствующей entity папке
2. Добавить интеграцию с authStore
3. Экспортировать из index.ts
4. Использовать в компонентах

### Пример нового store:
```typescript
// src/entities/department/model/departmentStore.ts
export const useDepartmentStore = defineStore('departments', () => {
  const departments = ref<Department[]>([])
  const loading = ref(false)
  
  const getDepartments = async () => {
    // Логика загрузки с кэшированием
  }
  
  return {
    departments,
    loading,
    getDepartments
  }
})
```

## Мониторинг

### Логирование
- Все операции с данными логируются
- Ошибки загрузки отслеживаются
- Время кэширования контролируется

### Отладка
```typescript
// Проверка состояния store
console.log('Organizations:', organizationStore.organizations)
console.log('Is data fresh:', organizationStore.isDataFresh)
console.log('Last fetch:', organizationStore.lastFetch)
```

## Лучшие практики

1. **Всегда проверяйте аутентификацию** перед загрузкой данных
2. **Используйте кэширование** для часто используемых данных
3. **Обрабатывайте ошибки gracefully** без блокировки UI
4. **Очищайте кэш** при выходе из системы
5. **Логируйте операции** для отладки
6. **Используйте computed свойства** для реактивности
