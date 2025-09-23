<template>
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
      @click="$emit('addEmployee')"
      class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
    >
      <i class="pi pi-plus"></i>
      Добавить сотрудника
    </button>
  </div>
</template>

<script setup lang="ts">
import { useEmployeeFilters } from '@/shared/composables/useEmployeeFilters'

interface Props {
  employees: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addEmployee: []
}>()

const { searchQuery } = useEmployeeFilters(props.employees)
</script>
