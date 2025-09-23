<template>
  <Card class="filters-card">
    <div class="filters-row">
      <Input
        v-model="searchQuery"
        placeholder="Поиск по названию отдела..."
        icon="pi pi-search"
        class="search-input"
      />
      <select
        v-model="organizationFilter"
        class="organization-filter"
      >
        <option value="">Все организации</option>
        <option v-for="org in organizationOptions" :key="org.value" :value="org.value">
          {{ org.label }}
        </option>
      </select>
      <select
        v-model="statusFilter"
        class="status-filter"
      >
        <option value="">Все статусы</option>
        <option v-for="status in statusOptions" :key="status.value" :value="status.value">
          {{ status.label }}
        </option>
      </select>
      <Button
        variant="secondary"
        icon="pi pi-refresh"
        @click="$emit('refresh')"
      >
        Обновить
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useDepartmentFilters } from '@/shared/composables/useDepartmentFilters'
import { useOrganizationData } from '@/shared/composables/useOrganizationData'

interface Props {
  departments: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refresh: []
}>()

const { searchQuery, organizationFilter, statusFilter } = useDepartmentFilters(props.departments)
const { organizationOptions, statusOptions } = useOrganizationData()
</script>

<style scoped>
.filters-card {
  margin-bottom: 24px;
}

.filters-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.organization-filter,
.status-filter {
  min-width: 150px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
}

.organization-filter:focus,
.status-filter:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .organization-filter,
  .status-filter {
    min-width: auto;
  }
}
</style>
