<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ employee.id }}</td>
    
    <!-- Сотрудник -->
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
    
    <!-- Должность -->
    <td class="px-3 py-3 whitespace-nowrap text-sm truncate">
      <span v-if="employee.position" class="text-gray-900 dark:text-white">{{ employee.position }}</span>
      <span v-else class="inline-flex px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Система</span>
    </td>
    
    <!-- Отдел -->
    <td class="px-3 py-3 whitespace-nowrap text-sm truncate">
      <span v-if="employee.department?.name" class="text-gray-900 dark:text-white">{{ employee.department.name }}</span>
      <span v-else class="inline-flex px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Система</span>
    </td>
    
    <!-- Организация -->
    <td class="px-3 py-3 whitespace-nowrap text-sm">
      <div v-if="employee.organization">
        <span class="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded">
          {{ employee.organization.name }}
        </span>
      </div>
      <div v-else>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Система</span>
      </div>
    </td>
    
    <!-- Роль -->
    <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
      <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getRoleClasses(employee.role)]">
        {{ getRoleLabel(employee.role) }}
      </span>
    </td>
    
    <!-- Статус -->
    <td class="px-3 py-3 whitespace-nowrap">
      <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusClasses(employee.status)]">
        {{ getStatusLabel(employee.status) }}
      </span>
    </td>
    
    <!-- Действия -->
    <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
      <div class="flex items-center gap-1">
        <button
          @click="$emit('view', employee)"
          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
          title="Просмотр"
        >
          <i class="pi pi-eye"></i>
        </button>
        <button
          @click="$emit('edit', employee)"
          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
          title="Редактировать"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('changePassword', employee)"
          class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
          title="Сменить пароль"
        >
          <i class="pi pi-key"></i>
        </button>
        <button
          @click="$emit('delete', employee)"
          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
          title="Удалить"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { User } from '@/shared/lib/types'
import { useEmployeeFilters } from '@/shared/composables/useEmployeeFilters'

interface Props {
  employee: User
}

defineProps<Props>()

const emit = defineEmits<{
  view: [employee: User]
  edit: [employee: User]
  changePassword: [employee: User]
  delete: [employee: User]
}>()

const { getRoleLabel, getRoleClasses, getStatusClasses, getStatusLabel } = useEmployeeFilters({ value: [] })
</script>
