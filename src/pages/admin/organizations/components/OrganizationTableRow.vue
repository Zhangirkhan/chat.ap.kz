<template>
  <tr>
    <td>{{ organization.id }}</td>
    <td>
      <div class="organization-name">
        <strong>{{ organization.name }}</strong>
        <p v-if="organization.description" class="description">
          {{ organization.description }}
        </p>
      </div>
    </td>
    <td>{{ organization.phone || '-' }}</td>
    <td>
      <Badge :value="organization.departments_count" severity="info" />
    </td>
    <td>
      <Badge :value="organization.users_count" severity="success" />
    </td>
    <td>
      <Badge
        :value="getStatusLabel(organization.status)"
        :severity="getStatusSeverity(organization.status)"
      />
    </td>
    <td>{{ formatDate(organization.created_at) }}</td>
    <td>
      <div class="action-buttons">
        <Button
          variant="secondary"
          size="small"
          icon="pi pi-eye"
          @click="$emit('view', organization)"
        />
        <Button
          variant="secondary"
          size="small"
          icon="pi pi-pencil"
          @click="$emit('edit', organization)"
        />
        <Button
          variant="danger"
          size="small"
          icon="pi pi-trash"
          @click="$emit('delete', organization)"
        />
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Organization } from '@/shared/lib/types'
import { useOrganizationFilters } from '@/shared/composables/useOrganizationFilters'

interface Props {
  organization: Organization
}

defineProps<Props>()

const emit = defineEmits<{
  view: [organization: Organization]
  edit: [organization: Organization]
  delete: [organization: Organization]
}>()

const { getStatusLabel, getStatusSeverity, formatDate } = useOrganizationFilters({ value: [] })
</script>

<style scoped>
.organization-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.organization-name strong {
  font-weight: 600;
  color: #1f2937;
}

.description {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
