import { ref } from 'vue'
import type { Department, User } from '@/shared/lib/types'

export function useDepartmentStaff() {
  const selectedDepartment = ref<Department | null>(null)
  const departmentSupervisors = ref<User[]>([])
  const departmentManagers = ref<User[]>([])
  const newSupervisorId = ref<number | null>(null)
  const newManagerId = ref<number | null>(null)

  const availableSupervisors = ref<{ value: number; label: string }[]>([])
  const availableManagers = ref<{ value: number; label: string }[]>([])

  const loadDepartmentStaff = async (
    department: Department,
    getSupervisors: (id: number) => Promise<User[]>,
    getManagers: (id: number) => Promise<User[]>
  ) => {
    selectedDepartment.value = department

    try {
      const [supervisors, managers] = await Promise.all([
        getSupervisors(department.id),
        getManagers(department.id)
      ])

      departmentSupervisors.value = supervisors || []
      departmentManagers.value = managers || []
    } catch (error) {
      console.error('Ошибка загрузки персонала отдела:', error)
      departmentSupervisors.value = []
      departmentManagers.value = []
    }
  }

  const addSupervisor = async (
    assignSupervisor: (data: { user_id: number; department_id: number }) => Promise<boolean>
  ) => {
    if (!newSupervisorId.value || !selectedDepartment.value) return

    const success = await assignSupervisor({
      user_id: newSupervisorId.value,
      department_id: selectedDepartment.value.id
    })

    if (success) {
      newSupervisorId.value = null
      return true
    }

    return false
  }

  const addManager = async (
    assignManager: (data: { user_id: number; department_id: number }) => Promise<boolean>
  ) => {
    if (!newManagerId.value || !selectedDepartment.value) return

    const success = await assignManager({
      user_id: newManagerId.value,
      department_id: selectedDepartment.value.id
    })

    if (success) {
      newManagerId.value = null
      return true
    }

    return false
  }

  const removeSupervisor = async (
    supervisor: User,
    removeSupervisor: (data: { user_id: number; department_id: number }) => Promise<boolean>
  ) => {
    if (!selectedDepartment.value) return

    return await removeSupervisor({
      user_id: supervisor.id,
      department_id: selectedDepartment.value.id
    })
  }

  const removeManager = async (
    manager: User,
    removeManager: (data: { user_id: number; department_id: number }) => Promise<boolean>
  ) => {
    if (!selectedDepartment.value) return

    return await removeManager({
      user_id: manager.id,
      department_id: selectedDepartment.value.id
    })
  }

  const clearSelection = () => {
    selectedDepartment.value = null
    departmentSupervisors.value = []
    departmentManagers.value = []
    newSupervisorId.value = null
    newManagerId.value = null
  }

  const loadAvailableStaff = async (
    getSupervisors: () => Promise<{ value: number; label: string }[]>,
    getManagers: () => Promise<{ value: number; label: string }[]>
  ) => {
    try {
      const [supervisors, managers] = await Promise.all([
        getSupervisors(),
        getManagers()
      ])

      availableSupervisors.value = supervisors || []
      availableManagers.value = managers || []
    } catch (error) {
      console.error('Ошибка загрузки доступного персонала:', error)
      availableSupervisors.value = []
      availableManagers.value = []
    }
  }

  return {
    selectedDepartment,
    departmentSupervisors,
    departmentManagers,
    newSupervisorId,
    newManagerId,
    availableSupervisors,
    availableManagers,
    loadDepartmentStaff,
    addSupervisor,
    addManager,
    removeSupervisor,
    removeManager,
    clearSelection,
    loadAvailableStaff
  }
}
