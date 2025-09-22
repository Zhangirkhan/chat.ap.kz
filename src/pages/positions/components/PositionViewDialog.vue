<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Информация о должности
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Название должности
            </label>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ position.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Статус
            </label>
            <span :class="[
              'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
              position.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            ]">
              {{ position.status === 'active' ? 'Активна' : 'Неактивна' }}
            </span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Организация
            </label>
            <p class="text-gray-900 dark:text-white">
              {{ getOrganizationName(position.organization_id) }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Отдел
            </label>
            <p class="text-gray-900 dark:text-white">
              {{ getDepartmentName(position.department_id) }}
            </p>
          </div>

          <div v-if="position.description" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Описание
            </label>
            <p class="text-gray-900 dark:text-white">{{ position.description }}</p>
          </div>
        </div>

        <!-- Финансовая информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Финансовая информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-dollar text-green-500"></i>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Зарплата</span>
              </div>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatSalary(position.salary) }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-users text-blue-500"></i>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Сотрудников</span>
              </div>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {{ position.employee_count || 0 }}
              </p>
            </div>
          </div>
        </div>

        <!-- Требования и обязанности -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Требования и обязанности</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="position.requirements">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Требования
              </label>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p class="text-gray-900 dark:text-white whitespace-pre-line">{{ position.requirements }}</p>
              </div>
            </div>

            <div v-if="position.responsibilities">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Обязанности
              </label>
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p class="text-gray-900 dark:text-white whitespace-pre-line">{{ position.responsibilities }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Информация об отделе -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Информация об отделе</h3>

          <div v-if="getDepartment(position.department_id)" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Название:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(position.department_id).name }}</span>
            </div>
            <div v-if="getDepartment(position.department_id).description" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Описание:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(position.department_id).description }}</span>
            </div>
            <div v-if="getDepartment(position.department_id).manager" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Руководитель:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(position.department_id).manager }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Сотрудников в отделе:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getDepartment(position.department_id).employee_count || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Информация об организации -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Информация об организации</h3>

          <div v-if="getOrganization(position.organization_id)" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Название:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getOrganization(position.organization_id).name }}</span>
            </div>
            <div v-if="getOrganization(position.organization_id).email" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
              <a :href="`mailto:${getOrganization(position.organization_id).email}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ getOrganization(position.organization_id).email }}
              </a>
            </div>
            <div v-if="getOrganization(position.organization_id).phone" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Телефон:</span>
              <a :href="`tel:${getOrganization(position.organization_id).phone}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ getOrganization(position.organization_id).phone }}
              </a>
            </div>
            <div v-if="getOrganization(position.organization_id).address" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Адрес:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getOrganization(position.organization_id).address }}</span>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика</h3>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Дата создания:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(position.created_at) }}</span>
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
  position: {
    type: Object,
    required: true
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

// Получение отдела по ID
const getDepartment = (departmentId) => {
  return props.departments.find(dept => dept.id === departmentId)
}

// Получение организации по ID
const getOrganization = (organizationId) => {
  return props.organizations.find(org => org.id === organizationId)
}

// Получение названия отдела
const getDepartmentName = (departmentId) => {
  const dept = getDepartment(departmentId)
  return dept ? dept.name : 'Неизвестный отдел'
}

// Получение названия организации
const getOrganizationName = (organizationId) => {
  const org = getOrganization(organizationId)
  return org ? org.name : 'Неизвестная организация'
}

// Форматирование зарплаты
const formatSalary = (salary) => {
  if (!salary || salary === 0) return 'Не указана'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(salary)
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
