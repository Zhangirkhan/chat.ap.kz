import type { UserFormData, UserFormErrors } from '../model/types'
import { userFormValidation } from './constants'

export function validateUserForm(data: UserFormData): UserFormErrors {
  const errors: UserFormErrors = {}

  // Валидация имени
  if (!data.name.trim()) {
    errors.name = userFormValidation.name.required
  } else if (data.name.length < 2) {
    errors.name = userFormValidation.name.minLength
  } else if (data.name.length > 50) {
    errors.name = userFormValidation.name.maxLength
  }

  // Валидация email
  if (!data.email.trim()) {
    errors.email = userFormValidation.email.required
  } else if (!isValidEmail(data.email)) {
    errors.email = userFormValidation.email.email
  }

  // Валидация роли
  if (!data.role) {
    errors.role = userFormValidation.role.required
  }

  // Валидация описания
  if (data.description && data.description.length > 500) {
    errors.description = userFormValidation.description.maxLength
  }

  return errors
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
