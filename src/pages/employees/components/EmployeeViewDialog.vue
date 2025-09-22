<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Информация о сотруднике
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Содержимое -->
      <div class="p-6 space-y-6">
        <!-- Основная информация -->
        <div class="flex items-start gap-6">
          <!-- Аватар -->
          <div class="flex-shrink-0">
            <div class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <span class="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {{ employee.name.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- Основная информация -->
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ employee.name }}</h3>
            <div class="flex items-center gap-4 mb-4">
              <span :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                employee.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              ]">
                {{ employee.status === 'active' ? 'Активен' : 'Неактивен' }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                <a :href="`mailto:${employee.email}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {{ employee.email }}
                </a>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Телефон</label>
                <a :href="`tel:${employee.phone}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {{ employee.phone }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Рабочая информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Рабочая информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Организация</label>
              <p class="text-gray-900 dark:text-white">{{ getOrganizationName(employee.organization_id) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Отдел</label>
              <p class="text-gray-900 dark:text-white">{{ getDepartmentName(employee.department_id) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Должность</label>
              <p class="text-gray-900 dark:text-white">{{ getPositionName(employee.position_id) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Дата приема</label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(employee.hire_date) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Зарплата</label>
              <p class="text-gray-900 dark:text-white">{{ formatSalary(employee.salary) }}</p>
            </div>
          </div>
        </div>

        <!-- Личная информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Личная информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="employee.birth_date">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Дата рождения</label>
              <p class="text-gray-900 dark:text-white">{{ formatDate(employee.birth_date) }}</p>
            </div>

            <div v-if="employee.passport">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Паспорт</label>
              <p class="text-gray-900 dark:text-white">{{ employee.passport }}</p>
            </div>

            <div v-if="employee.address" class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Адрес</label>
              <p class="text-gray-900 dark:text-white">{{ employee.address }}</p>
            </div>
          </div>
        </div>

        <!-- Информация о должности -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Информация о должности</h3>

          <div v-if="getPosition(employee.position_id)" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Название:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getPosition(employee.position_id).name }}</span>
            </div>
            <div v-if="getPosition(employee.position_id).description" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Описание:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getPosition(employee.position_id).description }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Зарплата по должности:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ formatSalary(getPosition(employee.position_id).salary) }}</span>
            </div>
            <div v-if="getPosition(employee.position_id).requirements" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Требования:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getPosition(employee.position_id).requirements }}</span>
            </div>
          </div>
        </div>

        <!-- Информация об отделе -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Информация об отделе</h3>

          <div v-if="getDepartment(employee.department_id)" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Название:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(employee.department_id).name }}</span>
            </div>
            <div v-if="getDepartment(employee.department_id).description" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Описание:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(employee.department_id).description }}</span>
            </div>
            <div v-if="getDepartment(employee.department_id).manager" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Руководитель:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(employee.department_id).manager }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Сотрудников в отделе:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(employee.department_id).employee_count || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Информация об организации -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Информация об организации</h3>

          <div v-if="getOrganization(employee.organization_id)" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Название:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getOrganization(employee.organization_id).name }}</span>
            </div>
            <div v-if="getOrganization(employee.organization_id).email" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
              <a :href="`mailto:${getOrganization(employee.organization_id).email}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ getOrganization(employee.organization_id).email }}
              </a>
            </div>
            <div v-if="getOrganization(employee.organization_id).phone" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Телефон:</span>
              <a :href="`tel:${getOrganization(employee.organization_id).phone}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ getOrganization(employee.organization_id).phone }}
              </a>
            </div>
            <div v-if="getOrganization(employee.organization_id).address" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Адрес:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getOrganization(employee.organization_id).address }}</span>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика</h3>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Дата создания записи:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(employee.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  },
  positions: {
    type: Array,
    default: () => []
  },
  departments: {
    type: Array,
    default: () => []
  },
  organizations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

// Получение должности по ID
const getPosition = (positionId: any) => {
  return props.positions.find(pos => pos.id === positionId)
}

// Получение отдела по ID
const getDepartment = (departmentId: any) => {
  return props.departments.find(dept => dept.id === departmentId)
}

// Получение организации по ID
const getOrganization = (organizationId: any) => {
  return props.organizations.find(org => org.id === organizationId)
}

// Получение названия должности
const getPositionName = (positionId: any) => {
  const pos = getPosition(positionId)
  return pos ? pos.name : 'Неизвестная должность'
}

// Получение названия отдела
const getDepartmentName = (departmentId: any) => {
  const dept = getDepartment(departmentId)
  return dept ? dept.name : 'Неизвестный отдел'
}

// Получение названия организации
const getOrganizationName = (organizationId: any) => {
  const org = getOrganization(organizationId)
  return org ? org.name : 'Неизвестная организация'
}

// Форматирование зарплаты
const formatSalary = (salary: any) => {
  if (!salary || salary === 0) return 'Не указана'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(salary)
}

// Форматирование даты
const formatDate = (dateString: any) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
