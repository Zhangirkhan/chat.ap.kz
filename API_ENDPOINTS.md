# API Endpoints Documentation

## Базовые настройки
- **Base URL**: `https://back-chat.ap.kz/api`
- **Аутентификация**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## 1. Аутентификация (Auth)

### 1.1 Получение CSRF токена
- **Endpoint**: `GET /csrf-token`
- **Входящие данные**: Нет
- **Исходящие данные**:
```json
{
  "csrf_token": "string"
}
```

### 1.2 Вход в систему
- **Endpoint**: `POST /auth/spa/login`
- **Входящие данные**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Исходящие данные**:
```json
{
  "success": true,
  "message": "string",
  "data": {
    "user": {
      "id": "number",
      "name": "string",
      "email": "string",
      "phone": "string",
      "position": "string",
      "role": "string",
      "organization": {
        "id": "number",
        "name": "string"
      },
      "permissions": ["string"],
      "roles": ["string"]
    },
    "token": "string",
    "token_type": "string",
    "expires_in": "number"
  }
}
```

### 1.3 Регистрация
- **Endpoint**: `POST /auth/spa/register`
- **Входящие данные**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "phone": "string",
  "position": "string",
  "organization_id": "number"
}
```
- **Исходящие данные**: Аналогично входу в систему

### 1.4 Выход из системы
- **Endpoint**: `POST /auth/logout`
- **Входящие данные**: Нет
- **Исходящие данные**: Статус операции

### 1.5 Получение данных пользователя
- **Endpoint**: `GET /user`
- **Входящие данные**: Нет
- **Исходящие данные**: Данные текущего пользователя

### 1.6 Обновление профиля
- **Endpoint**: `PUT /auth/profile`
- **Входящие данные**:
```json
{
  "name": "string",
  "phone": "string",
  "position": "string"
}
```
- **Исходящие данные**: Обновленные данные пользователя

### 1.7 Смена пароля
- **Endpoint**: `PUT /auth/password`
- **Входящие данные**:
```json
{
  "current_password": "string",
  "new_password": "string",
  "new_password_confirmation": "string"
}
```
- **Исходящие данные**: Статус операции

### 1.8 Статистика пользователя
- **Endpoint**: `GET /auth/stats`
- **Входящие данные**: Нет
- **Исходящие данные**:
```json
{
  "total_chats": "number",
  "active_chats": "number",
  "messages_sent": "number",
  "unread_notifications": "number"
}
```

## 2. Пользователи (Users)

### 2.1 Получение списка пользователей
- **Endpoint**: `GET /users`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
  - `organization_id`: ID организации
  - `department_id`: ID отдела
  - `role`: роль пользователя
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "phone": "string",
      "position": "string",
      "role": "string",
      "organization_id": "number",
      "department_id": "number",
      "permissions": ["string"],
      "status": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### 2.2 Получение пользователя по ID
- **Endpoint**: `GET /users/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные пользователя

### 2.3 Создание пользователя
- **Endpoint**: `POST /users`
- **Входящие данные**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "phone": "string",
  "position": "string",
  "role": "string",
  "organization_id": "number",
  "department_id": "number",
  "position_id": "number"
}
```
- **Исходящие данные**: Созданный пользователь

### 2.4 Обновление пользователя
- **Endpoint**: `PUT /users/{id}`
- **Входящие данные**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "position": "string",
  "role": "string",
  "organization_id": "number",
  "department_id": "number",
  "position_id": "number",
  "status": "string"
}
```
- **Исходящие данные**: Обновленный пользователь

### 2.5 Удаление пользователя
- **Endpoint**: `DELETE /users/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

## 3. Организации (Organizations)

### 3.1 Получение списка организаций
- **Endpoint**: `GET /organizations`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "description": "string",
      "users_count": "number",
      "departments_count": "number",
      "status": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### 3.2 Получение организации по ID
- **Endpoint**: `GET /organizations/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные организации

### 3.3 Создание организации
- **Endpoint**: `POST /organizations`
- **Входящие данные**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "description": "string"
}
```
- **Исходящие данные**: Созданная организация

### 3.4 Обновление организации
- **Endpoint**: `PUT /organizations/{id}`
- **Входящие данные**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "description": "string",
  "status": "string"
}
```
- **Исходящие данные**: Обновленная организация

