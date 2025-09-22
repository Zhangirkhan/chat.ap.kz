<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Информация о контрагенте
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Содержимое -->
      <div class="p-6 space-y-6">
        <!-- Основная информация -->
        <div class="flex items-start gap-6">
          <!-- Аватар -->
          <div class="flex-shrink-0">
            <div class="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <span class="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {{ contractor.name.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- Основная информация -->
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ contractor.name }}</h3>
            <div v-if="contractor.company" class="text-lg text-gray-600 dark:text-gray-400 mb-2">{{ contractor.company }}</div>
            <div class="flex items-center gap-4 mb-4">
              <span :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                contractor.type === 'individual'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              ]">
                {{ contractor.type === 'individual' ? 'Физическое лицо' : 'Юридическое лицо' }}
              </span>
              <span :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                contractor.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              ]">
                {{ contractor.status === 'active' ? 'Активен' : 'Неактивен' }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                <a :href="`mailto:${contractor.email}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {{ contractor.email }}
                </a>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Телефон</label>
                <a :href="`tel:${contractor.phone}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {{ contractor.phone }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Контактная информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Контактная информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="contractor.address">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Адрес</label>
              <p class="text-gray-900 dark:text-white">{{ contractor.address }}</p>
            </div>

            <div v-if="contractor.contact_person">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Контактное лицо</label>
              <p class="text-gray-900 dark:text-white">{{ contractor.contact_person }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Организация</label>
              <p class="text-gray-900 dark:text-white">{{ getOrganizationName(contractor.organization_id) }}</p>
            </div>
          </div>
        </div>

        <!-- Реквизиты -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Реквизиты</h3>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="contractor.inn">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ИНН</label>
                <p class="text-gray-900 dark:text-white font-mono">{{ contractor.inn }}</p>
              </div>

              <div v-if="contractor.kpp">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">КПП</label>
                <p class="text-gray-900 dark:text-white font-mono">{{ contractor.kpp }}</p>
              </div>

              <div v-if="contractor.bank">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Банк</label>
                <p class="text-gray-900 dark:text-white">{{ contractor.bank }}</p>
              </div>

              <div v-if="contractor.bik">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">БИК</label>
                <p class="text-gray-900 dark:text-white font-mono">{{ contractor.bik }}</p>
              </div>

              <div v-if="contractor.account" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Расчетный счет</label>
                <p class="text-gray-900 dark:text-white font-mono">{{ contractor.account }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Примечания -->
        <div v-if="contractor.notes" class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Примечания</h3>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-900 dark:text-white whitespace-pre-line">{{ contractor.notes }}</p>
          </div>
        </div>

        <!-- Информация об организации -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Информация об организации</h3>

          <div v-if="getOrganization(contractor.organization_id)" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Название:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getOrganization(contractor.organization_id).name }}</span>
            </div>
            <div v-if="getOrganization(contractor.organization_id).email" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
              <a :href="`mailto:${getOrganization(contractor.organization_id).email}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ getOrganization(contractor.organization_id).email }}
              </a>
            </div>
            <div v-if="getOrganization(contractor.organization_id).phone" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Телефон:</span>
              <a :href="`tel:${getOrganization(contractor.organization_id).phone}`" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {{ getOrganization(contractor.organization_id).phone }}
              </a>
            </div>
            <div v-if="getOrganization(contractor.organization_id).address" class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Адрес:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ getOrganization(contractor.organization_id).address }}</span>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика</h3>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Дата создания записи:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(contractor.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  contractor: {
    type: Object as () => any,
    required: true
  },
  organizations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

// Получение организации по ID
const getOrganization = (organizationId: any) => {
  return props.organizations.find(org => org.id === organizationId)
}

// Получение названия организации
const getOrganizationName = (organizationId: any) => {
  const org = getOrganization(organizationId)
  return org ? org.name : 'Неизвестная организация'
}

// Форматирование даты
const formatDate = (dateString: any) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
