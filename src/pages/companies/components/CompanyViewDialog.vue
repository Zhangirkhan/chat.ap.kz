<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ company?.name }}
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Основная информация -->
          <div class="md:col-span-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-building text-blue-500"></i>
              Основная информация
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Название:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ company?.name }}</span>
              </div>
              <div class="flex justify-between" v-if="company?.inn">
                <span class="text-sm text-gray-600 dark:text-gray-400">ИНН:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.inn }}</span>
              </div>
              <div class="flex justify-between" v-if="company?.kpp">
                <span class="text-sm text-gray-600 dark:text-gray-400">КПП:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.kpp }}</span>
              </div>
              <div class="flex justify-between" v-if="company?.ogrn">
                <span class="text-sm text-gray-600 dark:text-gray-400">ОГРН:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.ogrn }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Статус:</span>
                <span :class="[
                  'text-sm px-2 py-1 rounded-full',
                  company?.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                ]">
                  {{ company?.is_active ? 'Активна' : 'Неактивна' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Контактная информация -->
          <div class="md:col-span-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-phone text-green-500"></i>
              Контактная информация
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between" v-if="company?.phone">
                <span class="text-sm text-gray-600 dark:text-gray-400">Телефон:</span>
                <a :href="`tel:${company.phone}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">{{ company.phone }}</a>
              </div>
              <div class="flex justify-between" v-if="company?.email">
                <span class="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                <a :href="`mailto:${company.email}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">{{ company.email }}</a>
              </div>
              <div class="flex justify-between" v-if="company?.website">
                <span class="text-sm text-gray-600 dark:text-gray-400">Веб-сайт:</span>
                <a :href="company.website" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">{{ company.website }}</a>
              </div>
            </div>
          </div>

          <!-- Адреса -->
          <div class="md:col-span-2" v-if="company?.legal_address || company?.actual_address">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-map-marker text-red-500"></i>
              Адреса
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div v-if="company?.legal_address">
                <span class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Юридический адрес:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.legal_address }}</span>
              </div>
              <div v-if="company?.actual_address">
                <span class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Фактический адрес:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.actual_address }}</span>
              </div>
            </div>
          </div>

          <!-- Контактное лицо -->
          <div class="md:col-span-2" v-if="company?.contact_person || company?.contact_phone || company?.contact_email">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-user text-purple-500"></i>
              Контактное лицо
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between" v-if="company?.contact_person">
                <span class="text-sm text-gray-600 dark:text-gray-400">ФИО:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.contact_person }}</span>
              </div>
              <div class="flex justify-between" v-if="company?.contact_phone">
                <span class="text-sm text-gray-600 dark:text-gray-400">Телефон:</span>
                <a :href="`tel:${company.contact_phone}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">{{ company.contact_phone }}</a>
              </div>
              <div class="flex justify-between" v-if="company?.contact_email">
                <span class="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                <a :href="`mailto:${company.contact_email}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">{{ company.contact_email }}</a>
              </div>
            </div>
          </div>

          <!-- Банковские реквизиты -->
          <div class="md:col-span-2" v-if="company?.bank_name || company?.bank_account || company?.bik">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-credit-card text-yellow-500"></i>
              Банковские реквизиты
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between" v-if="company?.bank_name">
                <span class="text-sm text-gray-600 dark:text-gray-400">Банк:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.bank_name }}</span>
              </div>
              <div class="flex justify-between" v-if="company?.bank_account">
                <span class="text-sm text-gray-600 dark:text-gray-400">Расчетный счет:</span>
                <span class="text-sm text-gray-900 dark:text-white font-mono">{{ company.bank_account }}</span>
              </div>
              <div class="flex justify-between" v-if="company?.bik">
                <span class="text-sm text-gray-600 dark:text-gray-400">БИК:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ company.bik }}</span>
              </div>
            </div>
          </div>

          <!-- Статистика -->
          <div class="md:col-span-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-chart-bar text-indigo-500"></i>
              Статистика
            </h4>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Количество клиентов:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ company?.clients_count || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Дата создания:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(company?.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Последнее обновление:</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(company?.updated_at) }}</span>
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
import type { Company } from '@/shared/api/companies'

interface Props {
  company?: Company
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
