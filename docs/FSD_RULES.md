# Feature-Sliced Design (FSD) Правила для Vue проекта

## Обязательные правила

### 1. Архитектура слоев
```
src/
├── app/           # Инициализация приложения
├── pages/         # Страницы приложения
├── widgets/       # Сложные UI блоки
├── features/      # Фичи приложения
├── entities/      # Бизнес-сущности
├── shared/        # Переиспользуемые ресурсы
└── components/    # Бизнес-компоненты (deprecated, используйте features/widgets)
```

### 2. Структура форм

#### Формы должны быть в `@features/` или `@widgets/`:

```
src/features/user-management/
├── ui/
│   ├── UserForm.vue          # Форма создания/редактирования
│   ├── UserList.vue          # Список пользователей
│   └── UserCard.vue          # Карточка пользователя
├── model/
│   ├── types.ts              # Типы для пользователей
│   ├── api.ts                # API методы
│   └── store.ts              # Pinia store
├── lib/
│   └── validation.ts         # Валидация форм
└── index.ts                  # Публичный API фичи
```

#### Пример структуры формы:

```typescript
// src/features/user-management/ui/UserForm.vue
<template>
  <Card>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          name="name" 
          label="Имя пользователя" 
          v-model="form.name"
          :error="errors.name"
          required
        />
        
        <Input 
          name="email" 
          label="Email" 
          type="email"
          v-model="form.email"
          :error="errors.email"
          required
        />
      </div>

      <Select 
        name="role" 
        label="Роль"
        :options="roleOptions"
        v-model="form.role"
        :error="errors.role"
        required
      />

      <div class="flex justify-end space-x-3">
        <Button type="button" variant="secondary" @click="handleCancel">
          Отмена
        </Button>
        <Button type="submit" variant="primary" :loading="isSubmitting">
          Сохранить
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input, Select, Button, Card } from '@/shared/ui'
import { useUserForm } from '../model/useUserForm'
import { roleOptions } from '../lib/constants'

const { form, errors, isSubmitting, handleSubmit, handleCancel } = useUserForm()
</script>
```

### 3. Импорты

#### ✅ Правильно:
```typescript
// UI компоненты из shared
import { Button, Input, Card } from '@/shared/ui'

// Фичи из features
import { UserForm } from '@/features/user-management'

// Сущности из entities
import { User } from '@/entities/user'

// Виджеты из widgets
import { UserList } from '@/widgets/user-list'
```

#### ❌ Неправильно:
```typescript
// Не импортируйте из components (deprecated)
import { UserForm } from '@/components/UserForm'

// Не импортируйте напрямую из других фич
import { UserForm } from '@/features/user-management/ui/UserForm'
```

### 4. Слои и их назначение

#### `@shared/` - Общий слой
- **UI компоненты** - переиспользуемые компоненты интерфейса
- **Утилиты** - функции, не привязанные к бизнес-логике
- **Конфиги** - настройки приложения
- **API клиенты** - базовые HTTP клиенты

#### `@entities/` - Сущности
- **Модели данных** - типы, интерфейсы
- **API методы** - работа с конкретной сущностью
- **Stores** - состояние сущности

#### `@features/` - Фичи
- **Формы** - создание, редактирование
- **Действия** - специфичные для фичи операции
- **UI компоненты** - специфичные для фичи

#### `@widgets/` - Виджеты
- **Сложные блоки** - комбинации фич и сущностей
- **Страничные компоненты** - большие UI блоки

#### `@pages/` - Страницы
- **Роутинг** - связка виджетов и фич
- **Мета-информация** - заголовки, мета-теги

### 5. Правила именования

#### Файлы:
- **Компоненты**: `PascalCase.vue` (UserForm.vue)
- **Хуки**: `useCamelCase.ts` (useUserForm.ts)
- **Типы**: `camelCase.ts` (userTypes.ts)
- **API**: `camelCase.ts` (userApi.ts)

#### Папки:
- **Фичи**: `kebab-case` (user-management)
- **Сущности**: `kebab-case` (user)
- **Виджеты**: `kebab-case` (user-list)

### 6. Запреты

#### ❌ Нельзя:
- Импортировать из `@components/` (удалена)
- Создавать формы в `@shared/ui/`
- Импортировать напрямую из `ui/` папок других фич
- Смешивать бизнес-логику в UI компонентах
- Создавать циклические зависимости между слоями

#### ✅ Можно:
- Импортировать из `@shared/ui/`
- Создавать формы в `@features/` или `@widgets/`
- Использовать публичный API фич через `index.ts`
- Создавать композиционные функции в `lib/`

### 7. Миграция

#### Из старой структуры:
```typescript
// Было (deprecated)
import { UserForm } from '@/components/UserForm'
import AdminLayout from '@/components/AdminLayout.vue'

// Стало
import { UserForm } from '@/features/user-management'
import { AdminLayout } from '@/shared/ui'
```

#### Создание новой фичи:
1. Создать папку в `@features/`
2. Добавить `ui/`, `model/`, `lib/` папки
3. Создать `index.ts` с публичным API
4. Экспортировать из `@features/index.ts`
