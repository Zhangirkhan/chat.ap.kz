import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { userApi } from '@/entities/user'
import type { User, CreateUserData, UpdateUserData } from '@/shared/lib/types'

export function useEmployeeManagement() {
  const toast = useToast()
  const employees = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadEmployees = async (searchQuery?: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await userApi.getUsers({
        per_page: 50,
        search: searchQuery || undefined
      })

      // Проверяем формат ответа
      if (response.data && Array.isArray(response.data)) {
        employees.value = response.data
      } else if (Array.isArray(response)) {
        employees.value = response
      } else {
        employees.value = []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки сотрудников'
      employees.value = []
    } finally {
      loading.value = false
    }
  }

  const createEmployee = async (employeeData: CreateUserData) => {
    try {
      loading.value = true
      const response = await userApi.createUser(employeeData)

      // Проверяем формат ответа
      if (response.data && response.data.id) {
        employees.value.push(response.data)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Сотрудник создан',
        life: 4000,
        closable: true,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания сотрудника'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 6000,
        closable: true,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const updateEmployee = async (id: number, employeeData: UpdateUserData) => {
    try {
      loading.value = true
      const response = await userApi.updateUser(id, employeeData)

      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        // Проверяем формат ответа
        if (response.data && response.data.id) {
          employees.value[index] = response.data
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Сотрудник обновлен',
        life: 4000,
        closable: true,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления сотрудника'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 6000,
        closable: true,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const deleteEmployee = async (id: number) => {
    try {
      loading.value = true
      await userApi.deleteUser(id, { soft: true })

      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value.splice(index, 1)
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Сотрудник удален',
        life: 4000,
        closable: true,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления сотрудника'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 6000,
        closable: true,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (id: number, passwordData: { password: string; password_confirmation: string }) => {
    try {
      loading.value = true
      await userApi.updateUser(id, passwordData as any)

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Пароль обновлен',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: err instanceof Error ? err.message : 'Не удалось обновить пароль',
        life: 5000,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  return {
    employees,
    loading,
    error,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    changePassword
  }
}
