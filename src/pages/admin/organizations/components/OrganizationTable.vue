<template>
  <Card class="organizations-table-card">
    <div class="table-container">
      <table class="organizations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Телефон</th>
            <th>Отделы</th>
            <th>Пользователи</th>
            <th>Статус</th>
            <th>Создано</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <OrganizationTableRow
            v-for="organization in organizations"
            :key="organization.id"
            :organization="organization"
            @view="$emit('view', $event)"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Organization } from '@/shared/lib/types'
import OrganizationTableRow from './OrganizationTableRow.vue'

interface Props {
  organizations: Organization[]
}

defineProps<Props>()

const emit = defineEmits<{
  view: [organization: Organization]
  edit: [organization: Organization]
  delete: [organization: Organization]
}>()
</script>

<style scoped>
.organizations-table-card {
  margin-bottom: 24px;
}

.table-container {
  overflow-x: auto;
}

.organizations-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.organizations-table th,
.organizations-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.organizations-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.organizations-table tbody tr:hover {
  background-color: #f9fafb;
}

.organizations-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
