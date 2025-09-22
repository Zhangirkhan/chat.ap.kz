<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Редактировать должность' : 'Добавить должность' }}
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
              Название должности *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите название должности"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Организация *
            </label>
            <select
              v-model="form.organization_id"
              required
              @change="onOrganizationChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите организацию</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">
                {{ org.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Отдел *
            </label>
            <select
              v-model="form.department_id"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите отдел</option>
              <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Активна</option>
              <option value="inactive">Неактивна</option>
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
            placeholder="Введите описание должности"
          ></textarea>
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
import { ref, reactive, computed, watch, onMounted } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  departments: {
    type: Array,
    default: () => []
  },
  organizations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  organization_id: '',
  department_id: '',
  status: 'active'
})

// Фильтрация отделов по выбранной организации
const filteredDepartments = computed(() => {
  if (!form.organization_id) return []
  return props.departments.filter(dept => dept.organization_id == form.organization_id)
})

// Обработка изменения организации
const onOrganizationChange = () => {
  form.department_id = '' // Сбрасываем выбор отдела при смене организации
}

// Инициализация формы
const initForm = () => {
  if (props.position) {
    Object.assign(form, {
      name: props.position.name || '',
      description: props.position.description || '',
      organization_id: props.position.organization_id || '',
      department_id: props.position.department_id || '',
      status: props.position.status || 'active'
    })
  } else {
    Object.assign(form, {
      name: '',
      description: '',
      organization_id: '',
      department_id: '',
      status: 'active'
    })
  }
}

// Отправка формы
const handleSubmit = async () => {
  loading.value = true

  try {
    // Здесь будет API запрос для сохранения
    await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация загрузки

    emit('save', {
      ...form,
      id: props.position?.id
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Следим за изменениями position
watch(() => props.position, initForm, { immediate: true })

onMounted(() => {
  initForm()
})
</script>
