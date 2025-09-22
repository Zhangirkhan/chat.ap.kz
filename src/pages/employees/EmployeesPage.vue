<template>
  <AdminLayout>
    <template #title>Сотрудники</template>
    <template #subtitle>Управление сотрудниками организации</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск сотрудников..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          @click="showAddDialog = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Добавить сотрудника
        </button>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка сотрудников...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица сотрудников -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Сотрудник</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Должность</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Отдел</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-36">Организации</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Роль</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="employee in filteredEmployees" :key="employee.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ employee.id }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <span class="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {{ employee.name.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ employee.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ employee.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ employee.position || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate">{{ employee.department?.name || '-' }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div v-if="employee.organization">
                    <span class="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded">
                      {{ employee.organization.name }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span                   :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    employee.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                    employee.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                    employee.role === 'supervisor' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  ]">
                    {{ getRoleLabel(employee.role) }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Активен
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewEmployee(employee)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      @click="editEmployee(employee)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="confirmDelete(employee)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Удалить"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Диалог добавления/редактирования -->
    <EmployeeDialog
      v-if="showAddDialog || showEditDialog"
      :employee="selectedEmployee"
      :is-edit="showEditDialog"
      :positions="positions"
      :departments="departments"
      :organizations="organizationStore.organizations"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <EmployeeViewDialog
      v-if="showViewDialog"
      :employee="selectedEmployee"
      :positions="positions"
      :departments="departments"
      :organizations="organizationStore.organizations"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление сотрудника'"
      :message="`Вы уверены, что хотите удалить сотрудника '${selectedEmployee?.name}'?`"
      @confirm="deleteEmployee"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { userApi } from '@/entities/user'
import { departmentApi } from '@/entities/department'
import { useOrganizationStore } from '@/entities/organization'
import type { User, CreateUserData, UpdateUserData, Department, Organization } from '@/shared/lib/types'
import EmployeeDialog from './components/EmployeeDialog.vue'
import EmployeeViewDialog from './components/EmployeeViewDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const organizationStore = useOrganizationStore()
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedEmployee = ref<User | null>(null)
const employees = ref<User[]>([])
const positions = ref<{ id: number; name: string }[]>([])
const departments = ref<Department[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const filteredEmployees = computed(() => {
  if (!searchQuery.value) return employees.value

  const query = searchQuery.value.toLowerCase()
  return employees.value.filter(emp =>
    emp.name.toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query) ||
    (emp.phone && emp.phone.includes(query)) ||
    (emp.position && emp.position.toLowerCase().includes(query)) ||
    (emp.department && emp.department.name.toLowerCase().includes(query)) ||
    (emp.organization && emp.organization.name.toLowerCase().includes(query))
  )
})

const getPositionName = (positionId: number) => {
  const pos = positions.value.find(p => p.id === positionId)
  return pos ? pos.name : 'Неизвестная должность'
}

const getDepartmentName = (departmentId: number) => {
  const dept = departments.value.find(d => d.id === departmentId)
  return dept ? dept.name : 'Неизвестный отдел'
}

const getOrganizationName = (organizationId: number) => {
  const org = organizationStore.organizations.find(o => o.id === organizationId)
  return org ? org.name : 'Неизвестная организация'
}

const getRoleLabel = (role: string) => {
  const roleLabels: Record<string, string> = {
    'admin': 'Администратор',
    'manager': 'Менеджер',
    'employee': 'Сотрудник',
    'super_admin': 'Супер-админ'
  }
  return roleLabels[role] || role
}

const loadOrganizations = async () => {
  try {
    // Загружаем организации только если их нет в store
    if (organizationStore.organizations.length === 0) {
      await organizationStore.getOrganizations()
    }
  } catch (err) {
  }
}

const loadDepartments = async () => {
  try {
    // Загружаем отделы только если их нет
    if (departments.value.length === 0) {
      const response = await departmentApi.getDepartments({ per_page: 100 })

      if (response.data && Array.isArray(response.data)) {
        departments.value = response.data
      } else if (Array.isArray(response)) {
        departments.value = response
      } else {
        departments.value = []
      }
    }
  } catch (err) {
    departments.value = []
  }
}

const loadPositions = async () => {
  positions.value = [
    {
      id: 1,
      name: 'Frontend разработчик',
      description: 'Разработка пользовательского интерфейса',
      department_id: 1,
      organization_id: 1,
      salary: 450000,
      employee_count: 3,
      status: 'active',
      requirements: 'Знание Vue.js, TypeScript, HTML/CSS',
      responsibilities: 'Разработка UI компонентов, оптимизация производительности',
      created_at: '2024-01-01T12:00:00.000000Z'
    },
    {
      id: 2,
      name: 'Backend разработчик',
      description: 'Разработка серверной части приложений',
      department_id: 1,
      organization_id: 1,
      salary: 500000,
      employee_count: 2,
      status: 'active',
      requirements: 'Знание Node.js, PostgreSQL, REST API',
      responsibilities: 'Разработка API, работа с базой данных',
      created_at: '2024-01-02T10:00:00.000000Z'
    },
    {
      id: 3,
      name: 'Менеджер по продажам',
      description: 'Работа с клиентами и заключение сделок',
      department_id: 2,
      organization_id: 1,
      salary: 300000,
      employee_count: 5,
      status: 'active',
      requirements: 'Опыт продаж, коммуникативные навыки',
      responsibilities: 'Поиск клиентов, проведение переговоров',
      created_at: '2024-01-03T09:00:00.000000Z'
    },
    {
      id: 4,
      name: 'HR специалист',
      description: 'Подбор и адаптация персонала',
      department_id: 3,
      organization_id: 1,
      salary: 250000,
      employee_count: 2,
      status: 'active',
      requirements: 'Знание трудового права, опыт рекрутинга',
      responsibilities: 'Подбор персонала, проведение собеседований',
      created_at: '2024-01-04T11:00:00.000000Z'
    },
    {
      id: 5,
      name: 'DevOps инженер',
      description: 'Настройка и поддержка инфраструктуры',
      department_id: 4,
      organization_id: 2,
      salary: 600000,
      employee_count: 1,
      status: 'active',
      requirements: 'Знание Docker, Kubernetes, AWS',
      responsibilities: 'Настройка CI/CD, мониторинг систем',
      created_at: '2024-01-05T14:00:00.000000Z'
    },
    {
      id: 6,
      name: 'UI/UX дизайнер',
      description: 'Создание пользовательских интерфейсов',
      department_id: 4,
      organization_id: 2,
      salary: 400000,
      employee_count: 2,
      status: 'active',
      requirements: 'Знание Figma, Adobe Creative Suite',
      responsibilities: 'Создание макетов, прототипирование',
      created_at: '2024-01-06T16:00:00.000000Z'
    },
    {
      id: 7,
      name: 'Бухгалтер',
      description: 'Ведение финансового учета',
      department_id: 6,
      organization_id: 3,
      salary: 200000,
      employee_count: 1,
      status: 'inactive',
      requirements: 'Высшее экономическое образование',
      responsibilities: 'Ведение учета, составление отчетности',
      created_at: '2024-01-07T08:00:00.000000Z'
    }
  ]
}

const loadEmployees = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await userApi.getUsers({
      per_page: 50,
      search: searchQuery.value || undefined
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

const viewEmployee = (employee: User) => {
  selectedEmployee.value = employee
  showViewDialog.value = true
}

const editEmployee = (employee: User) => {
  selectedEmployee.value = employee
  showEditDialog.value = true
}

const confirmDelete = (employee: User) => {
  selectedEmployee.value = employee
  showDeleteDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedEmployee.value = null
}

const handleSave = async (employeeData: CreateUserData | UpdateUserData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedEmployee.value) {
      // Редактирование существующего сотрудника
      const response = await userApi.updateUser(selectedEmployee.value.id, employeeData as UpdateUserData)


      const index = employees.value.findIndex(emp => emp.id === selectedEmployee.value?.id)
      if (index !== -1) {
        // Проверяем формат ответа
        if (response.user) {
          employees.value[index] = response.user
        } else if (response.data && response.data.id) {
          employees.value[index] = response.data
        } else if (response.id) {
          employees.value[index] = response
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }
    } else {
      // Добавление нового сотрудника
      const response = await userApi.createUser(employeeData as CreateUserData)


      // Проверяем формат ответа
      if (response.user) {
        employees.value.push(response.user)
      } else if (response.data && response.data.id) {
        employees.value.push(response.data)
      } else if (response.id) {
        employees.value.push(response)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Сотрудник обновлен' : 'Сотрудник создан',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения сотрудника'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения сотрудника',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const deleteEmployee = async () => {
  if (!selectedEmployee.value) return

  try {
    loading.value = true

    await userApi.deleteUser(selectedEmployee.value.id)

    const index = employees.value.findIndex(emp => emp.id === selectedEmployee.value?.id)
    if (index !== -1) {
      employees.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Сотрудник удален',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления сотрудника'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления сотрудника',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadEmployees()
  }, 500)
})

onMounted(() => {
  loadEmployees()
  loadOrganizations()
  loadDepartments()
  loadPositions()
})
</script>

<style scoped>
/* Все стили в Tailwind CSS */
</style>
