<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <!-- Мобильная версия (карточки) -->
      <div class="block lg:hidden space-y-4 p-6">
        <OrganizationMobileCard
          v-for="organization in organizations"
          :key="organization.id"
          :organization="organization"
          @view="$emit('view', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>

      <!-- Десктопная версия (таблица) -->
      <div class="hidden lg:block">
        <table class="w-full min-w-[800px]">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Название</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Описание</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Отделы</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Пользователи</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Статус</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '@/shared/lib/types'
import OrganizationTableRow from './OrganizationTableRow.vue'
import OrganizationMobileCard from './OrganizationMobileCard.vue'

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