### 3.5 Удаление организации
- **Endpoint**: `DELETE /organizations/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

### 3.6 Получение отделов организации
- **Endpoint**: `GET /organizations/{id}/departments`
- **Входящие данные**: ID организации в URL
- **Исходящие данные**: Список отделов организации

### 3.7 Получение пользователей организации
- **Endpoint**: `GET /organizations/{id}/users`
- **Входящие данные**: ID организации в URL
- **Исходящие данные**: Список пользователей организации

## 4. Отделы (Departments)

### 4.1 Получение списка отделов
- **Endpoint**: `GET /departments`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
  - `organization_id`: ID организации
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "organization_id": "number",
      "users_count": "number",
      "supervisors_count": "number",
      "managers_count": "number",
      "status": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### 4.2 Получение отдела по ID
- **Endpoint**: `GET /departments/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные отдела

### 4.3 Создание отдела
- **Endpoint**: `POST /departments`
- **Входящие данные**:
```json
{
  "name": "string",
  "description": "string",
  "organization_id": "number"
}
```
- **Исходящие данные**: Созданный отдел

### 4.4 Обновление отдела
- **Endpoint**: `PUT /departments/{id}`
- **Входящие данные**:
```json
{
  "name": "string",
  "description": "string",
  "organization_id": "number",
  "status": "string"
}
```
- **Исходящие данные**: Обновленный отдел

### 4.5 Удаление отдела
- **Endpoint**: `DELETE /departments/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

### 4.6 Получение пользователей отдела
- **Endpoint**: `GET /departments/{id}/users`
- **Входящие данные**: ID отдела в URL
- **Исходящие данные**: Список пользователей отдела

### 4.7 Получение руководителей отдела
- **Endpoint**: `GET /departments/{id}/supervisors`
- **Входящие данные**: ID отдела в URL
- **Исходящие данные**: Список руководителей отдела

### 4.8 Получение менеджеров отдела
- **Endpoint**: `GET /departments/{id}/managers`
- **Входящие данные**: ID отдела в URL
- **Исходящие данные**: Список менеджеров отдела

### 4.9 Назначение руководителя отдела
- **Endpoint**: `POST /department-supervisors`
- **Входящие данные**:
```json
{
  "user_id": "number",
  "department_id": "number"
}
```
- **Исходящие данные**: Статус операции

### 4.10 Назначение менеджера отдела
- **Endpoint**: `POST /department-managers`
- **Входящие данные**:
```json
{
  "user_id": "number",
  "department_id": "number"
}
```
- **Исходящие данные**: Статус операции

### 4.11 Удаление руководителя отдела
- **Endpoint**: `DELETE /department-supervisors`
- **Входящие данные**:
```json
{
  "user_id": "number",
  "department_id": "number"
}
```
- **Исходящие данные**: Статус операции

### 4.12 Удаление менеджера отдела
- **Endpoint**: `DELETE /department-managers`
- **Входящие данные**:
```json
{
  "user_id": "number",
  "department_id": "number"
}
```
- **Исходящие данные**: Статус операции

## 5. Чаты (Chats)

### 5.1 Получение списка чатов
- **Endpoint**: `GET /chats`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
  - `status`: статус чата
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "client_name": "string",
      "client_phone": "string",
      "client_email": "string",
      "status": "string",
      "created_at": "string",
      "updated_at": "string",
      "assigned_user": {
        "id": "number",
        "name": "string",
        "email": "string"
      },
      "last_message": {
        "id": "number",
        "message": "string",
        "type": "string",
        "created_at": "string"
      }
    }
  ]
}
```

### 5.2 Поиск чатов
- **Endpoint**: `GET /chats/search`
- **Входящие данные**: Query параметры
  - `query`: поисковый запрос
  - `status`: статус чата
  - `page`: номер страницы
  - `per_page`: количество на странице
- **Исходящие данные**: Список найденных чатов

