import { z } from 'zod'

// Базовые схемы валидации
export const phoneSchema = z.string()
  .min(1, 'Телефон обязателен')
  .regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, 'Введите корректный номер телефона в формате +7 (777) 123-45-67')

export const emailSchema = z.string()
  .min(1, 'Email обязателен')
  .email('Введите корректный email адрес')

export const nameSchema = z.string()
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(50, 'Имя не должно превышать 50 символов')
  .regex(/^[а-яё\s]+$/i, 'Имя может содержать только буквы и пробелы')

export const descriptionSchema = z.string()
  .max(500, 'Описание не должно превышать 500 символов')
  .optional()

export const passwordSchema = z.string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать заглавные и строчные буквы, а также цифры')

// Схемы валидации для пользователей
export const userValidationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  role: z.enum(['admin', 'manager', 'user']).default('user'),
  is_active: z.boolean().default(true),
  description: descriptionSchema,
  department_id: z.number().positive('Выберите отдел').optional(),
  organization_id: z.number().positive('Выберите организацию').optional()
})

export const userCreateSchema = userValidationSchema.omit({})
export const userUpdateSchema = userValidationSchema.partial()

// Схемы валидации для организаций
export const organizationValidationSchema = z.object({
  name: z.string()
    .min(1, 'Название организации обязательно')
    .max(255, 'Слишком длинное название'),
  phone: phoneSchema,
  description: descriptionSchema,
  is_active: z.boolean().default(true),
  wazzup24_enabled: z.boolean().default(false),
  wazzup24_api_key: z.string().optional(),
  wazzup24_channel_id: z.string().optional(),
  webhook_url: z.string().url('Введите корректный URL').optional()
})

export const organizationCreateSchema = organizationValidationSchema.omit({})
export const organizationUpdateSchema = organizationValidationSchema.partial()

// Схемы валидации для клиентов
export const clientValidationSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  company_id: z.number().positive('Выберите компанию').optional(),
  contractor_id: z.number().positive('Выберите контрагента').optional(),
  comment: z.string().max(1000, 'Комментарий не должен превышать 1000 символов').optional(),
  is_active: z.boolean().default(true)
})

export const clientCreateSchema = clientValidationSchema.omit({})
export const clientUpdateSchema = clientValidationSchema.partial()

// Схемы валидации для чатов
export const chatValidationSchema = z.object({
  title: z.string()
    .min(1, 'Название чата обязательно')
    .max(255, 'Слишком длинное название'),
  client_id: z.number().positive('Выберите клиента'),
  department_id: z.number().positive('Выберите отдел').optional(),
  assigned_to: z.number().positive('Выберите ответственного').optional()
})

export const chatCreateSchema = chatValidationSchema.omit({})
export const chatUpdateSchema = chatValidationSchema.partial()

// Схемы валидации для сообщений
export const messageValidationSchema = z.object({
  content: z.string()
    .min(1, 'Сообщение не может быть пустым')
    .max(4000, 'Сообщение слишком длинное'),
  type: z.enum(['text', 'image', 'video', 'audio', 'document']).default('text'),
  chat_id: z.number().positive('Неверный ID чата')
})

export const messageCreateSchema = messageValidationSchema.omit({})

// Схемы валидации для шаблонов
export const templateValidationSchema = z.object({
  name: z.string()
    .min(1, 'Название шаблона обязательно')
    .max(255, 'Слишком длинное название'),
  content: z.string()
    .min(1, 'Содержимое шаблона обязательно')
    .max(4000, 'Содержимое слишком длинное'),
  type: z.enum(['message', 'email', 'sms', 'notification']).default('message'),
  category: z.enum(['greeting', 'farewell', 'support', 'sales', 'technical', 'general']).default('general'),
  language: z.enum(['ru', 'en', 'kk']).default('ru'),
  is_active: z.boolean().default(true),
  organization_id: z.number().positive('Выберите организацию').optional()
})

export const templateCreateSchema = templateValidationSchema.omit({})
export const templateUpdateSchema = templateValidationSchema.partial()

