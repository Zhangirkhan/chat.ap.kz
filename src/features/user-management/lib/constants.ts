import type { UserRole } from '../model/types'

export const roleOptions: Record<UserRole, string> = {
  admin: 'Администратор',
  user: 'Пользователь',
  manager: 'Менеджер'
}

export const userFormValidation = {
  name: {
    required: 'Имя обязательно для заполнения',
    minLength: 'Имя должно содержать минимум 2 символа',
    maxLength: 'Имя не должно превышать 50 символов'
  },
  email: {
    required: 'Email обязателен для заполнения',
    email: 'Введите корректный email адрес'
  },
  role: {
    required: 'Роль обязательна для выбора'
  },
  description: {
    maxLength: 'Описание не должно превышать 500 символов'
  }
}