### 5.3 Получение чата по ID
- **Endpoint**: `GET /chats/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные чата с сообщениями

### 5.4 Создание чата
- **Endpoint**: `POST /chats`
- **Входящие данные**:
```json
{
  "client_name": "string",
  "client_phone": "string",
  "client_email": "string",
  "message": "string",
  "department_id": "number"
}
```
- **Исходящие данные**: Созданный чат

### 5.5 Обновление чата
- **Endpoint**: `PUT /chats/{id}`
- **Входящие данные**:
```json
{
  "client_name": "string",
  "client_phone": "string",
  "client_email": "string",
  "status": "string",
  "assigned_to": "number"
}
```
- **Исходящие данные**: Обновленный чат

### 5.6 Завершение чата
- **Endpoint**: `POST /chats/{id}/end`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Обновленный чат

### 5.7 Передача чата
- **Endpoint**: `POST /chats/{id}/transfer`
- **Входящие данные**:
```json
{
  "assigned_to": "number",
  "note": "string"
}
```
- **Исходящие данные**: Обновленный чат

### 5.8 Получение сообщений чата
- **Endpoint**: `GET /chats/{id}/messages`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "message": "string",
      "type": "string",
      "is_from_client": "boolean",
      "file_path": "string",
      "file_name": "string",
      "file_size": "number",
      "created_at": "string",
      "user": {
        "id": "number",
        "name": "string"
      }
    }
  ]
}
```

### 5.9 Отправка сообщения
- **Endpoint**: `POST /chats/{id}/send`
- **Входящие данные**: FormData
  - `message`: текст сообщения
  - `type`: тип сообщения
  - `file`: файл (опционально)
- **Исходящие данные**: Отправленное сообщение

### 5.10 Отправка системного сообщения
- **Endpoint**: `POST /chats/{id}/system-message`
- **Входящие данные**:
```json
{
  "message": "string"
}
```
- **Исходящие данные**: Системное сообщение

### 5.11 Скрытие сообщения
- **Endpoint**: `POST /chats/messages/{id}/hide`
- **Входящие данные**: ID сообщения в URL
- **Исходящие данные**: Статус операции

### 5.12 Получение потока сообщений (Server-Sent Events)
- **Endpoint**: `GET /chats/{id}/stream`
- **Входящие данные**: Query параметр `token`
- **Исходящие данные**: EventSource поток

## 6. Роли (Roles)

### 6.1 Получение списка ролей
- **Endpoint**: `GET /roles`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "display_name": "string",
      "description": "string",
      "permissions": ["string"],
      "is_system": "boolean",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### 6.2 Получение роли по ID
- **Endpoint**: `GET /roles/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные роли

### 6.3 Создание роли
- **Endpoint**: `POST /roles`
- **Входящие данные**:
```json
{
  "name": "string",
  "display_name": "string",
  "description": "string",
  "permissions": ["string"]
}
```
- **Исходящие данные**: Созданная роль

### 6.4 Обновление роли
- **Endpoint**: `PUT /roles/{id}`
- **Входящие данные**:
```json
{
  "name": "string",
  "display_name": "string",
  "description": "string",
  "permissions": ["string"]
}
```
- **Исходящие данные**: Обновленная роль

### 6.5 Удаление роли
- **Endpoint**: `DELETE /roles/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

### 6.6 Получение всех разрешений
- **Endpoint**: `GET /permissions`
- **Входящие данные**: Нет
- **Исходящие данные**:
```json
{
  "permissions": ["string"]
}
```

## 7. Должности (Positions)

### 7.1 Получение списка должностей
- **Endpoint**: `GET /positions`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "slug": "string",
      "description": "string",
      "permissions": ["string"],
      "is_active": "boolean",
      "users_count": "number",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### 7.2 Получение должности по ID
- **Endpoint**: `GET /positions/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные должности

### 7.3 Создание должности
- **Endpoint**: `POST /positions`
- **Входящие данные**:
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "permissions": ["string"],
  "is_active": "boolean"
}
```
- **Исходящие данные**: Созданная должность

### 7.4 Обновление должности
- **Endpoint**: `PUT /positions/{id}`
- **Входящие данные**:
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "permissions": ["string"],
  "is_active": "boolean"
}
```
- **Исходящие данные**: Обновленная должность

### 7.5 Удаление должности
- **Endpoint**: `DELETE /positions/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

## 8. Шаблоны (Templates)

