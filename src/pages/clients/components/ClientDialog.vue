<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEdit ? 'Редактировать клиента' : 'Добавить клиента' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="space-y-6">
          <!-- Имя клиента -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имя клиента *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите имя клиента"
            />
          </div>

          <!-- Телефон -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон *
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+7 (777) 123-45-67"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="client@example.com"
            />
          </div>

          <!-- Компания -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Компания
            </label>
            <div class="space-y-3">
              <!-- Поиск существующей компании -->
              <div>
                <select
                  v-model="selectedCompanyId"
                  @change="handleCompanySelect"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Выберите компанию (необязательно)</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.name }} {{ company.inn ? `(${company.inn})` : '' }}
                  </option>
                </select>
              </div>

              <!-- Или создать новую компанию -->
              <div class="text-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">или</span>
              </div>

              <div>
                <input
                  v-model="newCompanyName"
                  @input="handleNewCompanyInput"
                  type="text"
                  :disabled="isSubmitting"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="Введите название новой компании"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span v-if="isCreatingCompany" class="text-blue-600 dark:text-blue-400">
                    <i class="pi pi-spin pi-spinner mr-1"></i>
                    Создаем компанию...
                  </span>
                  <span v-else>
                    Если компании нет в списке, введите её название - она будет создана автоматически
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Комментарий -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Комментарий
            </label>
            <textarea
              v-model="formData.comment"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Дополнительная информация о клиенте"
            ></textarea>
          </div>

          <!-- Статус -->
          <div>
            <label class="flex items-center">
              <input
                v-model="formData.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Активный клиент</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            :disabled="isSubmitting"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
            <span v-if="isCreatingCompany">Создаем компанию...</span>
            <span v-else-if="isSubmitting">{{ isEdit ? 'Обновляем...' : 'Создаем...' }}</span>
            <span v-else>{{ isEdit ? 'Обновить' : 'Создать' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Client, CreateClientData, UpdateClientData, Company } from '@/shared/api/clients'
import { companiesApi } from '@/shared/api/companies'

interface Props {
  client?: Client
  isEdit?: boolean
  companies: Company[]
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<{
  close: []
  save: [data: CreateClientData | UpdateClientData]
}>()

const formData = ref<CreateClientData>({
  name: '',
  phone: '',
  email: '',
  comment: '',
  company_id: undefined,
  is_active: true
})

const selectedCompanyId = ref<number | ''>('')
const newCompanyName = ref('')
const isCreatingCompany = ref(false)
const isSubmitting = ref(false)

// Заполняем форму данными при редактировании
watch(() => props.client, (client) => {
  if (client) {
    formData.value = {
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      comment: client.comment || '',
      company_id: client.company_id,
      is_active: client.is_active
    }
    selectedCompanyId.value = client.company_id || ''
  }
}, { immediate: true })

const handleCompanySelect = () => {
  if (selectedCompanyId.value) {
    formData.value.company_id = Number(selectedCompanyId.value)
    newCompanyName.value = ''
  } else {
    formData.value.company_id = undefined
  }
}

const handleNewCompanyInput = () => {
  if (newCompanyName.value.trim()) {
    selectedCompanyId.value = ''
    formData.value.company_id = undefined
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    const clientData = { ...formData.value }

    // Если введено название новой компании, создаем её
    if (newCompanyName.value.trim()) {
      isCreatingCompany.value = true

      try {
        const companyResponse = await companiesApi.createCompany({
          name: newCompanyName.value.trim(),
          is_active: true
        })

        if (companyResponse.company) {
          clientData.company_id = companyResponse.company.id
        } else {
          throw new Error('Не удалось получить данные созданной компании')
        }
      } catch (companyError) {

        // Показываем ошибку пользователю, но НЕ отменяем создание клиента
        // Пользователь может выбрать: создать клиента без компании или отменить
        const errorMessage = companyError instanceof Error
          ? companyError.message
          : 'Не удалось создать компанию'

        if (confirm(`Ошибка создания компании "${newCompanyName.value.trim()}": ${errorMessage}\n\nВсе равно создать клиента без компании?`)) {
          // Пользователь согласился создать клиента без компании
          clientData.company_id = undefined
        } else {
          // Пользователь отменил создание клиента
          return
        }
      } finally {
        isCreatingCompany.value = false
      }
    }

    emit('save', clientData)
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Неизвестная ошибка при создании клиента'
    alert(`Ошибка: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
