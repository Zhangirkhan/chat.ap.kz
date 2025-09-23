<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div class="flex-1 max-w-lg">
        <div class="relative">
          <i class="pi pi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по названию, slug или описанию..."
            class="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 font-inter text-sm"
          />
        </div>
      </div>
      <button
        @click="$emit('addOrganization')"
        class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl font-medium font-inter"
      >
        <i class="pi pi-plus text-sm"></i>
        Добавить организацию
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrganizationFilters } from '@/shared/composables/useOrganizationFilters'

interface Props {
  organizations: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addOrganization: []
}>()

const { searchQuery } = useOrganizationFilters(props.organizations)
</script>