### 8.1 Получение списка шаблонов
- **Endpoint**: `GET /templates`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
  - `type`: тип шаблона
  - `category`: категория шаблона
  - `language`: язык шаблона
  - `is_active`: активность шаблона
  - `is_system`: системный шаблон
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "content": "string",
      "type": "string",
      "category": "string",
      "variables": {},
      "language": "string",
      "is_active": "boolean",
      "is_system": "boolean",
      "usage_count": "number",
      "created_at": "string",
      "updated_at": "string",
      "creator": {
        "id": "number",
        "name": "string"
      }
    }
  ]
}
```

### 8.2 Получение шаблона по ID
- **Endpoint**: `GET /templates/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные шаблона

### 8.3 Создание шаблона
- **Endpoint**: `POST /templates`
- **Входящие данные**:
```json
{
  "name": "string",
  "content": "string",
  "type": "string",
  "category": "string",
  "variables": {},
  "language": "string",
  "is_active": "boolean",
  "organization_id": "number"
}
```
- **Исходящие данные**: Созданный шаблон

### 8.4 Обновление шаблона
- **Endpoint**: `PUT /templates/{id}`
- **Входящие данные**:
```json
{
  "name": "string",
  "content": "string",
  "type": "string",
  "category": "string",
  "variables": {},
  "language": "string",
  "is_active": "boolean"
}
```
- **Исходящие данные**: Обновленный шаблон

### 8.5 Удаление шаблона
- **Endpoint**: `DELETE /templates/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

### 8.6 Получение шаблонов по типу
- **Endpoint**: `GET /templates/type/{type}`
- **Входящие данные**: Тип в URL
- **Исходящие данные**: Список шаблонов указанного типа

### 8.7 Получение шаблонов по категории
- **Endpoint**: `GET /templates/category/{category}`
- **Входящие данные**: Категория в URL
- **Исходящие данные**: Список шаблонов указанной категории

### 8.8 Обработка шаблона
- **Endpoint**: `POST /templates/{id}/process`
- **Входящие данные**:
```json
{
  "variables": {}
}
```
- **Исходящие данные**:
```json
{
  "template_id": "number",
  "template_name": "string",
  "original_content": "string",
  "processed_content": "string",
  "variables_used": {}
}
```

### 8.9 Получение статистики шаблонов
- **Endpoint**: `GET /templates/stats`
- **Входящие данные**: Нет
- **Исходящие данные**:
```json
{
  "total_templates": "number",
  "active_templates": "number",
  "system_templates": "number",
  "user_templates": "number",
  "by_type": {},
  "by_category": {},
  "most_used": [
    {
      "id": "number",
      "name": "string",
      "usage_count": "number"
    }
  ]
}
```

### 8.10 Получение опций шаблонов
- **Endpoint**: `GET /templates/options`
- **Входящие данные**: Нет
- **Исходящие данные**:
```json
{
  "types": ["string"],
  "categories": ["string"],
  "languages": ["string"]
}
```

## 9. Контрагенты (Contractors)

### 9.1 Получение списка контрагентов
- **Endpoint**: `GET /contractors`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
  - `type`: тип контрагента
  - `organization_id`: ID организации
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "type": "string",
      "inn": "string",
      "kpp": "string",
      "ogrn": "string",
      "legal_address": "string",
      "actual_address": "string",
      "phone": "string",
      "email": "string",
      "website": "string",
      "contact_person": "string",
      "contact_phone": "string",
      "contact_email": "string",
      "bank_name": "string",
      "bank_account": "string",
      "bik": "string",
      "passport_series": "string",
      "passport_number": "string",
      "passport_issued_by": "string",
      "passport_issued_date": "string",
      "address": "string",
      "status": "string",
      "is_active": "boolean",
      "clients_count": "number",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### 9.2 Получение контрагента по ID
- **Endpoint**: `GET /contractors/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные контрагента

