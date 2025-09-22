<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Редактировать контрагента' : 'Добавить контрагента' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Форма -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Основная информация -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ form.type === 'individual' ? 'ФИО' : 'Название компании' }} *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="form.type === 'individual' ? 'Введите ФИО' : 'Введите название компании'"
            />
          </div>

          <CompanySearch
            v-model="selectedCompany"
            placeholder="Начните вводить название компании..."
            @create-company="handleCreateCompany"
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите email"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон *
            </label>
            <input
              v-model="form.phone"
              v-phone
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="8 777 123 45 67"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>

          <div v-if="form.type === 'legal'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ИНН
            </label>
            <input
              v-model="form.inn"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите ИНН"
            />
          </div>
        </div>


        <!-- Кнопки -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-save"></i>
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import CompanySearch from './CompanySearch.vue'
import { organizationApi } from '@/entities/organization/api/organizationApi'
import type { Organization } from '@/shared/lib/types'

const props = defineProps({
  contractor: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  organizations: {
    type: Array,
    default: () => []
  }
})


const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const selectedCompany = ref<Organization | null>(null)

const form = reactive({
  name: '',
  type: 'individual',
  email: '',
  phone: '',
  organization_id: '',
  status: 'active',
  inn: ''
})

// Обработка изменения компании
const onOrganizationChange = () => {
  // Если выбрана компания - это юридическое лицо, иначе - физическое
  form.type = selectedCompany.value ? 'legal' : 'individual'
  form.organization_id = selectedCompany.value?.id?.toString() || ''
}

// Создание новой компании
const handleCreateCompany = async (companyName: string) => {
  try {
    loading.value = true

    const response = await organizationApi.createOrganization({
      name: companyName
    })

    // Обрабатываем разные форматы ответа
    let newCompany: Organization
    if (response.data && response.data.id) {
      newCompany = response.data
    } else if ((response as any).id) {
      newCompany = response as any
    } else {
      throw new Error('Неожиданный формат ответа от сервера')
    }

    selectedCompany.value = newCompany
    onOrganizationChange()
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Инициализация формы
const initForm = () => {
  if (props.contractor) {
    Object.assign(form, {
      name: props.contractor.name || '',
      type: props.contractor.type || 'individual',
      email: props.contractor.email || '',
      phone: props.contractor.phone || '',
      organization_id: props.contractor.organization_id || '',
      status: props.contractor.status || 'active',
      inn: props.contractor.inn || ''
    })

    // Если у контрагента есть связанная организация
    if (props.contractor.organization_id && props.organizations) {
      const org = props.organizations.find((o: any) => o.id === props.contractor.organization_id)
      if (org) {
        selectedCompany.value = org as Organization
      }
    }
  } else {
    Object.assign(form, {
      name: '',
      type: 'individual',
      email: '',
      phone: '',
      organization_id: '',
      status: 'active',
      inn: ''
    })
    selectedCompany.value = null
  }
}

// Валидация формы
const validateForm = () => {
  if (!form.name.trim()) {
    alert('Название контрагента обязательно')
    return false
  }
  return true
}

// Отправка формы
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    // Обновляем organization_id из выбранной компании
    form.organization_id = selectedCompany.value?.id?.toString() || ''

    emit('save', {
      ...form,
      id: props.contractor?.id
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Следим за изменениями contractor
watch(() => props.contractor, initForm, { immediate: true })

// Следим за изменениями selectedCompany
watch(selectedCompany, onOrganizationChange)

onMounted(() => {
  initForm()
})
</script>
