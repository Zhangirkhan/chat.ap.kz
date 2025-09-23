<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
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
          <EmployeeTableRow
            v-for="employee in employees"
            :key="employee.id"
            :employee="employee"
            @view="$emit('view', $event)"
            @edit="$emit('edit', $event)"
            @change-password="$emit('changePassword', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/shared/lib/types'
import EmployeeTableRow from './EmployeeTableRow.vue'

interface Props {
  employees: User[]
}

defineProps<Props>()

const emit = defineEmits<{
  view: [employee: User]
  edit: [employee: User]
  changePassword: [employee: User]
  delete: [employee: User]
}>()
</script>