### 9.3 Создание контрагента
- **Endpoint**: `POST /contractors`
- **Входящие данные**:
```json
{
  "name": "string",
  "type": "string",
  "inn": "string",
  "kpp": "string",
  "ogrn": "string",
  "legal_address": "string",
  "actual_address": "string",
  "phone": "string",
  "email": "string",
  "website": "string",
  "contact_person": "string",
  "contact_phone": "string",
  "contact_email": "string",
  "bank_name": "string",
  "bank_account": "string",
  "bik": "string",
  "passport_series": "string",
  "passport_number": "string",
  "passport_issued_by": "string",
  "passport_issued_date": "string",
  "address": "string",
  "is_active": "boolean"
}
```
- **Исходящие данные**: Созданный контрагент

### 9.4 Обновление контрагента
- **Endpoint**: `PUT /contractors/{id}`
- **Входящие данные**: Аналогично созданию
- **Исходящие данные**: Обновленный контрагент

### 9.5 Удаление контрагента
- **Endpoint**: `DELETE /contractors/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

### 9.6 Получение клиентов контрагента
- **Endpoint**: `GET /contractors/{id}/clients`
- **Входящие данные**: ID контрагента в URL
- **Исходящие данные**: Список клиентов контрагента

### 9.7 Добавление клиента к контрагенту
- **Endpoint**: `POST /contractors/{id}/clients`
- **Входящие данные**:
```json
{
  "client_id": "number"
}
```
- **Исходящие данные**: Связь контрагент-клиент

### 9.8 Удаление клиента из контрагента
- **Endpoint**: `DELETE /contractors/{id}/clients/{client_id}`
- **Входящие данные**: ID контрагента и клиента в URL
- **Исходящие данные**: Статус операции

## 10. Клиенты (Clients)

### 10.1 Получение списка клиентов
- **Endpoint**: `GET /clients`
- **Входящие данные**: Query параметры
  - `page`: номер страницы
  - `per_page`: количество на странице
  - `search`: поисковый запрос
  - `contractor_id`: ID контрагента
  - `is_individual`: индивидуальный клиент
- **Исходящие данные**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "phone": "string",
      "email": "string",
      "uuid_wazzup": "string",
      "comment": "string",
      "avatar": "string",
      "is_active": "boolean",
      "contractor_id": "number",
      "contractor": {
        "id": "number",
        "name": "string"
      },
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### 10.2 Получение клиента по ID
- **Endpoint**: `GET /clients/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Данные клиента

### 10.3 Создание клиента
- **Endpoint**: `POST /clients`
- **Входящие данные**:
```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "uuid_wazzup": "string",
  "comment": "string",
  "avatar": "string",
  "contractor_id": "number",
  "is_active": "boolean"
}
```
- **Исходящие данные**: Созданный клиент

### 10.4 Обновление клиента
- **Endpoint**: `PUT /clients/{id}`
- **Входящие данные**: Аналогично созданию
- **Исходящие данные**: Обновленный клиент

### 10.5 Удаление клиента
- **Endpoint**: `DELETE /clients/{id}`
- **Входящие данные**: ID в URL
- **Исходящие данные**: Статус операции

### 10.6 Получение индивидуальных клиентов
- **Endpoint**: `GET /clients/individuals`
- **Входящие данные**: Query параметры пагинации
- **Исходящие данные**: Список индивидуальных клиентов

### 10.7 Получение корпоративных клиентов
- **Endpoint**: `GET /clients/corporate`
- **Входящие данные**: Query параметры пагинации
- **Исходящие данные**: Список корпоративных клиентов

### 10.8 Привязка клиента к контрагенту
- **Endpoint**: `POST /clients/{id}/attach-contractor`
- **Входящие данные**:
```json
{
  "contractor_id": "number"
}
```
- **Исходящие данные**: Обновленный клиент

### 10.9 Отвязка клиента от контрагента
- **Endpoint**: `POST /clients/{id}/detach-contractor`
- **Входящие данные**: ID клиента в URL
- **Исходящие данные**: Обновленный клиент

## Общие типы данных

### Стандартный ответ API
```json
{
  "success": true,
  "message": "string",
  "data": {},
  "errors": {},
  "code": "number",
  "timestamp": "string"
}
```

### Пагинация
```json
{
  "pagination": {
    "current_page": "number",
    "last_page": "number",
    "per_page": "number",
    "total": "number"
  }
}
```

### Ошибки валидации
```json
{
  "success": false,
  "message": "string",
  "errors": {
    "field_name": ["error_message"]
  }
}
```
