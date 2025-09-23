<template>
  <Card class="filters-card">
    <div class="filters-row">
      <Input
        v-model="searchQuery"
        placeholder="Поиск по названию, телефону, описанию..."
        icon="pi pi-search"
        class="search-input"
      />
      <Select
        v-model="statusFilter"
        :options="statusOptions"
        placeholder="Все статусы"
        class="status-filter"
      />
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
import { useOrganizationFilters } from '@/shared/composables/useOrganizationFilters'

interface Props {
  organizations: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refresh: []
}>()

const { searchQuery, statusFilter, statusOptions } = useOrganizationFilters(props.organizations)
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

.status-filter {
  min-width: 150px;
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .status-filter {
    min-width: auto;
  }
}
</style>
