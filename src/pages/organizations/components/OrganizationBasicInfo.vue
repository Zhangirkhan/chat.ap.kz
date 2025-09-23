<template>
  <div class="space-y-6">
    <!-- Основная информация -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Название организации *
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Введите название организации"
        />
      </div>

      <div v-if="form.slug">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Slug
        </label>
        <input
          v-model="form.slug"
          type="text"
          readonly
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          placeholder="Генерируется автоматически"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Уникальный идентификатор организации (генерируется автоматически)
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Телефон <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.phone"
          v-phone
          type="tel"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="+7 777 123 45 67"
        />
        <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Статус
        </label>
        <select
          v-model="form.is_active"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option :value="true">Активна</option>
          <option :value="false">Неактивна</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Описание
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="Введите описание организации"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrganizationFormData } from '@/shared/composables/useOrganizationForm'

interface Props {
  form: OrganizationFormData
  errors: {
    phone: string
  }
}

defineProps<Props>()
</script>
