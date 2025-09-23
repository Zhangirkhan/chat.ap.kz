<template>
  <Card class="departments-table-card">
    <div class="table-container">
      <table class="departments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Организация</th>
            <th>Руководители</th>
            <th>Менеджеры</th>
            <th>Пользователи</th>
            <th>Статус</th>
            <th>Создано</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <DepartmentTableRow
            v-for="department in departments"
            :key="department.id"
            :department="department"
            @view="$emit('view', $event)"
            @edit="$emit('edit', $event)"
            @manage-staff="$emit('manageStaff', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Department } from '@/shared/lib/types'
import DepartmentTableRow from './DepartmentTableRow.vue'

interface Props {
  departments: Department[]
}

defineProps<Props>()

const emit = defineEmits<{
  view: [department: Department]
  edit: [department: Department]
  manageStaff: [department: Department]
  delete: [department: Department]
}>()
</script>

<style scoped>
.departments-table-card {
  margin-bottom: 24px;
}

.table-container {
  overflow-x: auto;
}

.departments-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.departments-table th,
.departments-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.departments-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.departments-table tbody tr:hover {
  background-color: #f9fafb;
}

.departments-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
