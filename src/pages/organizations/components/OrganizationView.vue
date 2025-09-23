<template>
  <div v-if="organization" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Название организации
        </label>
        <p class="text-gray-900 dark:text-white">{{ organization.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Телефон
        </label>
        <p class="text-gray-900 dark:text-white">{{ organization.phone }}</p>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Описание
      </label>
      <p class="text-gray-900 dark:text-white">{{ organization.description || 'Не указано' }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Статус
      </label>
      <span :class="[
        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
        organization.is_active
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      ]">
        {{ organization.is_active ? 'Активна' : 'Неактивна' }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Создано
        </label>
        <p class="text-gray-900 dark:text-white">{{ formatDate(organization.created_at) }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Обновлено
        </label>
        <p class="text-gray-900 dark:text-white">{{ formatDate(organization.updated_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '@/shared/lib/types'

interface Props {
  organization: Organization
}

defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
