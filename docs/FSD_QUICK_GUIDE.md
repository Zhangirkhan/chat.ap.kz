# FSD Quick Guide - Быстрый справочник

## 🎯 Основные правила

### 1. Где что размещать:

```
📁 @shared/ui/     → UI компоненты (Button, Input, Card)
📁 @features/      → Формы, действия (UserForm, LoginForm)  
📁 @entities/      → Сущности (User, Organization)
📁 @widgets/       → Сложные блоки (UserList, Dashboard)
📁 @pages/         → Страницы (CreateUserPage, LoginPage)
```

### 2. Импорты:

```typescript
// ✅ Правильно
import { Button, Input } from '@/shared/ui'
import { UserForm } from '@/features/user-management'
import { User } from '@/entities/user'

// ❌ Неправильно  
import { UserForm } from '@/components/UserForm'  // deprecated
```

### 3. Структура формы:

```
src/features/user-management/
├── ui/
│   └── UserForm.vue          # Форма
├── model/
│   ├── types.ts              # Типы
│   └── useUserForm.ts        # Хук формы
├── lib/
│   ├── validation.ts         # Валидация
│   └── constants.ts          # Константы
└── index.ts                  # Публичный API
```

### 4. Использование формы:

```vue
<template>
  <UserForm 
    @success="handleSuccess"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { UserForm } from '@/features/user-management'
</script>
```

## 🚫 Запреты

- ❌ Не создавайте формы в `@shared/ui/`
- ❌ Не импортируйте из `@components/` (deprecated)
- ❌ Не импортируйте напрямую из `ui/` папок других фич
- ❌ Не смешивайте бизнес-логику в UI компонентах

## ✅ Рекомендации

- ✅ Используйте композиционные функции (`useUserForm`)
- ✅ Выносите валидацию в отдельные файлы
- ✅ Создавайте публичный API через `index.ts`
- ✅ Разделяйте типы, логику и UI
