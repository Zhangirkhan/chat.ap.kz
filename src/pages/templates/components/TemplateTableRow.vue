<template>
  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ template.id }}</td>
    <td class="px-3 py-3">
      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ template.name }}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
        {{ template.content.substring(0, 50) }}{{ template.content.length > 50 ? '...' : '' }}
      </div>
    </td>
    <td class="px-3 py-3 whitespace-nowrap">
      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        {{ getTypeLabel(template.type) }}
      </span>
    </td>
    <td class="px-3 py-3 whitespace-nowrap">
      <span :class="[
        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
        getCategoryColor(template.category)
      ]">
        {{ getCategoryLabel(template.category) }}
      </span>
    </td>
    <td class="px-3 py-3 whitespace-nowrap">
      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300">
        {{ getLanguageLabel(template.language) }}
      </span>
    </td>
    <td class="px-3 py-3 whitespace-nowrap">
      <span :class="[
        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
        template.is_active
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      ]">
        {{ template.is_active ? 'Активен' : 'Неактивен' }}
      </span>
    </td>
    <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
      <div class="flex items-center gap-1">
        <button
          @click="$emit('view', template)"
          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
          title="Просмотр"
        >
          <i class="pi pi-eye"></i>
        </button>
        <button
          v-if="!template.is_system"
          @click="$emit('edit', template)"
          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
          title="Редактировать"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('copy', template)"
          class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
          title="Копировать"
        >
          <i class="pi pi-copy"></i>
        </button>
        <button
          v-if="!template.is_system"
          @click="$emit('delete', template)"
          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
          title="Удалить"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Template } from '@/shared/api/templates'
import { useTemplateFilters } from '@/shared/composables/useTemplateFilters'

interface Props {
  template: Template
}

defineProps<Props>()

const emit = defineEmits<{
  view: [template: Template]
  edit: [template: Template]
  copy: [template: Template]
  delete: [template: Template]
}>()

const { getCategoryColor, getCategoryLabel, getTypeLabel, getLanguageLabel } = useTemplateFilters({ value: [] }, async () => {})
</script>
