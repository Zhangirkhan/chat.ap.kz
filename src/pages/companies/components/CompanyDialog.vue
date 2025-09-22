<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEdit ? 'Редактировать компанию' : 'Добавить компанию' }}
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Основная информация -->
          <div class="md:col-span-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Основная информация</h4>
          </div>

          <!-- Название компании -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Название компании *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите название компании"
            />
          </div>

          <!-- ИНН -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ИНН
            </label>
            <input
              v-model="formData.inn"
              type="text"
              maxlength="20"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="123456789012"
            />
          </div>

          <!-- КПП -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              КПП
            </label>
            <input
              v-model="formData.kpp"
              type="text"
              maxlength="20"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="123456789"
            />
          </div>

          <!-- ОГРН -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ОГРН
            </label>
            <input
              v-model="formData.ogrn"
              type="text"
              maxlength="20"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="1234567890123"
            />
          </div>

          <!-- Контакты -->
          <div class="md:col-span-2 pt-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Контактная информация</h4>
          </div>

          <!-- Телефон -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон
            </label>
            <input
              v-model="formData.phone"
              type="tel"
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
              placeholder="info@company.kz"
            />
          </div>

          <!-- Сайт -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Веб-сайт
            </label>
            <input
              v-model="formData.website"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://company.kz"
            />
          </div>

          <!-- Адреса -->
          <div class="md:col-span-2 pt-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Адреса</h4>
          </div>

          <!-- Юридический адрес -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Юридический адрес
            </label>
            <textarea
              v-model="formData.legal_address"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите юридический адрес"
            ></textarea>
          </div>

          <!-- Фактический адрес -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Фактический адрес
            </label>
            <textarea
              v-model="formData.actual_address"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите фактический адрес"
            ></textarea>
          </div>

          <!-- Контактное лицо -->
          <div class="md:col-span-2 pt-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Контактное лицо</h4>
          </div>

          <!-- ФИО контактного лица -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ФИО
            </label>
            <input
              v-model="formData.contact_person"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <!-- Телефон контактного лица -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон
            </label>
            <input
              v-model="formData.contact_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+7 (777) 987-65-43"
            />
          </div>

          <!-- Email контактного лица -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email контактного лица
            </label>
            <input
              v-model="formData.contact_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="contact@company.kz"
            />
          </div>

          <!-- Банковские реквизиты -->
          <div class="md:col-span-2 pt-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Банковские реквизиты</h4>
          </div>

          <!-- Наименование банка -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Наименование банка
            </label>
            <input
              v-model="formData.bank_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="АО Казкоммерцбанк"
            />
          </div>

          <!-- Расчетный счет -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Расчетный счет
            </label>
            <input
              v-model="formData.bank_account"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="12345678901234567890"
            />
          </div>

          <!-- БИК -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              БИК
            </label>
            <input
              v-model="formData.bik"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="123456789"
            />
          </div>

          <!-- Статус -->
          <div class="md:col-span-2 pt-4">
            <label class="flex items-center">
              <input
                v-model="formData.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Активная компания</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {{ isEdit ? 'Обновить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Company, CreateCompanyData, UpdateCompanyData } from '@/shared/api/companies'

interface Props {
  company?: Company
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<{
  close: []
  save: [data: CreateCompanyData | UpdateCompanyData]
}>()

const formData = ref<CreateCompanyData>({
  name: '',
  inn: '',
  kpp: '',
  ogrn: '',
  legal_address: '',
  actual_address: '',
  phone: '',
  email: '',
  website: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  bank_name: '',
  bank_account: '',
  bik: '',
  is_active: true
})

// Заполняем форму данными при редактировании
watch(() => props.company, (company) => {
  if (company) {
    formData.value = {
      name: company.name,
      inn: company.inn || '',
      kpp: company.kpp || '',
      ogrn: company.ogrn || '',
      legal_address: company.legal_address || '',
      actual_address: company.actual_address || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      contact_person: company.contact_person || '',
      contact_phone: company.contact_phone || '',
      contact_email: company.contact_email || '',
      bank_name: company.bank_name || '',
      bank_account: company.bank_account || '',
      bik: company.bik || '',
      is_active: company.is_active
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', formData.value)
}
</script>