// Схемы валидации для компаний
export const companyValidationSchema = z.object({
  name: z.string()
    .min(1, 'Название компании обязательно')
    .max(255, 'Слишком длинное название'),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().max(500, 'Адрес слишком длинный').optional(),
  description: descriptionSchema,
  status: z.enum(['active', 'inactive', 'blocked']).default('active')
})

export const companyCreateSchema = companyValidationSchema.omit({})
export const companyUpdateSchema = companyValidationSchema.partial()

// Схемы валидации для отделов
export const departmentValidationSchema = z.object({
  name: z.string()
    .min(1, 'Название отдела обязательно')
    .max(255, 'Слишком длинное название'),
  description: descriptionSchema,
  organization_id: z.number().positive('Выберите организацию'),
  is_active: z.boolean().default(true)
})

export const departmentCreateSchema = departmentValidationSchema.omit({})
export const departmentUpdateSchema = departmentValidationSchema.partial()

// Схемы валидации для смены пароля
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Текущий пароль обязателен'),
  new_password: passwordSchema,
  confirm_password: z.string().min(1, 'Подтверждение пароля обязательно')
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Пароли не совпадают',
  path: ['confirm_password']
})

// Типы для TypeScript
export type UserFormData = z.infer<typeof userValidationSchema>
export type UserCreateData = z.infer<typeof userCreateSchema>
export type UserUpdateData = z.infer<typeof userUpdateSchema>

export type OrganizationFormData = z.infer<typeof organizationValidationSchema>
export type OrganizationCreateData = z.infer<typeof organizationCreateSchema>
export type OrganizationUpdateData = z.infer<typeof organizationUpdateSchema>

export type ClientFormData = z.infer<typeof clientValidationSchema>
export type ClientCreateData = z.infer<typeof clientCreateSchema>
export type ClientUpdateData = z.infer<typeof clientUpdateSchema>

export type ChatFormData = z.infer<typeof chatValidationSchema>
export type ChatCreateData = z.infer<typeof chatCreateSchema>
export type ChatUpdateData = z.infer<typeof chatUpdateSchema>

export type MessageFormData = z.infer<typeof messageValidationSchema>
export type MessageCreateData = z.infer<typeof messageCreateSchema>

export type TemplateFormData = z.infer<typeof templateValidationSchema>
export type TemplateCreateData = z.infer<typeof templateCreateSchema>
export type TemplateUpdateData = z.infer<typeof templateUpdateSchema>

export type CompanyFormData = z.infer<typeof companyValidationSchema>
export type CompanyCreateData = z.infer<typeof companyCreateSchema>
export type CompanyUpdateData = z.infer<typeof companyUpdateSchema>

export type DepartmentFormData = z.infer<typeof departmentValidationSchema>
export type DepartmentCreateData = z.infer<typeof departmentCreateSchema>
export type DepartmentUpdateData = z.infer<typeof departmentUpdateSchema>

export type ChangePasswordData = z.infer<typeof changePasswordSchema>

// Утилиты для валидации
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} => {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err: unknown) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return {
        success: false,
        errors
      }
    }
    return {
      success: false,
      errors: { general: 'Ошибка валидации' }
    }
  }
}

export const validateField = <T>(
  schema: z.ZodSchema<T>,
  field: string,
  value: unknown
): string | null => {
  try {
    const fieldSchema = (schema as any).pick({ [field]: true })
    fieldSchema.parse({ [field]: value })
    return null
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Ошибка валидации'
    }
    return 'Ошибка валидации'
  }
}

// Схемы для поиска и фильтрации
export const searchSchema = z.object({
  query: z.string().min(1, 'Поисковый запрос не может быть пустым').max(100, 'Слишком длинный поисковый запрос'),
  filters: z.record(z.any()).optional()
})

export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  per_page: z.number().positive().max(100).default(20)
})

export type SearchData = z.infer<typeof searchSchema>
export type PaginationData = z.infer<typeof paginationSchema>