import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { departmentApi } from '@/entities/department'
import type { Department, CreateDepartmentData, UpdateDepartmentData } from '@/shared/lib/types'

export function useDepartmentManagement() {
  const toast = useToast()
  const departments = ref<Department[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadDepartments = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await departmentApi.getDepartments({ per_page: 100 })

      if (response.data && Array.isArray(response.data)) {
        departments.value = response.data
      } else if (Array.isArray(response)) {
        departments.value = response
      } else {
        departments.value = []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки отделов'
      departments.value = []
    } finally {
      loading.value = false
    }
  }

  const createDepartment = async (departmentData: CreateDepartmentData) => {
    try {
      loading.value = true
      const response = await departmentApi.createDepartment(departmentData)

      if (response.data) {
        departments.value.unshift(response.data)
        
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Отдел создан',
          life: 3000,
          group: 'main'
        })

        return response.data
      }

      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания отдела'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return null
    } finally {
      loading.value = false
    }
  }

  const updateDepartment = async (id: number, departmentData: UpdateDepartmentData) => {
    try {
      loading.value = true
      const response = await departmentApi.updateDepartment(id, departmentData)

      const index = departments.value.findIndex(dept => dept.id === id)
      if (index !== -1 && response.data) {
        departments.value[index] = response.data
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Отдел обновлен',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления отдела'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const deleteDepartment = async (id: number) => {
    try {
      loading.value = true
      await departmentApi.deleteDepartment(id)

      const index = departments.value.findIndex(dept => dept.id === id)
      if (index !== -1) {
        departments.value.splice(index, 1)
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Отдел удален',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления отдела'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const getDepartmentSupervisors = async (departmentId: number) => {
    try {
      const response = await departmentApi.getDepartmentSupervisors(departmentId)
      return response.data || []
    } catch (err) {
      console.error('Ошибка загрузки руководителей:', err)
      return []
    }
  }

  const getDepartmentManagers = async (departmentId: number) => {
    try {
      const response = await departmentApi.getDepartmentManagers(departmentId)
      return response.data || []
    } catch (err) {
      console.error('Ошибка загрузки менеджеров:', err)
      return []
    }
  }

  const assignSupervisor = async (data: { user_id: number; department_id: number }) => {
    try {
      await departmentApi.assignSupervisor(data)
      
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Руководитель назначен',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка назначения руководителя'
      
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    }
  }

  const assignManager = async (data: { user_id: number; department_id: number }) => {
    try {
      await departmentApi.assignManager(data)
      
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Менеджер назначен',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка назначения менеджера'
      
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    }
  }

  const removeSupervisor = async (data: { user_id: number; department_id: number }) => {
    try {
      await departmentApi.removeSupervisor(data)
      
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Руководитель удален',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления руководителя'
      
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    }
  }

  const removeManager = async (data: { user_id: number; department_id: number }) => {
    try {
      await departmentApi.removeManager(data)
      
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Менеджер удален',
        life: 3000,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления менеджера'
      
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
        group: 'main'
      })

      return false
    }
  }

  return {
    departments,
    loading,
    error,
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentSupervisors,
    getDepartmentManagers,
    assignSupervisor,
    assignManager,
    removeSupervisor,
    removeManager
  }
}
