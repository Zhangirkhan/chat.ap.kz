<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ client?.name }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
      </div>

      <div class="p-6">
        <div class="space-y-6">
          <!-- Основная информация -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-user text-blue-500"></i>
              Основная информация
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Имя:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ client?.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Телефон:</span>
                <a :href="`tel:${client?.phone}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">{{ client?.phone }}</a>
              </div>
              <div class="flex justify-between" v-if="client?.email">
                <span class="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                <a :href="`mailto:${client?.email}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">{{ client.email }}</a>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Статус:</span>
                <span :class="[
                  'text-sm px-2 py-1 rounded-full',
                  client?.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                ]">
                  {{ client?.is_active ? 'Активен' : 'Неактивен' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Компания -->
          <div v-if="client?.company">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-briefcase text-purple-500"></i>
              Компания
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Название:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ client.company.name }}</span>
              </div>
              <div class="flex justify-between" v-if="client.company.inn">
                <span class="text-sm text-gray-600 dark:text-gray-400">ИНН:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ client.company.inn }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Статус компании:</span>
                <span :class="[
                  'text-sm px-2 py-1 rounded-full',
                  client.company.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                ]">
                  {{ client.company.is_active ? 'Активна' : 'Неактивна' }}
                </span>
              </div>
            </div>
          </div>

          <div v-else>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-briefcase text-gray-400"></i>
              Компания
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <span class="text-sm text-gray-500 dark:text-gray-400">Клиент не привязан к компании</span>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div v-if="client?.comment || client?.uuid_wazzup">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-info-circle text-yellow-500"></i>
              Дополнительная информация
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div v-if="client?.comment">
                <span class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Комментарий:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ client.comment }}</span>
              </div>
              <div v-if="client?.uuid_wazzup">
                <span class="text-sm text-gray-600 dark:text-gray-400 block mb-1">UUID Wazzup:</span>
                <span class="text-sm text-gray-900 dark:text-white font-mono">{{ client.uuid_wazzup }}</span>
              </div>
            </div>
          </div>

          <!-- Системная информация -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-calendar text-indigo-500"></i>
              Системная информация
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ client?.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Дата создания:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(client?.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Последнее обновление:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(client?.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Client } from '@/shared/api/clients'

interface Props {
  client?: Client
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
