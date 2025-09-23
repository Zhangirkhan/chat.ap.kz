import { ref, reactive } from 'vue'
import type { Department, CreateDepartmentData, UpdateDepartmentData } from '@/shared/lib/types'

export function useDepartmentForm() {
  const isEditing = ref(false)
  const departmentToEdit = ref<Department | null>(null)

  const form = reactive({
    name: '',
    organization_id: null as number | null,
    description: '',
    status: 'active' as 'active' | 'inactive'
  })

  const errors = reactive({
    name: '',
    organization_id: '',
    description: '',
    status: ''
  })

  const validateForm = () => {
    // Очищаем предыдущие ошибки
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })

    let isValid = true

    if (!form.name.trim()) {
      errors.name = 'Название отдела обязательно'
      isValid = false
    }

    if (!form.organization_id) {
      errors.organization_id = 'Организация обязательна'
      isValid = false
    }

    return isValid
  }

  const resetForm = () => {
    form.name = ''
    form.organization_id = null
    form.description = ''
    form.status = 'active'

    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })
  }

  const populateForm = (department: Department) => {
    form.name = department.name
    form.organization_id = department.organization_id
    form.description = department.description || ''
    form.status = department.status
  }

  const getFormData = (): CreateDepartmentData | UpdateDepartmentData => {
    const baseData = {
      name: form.name,
      organization_id: form.organization_id!,
      description: form.description || undefined
    }

    if (isEditing.value) {
      return {
        ...baseData,
        status: form.status
      } as UpdateDepartmentData
    }

    return baseData as CreateDepartmentData
  }

  const startEditing = (department: Department) => {
    isEditing.value = true
    departmentToEdit.value = department
    populateForm(department)
  }

  const stopEditing = () => {
    isEditing.value = false
    departmentToEdit.value = null
    resetForm()
  }

  return {
    isEditing,
    departmentToEdit,
    form,
    errors,
    validateForm,
    resetForm,
    populateForm,
    getFormData,
    startEditing,
    stopEditing
  }
}
