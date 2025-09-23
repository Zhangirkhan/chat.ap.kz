<template>
  <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 space-y-4">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900 dark:text-white font-inter text-lg mb-1">
          {{ organization.name }}
        </h3>
        <p class="text-sm text-gray-900 dark:text-gray-400 font-inter">
          ID: {{ organization.id }}
        </p>
      </div>
      <span :class="[
        'inline-flex px-3 py-1 text-xs font-semibold rounded-full font-inter',
        organization.is_active
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      ]">
        {{ organization.is_active ? 'Активна' : 'Неактивна' }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span class="text-gray-900 dark:text-gray-400 font-inter">Slug:</span>
        <p class="text-gray-900 dark:text-white font-inter mt-1">{{ organization.slug || '-' }}</p>
      </div>
      <div>
        <span class="text-gray-900 dark:text-gray-400 font-inter">Описание:</span>
        <p class="text-gray-900 dark:text-white font-inter mt-1">{{ organization.description || '-' }}</p>
      </div>
      <div>
        <span class="text-gray-900 dark:text-gray-400 font-inter">Отделы:</span>
        <div class="flex items-center gap-2 mt-1">
          <i class="pi pi-building text-gray-400 text-xs"></i>
          <span class="text-gray-900 dark:text-white font-inter">{{ organization.departments_count || 0 }}</span>
        </div>
      </div>
      <div>
        <span class="text-gray-900 dark:text-gray-400 font-inter">Пользователи:</span>
        <div class="flex items-center gap-2 mt-1">
          <i class="pi pi-users text-gray-400 text-xs"></i>
          <span class="text-gray-900 dark:text-white font-inter">{{ organization.users_count || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
      <div class="text-xs text-gray-500 dark:text-gray-400 font-inter">
        Создано: {{ formatDate(organization.created_at) }}
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="$emit('view', organization)"
          class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
          title="Просмотр"
        >
          <i class="pi pi-eye text-sm"></i>
        </button>
        <button
          @click="$emit('edit', organization)"
          class="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
          title="Редактировать"
        >
          <i class="pi pi-pencil text-sm"></i>
        </button>
        <button
          @click="$emit('delete', organization)"
          class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          title="Удалить"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>
  </div>
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

const { formatDate } = useOrganizationFilters({ value: [] })
</script>
