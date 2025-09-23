<template>
  <tr>
    <td>{{ department.id }}</td>
    <td>
      <div class="department-name">
        <strong>{{ department.name }}</strong>
        <p v-if="department.description" class="description">
          {{ department.description }}
        </p>
      </div>
    </td>
    <td>
      <span class="organization-name">
        {{ getOrganizationName(department.organization_id) }}
      </span>
    </td>
    <td>
      <span class="count-badge count-badge--warning">{{ department.supervisors_count }}</span>
    </td>
    <td>
      <span class="count-badge count-badge--info">{{ department.managers_count }}</span>
    </td>
    <td>
      <span class="count-badge count-badge--success">{{ department.users_count }}</span>
    </td>
    <td>
      <span class="status-badge" :class="getStatusClasses(department.status)">
        {{ getStatusLabel(department.status) }}
      </span>
    </td>
    <td>{{ formatDate(department.created_at) }}</td>
    <td>
      <div class="action-buttons">
        <Button
          variant="secondary"
          size="small"
          icon="pi pi-eye"
          @click="$emit('view', department)"
        />
        <Button
          variant="secondary"
          size="small"
          icon="pi pi-pencil"
          @click="$emit('edit', department)"
        />
        <Button
          variant="secondary"
          size="small"
          icon="pi pi-users"
          @click="$emit('manageStaff', department)"
        />
        <Button
          variant="danger"
          size="small"
          icon="pi pi-trash"
          @click="$emit('delete', department)"
        />
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Department } from '@/shared/lib/types'
import { useDepartmentFilters } from '@/shared/composables/useDepartmentFilters'
import { useOrganizationData } from '@/shared/composables/useOrganizationData'

interface Props {
  department: Department
}

defineProps<Props>()

const emit = defineEmits<{
  view: [department: Department]
  edit: [department: Department]
  manageStaff: [department: Department]
  delete: [department: Department]
}>()

const { getStatusLabel, getStatusClasses, formatDate } = useDepartmentFilters({ value: [] })
const { getOrganizationName } = useOrganizationData()
</script>

<style scoped>
.department-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.department-name strong {
  font-weight: 600;
  color: #1f2937;
}

.description {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.organization-name {
  font-weight: 500;
  color: #374151;
}

.count-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.count-badge--warning {
  background-color: #fff3cd;
  color: #856404;
}

.count-badge--info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.count-badge--success {
  background-color: #d4edda;
  color: #155724;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge--success {
  background-color: #d4edda;
  color: #155724;
}

.status-badge--warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge--info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
