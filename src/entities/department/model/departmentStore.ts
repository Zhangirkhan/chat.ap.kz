import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { departmentApi } from '../api/departmentApi'
import type {
  Department,
  CreateDepartmentData,
  UpdateDepartmentData,
  AssignDepartmentSupervisorData,
  AssignDepartmentManagerData,
  RemoveDepartmentSupervisorData,
  RemoveDepartmentManagerData
} from '@/shared/lib/types'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const currentDepartment = ref<Department | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeDepartments = computed(() =>
    departments.value.filter(dept => dept.status === 'active')
  )

  const fetchDepartments = async (params?: { page?: number; per_page?: number; search?: string; organization_id?: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.getDepartments(params)
      if (response.success) {
        departments.value = response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки отделов'
    } finally {
      loading.value = false
    }
  }

  const fetchDepartmentById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.getDepartmentById(id)
      if (response.success) {
        currentDepartment.value = response.data
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки отдела'
    } finally {
      loading.value = false
    }
  }

  const createDepartment = async (data: CreateDepartmentData) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.createDepartment(data)
      if (response.success) {
        departments.value.push(response.data)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка создания отдела'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDepartment = async (id: number, data: UpdateDepartmentData) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.updateDepartment(id, data)
      if (response.success) {
        const index = departments.value.findIndex(dept => dept.id === id)
        if (index !== -1) {
          departments.value[index] = response.data
        }
        if (currentDepartment.value?.id === id) {
          currentDepartment.value = response.data
        }
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка обновления отдела'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDepartment = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.deleteDepartment(id)
      if (response.success) {
        departments.value = departments.value.filter(dept => dept.id !== id)
        if (currentDepartment.value?.id === id) {
          currentDepartment.value = null
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка удаления отдела'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getDepartmentUsers = async (departmentId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.getDepartmentUsers(departmentId)
      if (response.success) {
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки пользователей отдела'
    } finally {
      loading.value = false
    }
  }

  const getDepartmentSupervisors = async (departmentId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.getDepartmentSupervisors(departmentId)
      if (response.success) {
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки руководителей отдела'
    } finally {
      loading.value = false
    }
  }

  const getDepartmentManagers = async (departmentId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.getDepartmentManagers(departmentId)
      if (response.success) {
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки менеджеров отдела'
    } finally {
      loading.value = false
    }
  }

  const assignSupervisor = async (data: AssignDepartmentSupervisorData) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.assignSupervisor(data)
      if (response.success) {
        // Обновляем данные отдела
        await fetchDepartmentById(data.department_id)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка назначения руководителя'
      throw err
    } finally {
      loading.value = false
    }
  }

  const assignManager = async (data: AssignDepartmentManagerData) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.assignManager(data)
      if (response.success) {
        // Обновляем данные отдела
        await fetchDepartmentById(data.department_id)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка назначения менеджера'
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeSupervisor = async (data: RemoveDepartmentSupervisorData) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.removeSupervisor(data)
      if (response.success) {
        // Обновляем данные отдела
        await fetchDepartmentById(data.department_id)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка удаления руководителя'
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeManager = async (data: RemoveDepartmentManagerData) => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentApi.removeManager(data)
      if (response.success) {
        // Обновляем данные отдела
        await fetchDepartmentById(data.department_id)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка удаления менеджера'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentDepartment = (department: Department | null) => {
    currentDepartment.value = department
  }

  const clearError = () => {
    error.value = null
  }

  return {
    departments,
    currentDepartment,
    loading,
    error,
    activeDepartments,
    fetchDepartments,
    fetchDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentUsers,
    getDepartmentSupervisors,
    getDepartmentManagers,
    assignSupervisor,
    assignManager,
    removeSupervisor,
    removeManager,
    setCurrentDepartment,
    clearError
  }
})
