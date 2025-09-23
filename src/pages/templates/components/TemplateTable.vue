<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[700px]">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Название</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Тип</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Категория</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Язык</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <TemplateTableRow
            v-for="template in templates"
            :key="template.id"
            :template="template"
            @view="$emit('view', $event)"
            @edit="$emit('edit', $event)"
            @copy="$emit('copy', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Template } from '@/shared/api/templates'
import TemplateTableRow from './TemplateTableRow.vue'

interface Props {
  templates: Template[]
}

defineProps<Props>()

const emit = defineEmits<{
  view: [template: Template]
  edit: [template: Template]
  copy: [template: Template]
  delete: [template: Template]
}>()
</script>
