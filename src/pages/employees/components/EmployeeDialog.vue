<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Редактировать сотрудника' : 'Добавить сотрудника' }}
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
              ФИО *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите ФИО сотрудника"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              v-model="form.email"
              v-email
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Телефон
            </label>
            <input
              v-model="form.phone"
              v-phone
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+7 777 123 45 67"
            />
          </div>

          

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Роль
            </label>
            <select
              v-model="form.role"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Без роли</option>
              <option v-for="r in rolesOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
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
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>
        </div>

        

        <!-- Пароль по умолчанию -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="flex items-center">
            <input
              id="default_password"
              v-model="form.set_default_password"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="default_password" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Установить пароль по умолчанию 12345678
            </label>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Пользователь сможет сменить пароль в профиле после входа.
          </p>
        </div>

        <!-- Рабочая информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Рабочая информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Организация
              </label>
              <select
                v-model="form.organization_id"
                
                @change="onOrganizationChange"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Без организации</option>
                <option v-for="org in organizations" :key="org.id" :value="org.id">
                  {{ org.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Отдел
              </label>
              <select
                v-model="form.department_id"
                
                @change="onDepartmentChange"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Без отдела</option>
                <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Должность
              </label>
              <select
                v-model="form.position_id"
                
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Без должности</option>
                <option v-for="pos in filteredPositions" :key="pos.id" :value="pos.id">
                  {{ pos.name }}
                </option>
              </select>
            </div>

            
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { SYSTEM_ROLES } from '@/shared/api/roles'

const rolesOptions = SYSTEM_ROLES

const props = defineProps({
  employee: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  positions: {
    type: Array,
    default: () => []
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
  email: '',
  phone: '',
  
  organization_id: '',
  department_id: '',
  position_id: '',
  
  role: '' as '' | 'admin' | 'supervisor' | 'manager' | 'operator' | 'user',
  status: 'active',
  set_default_password: true
})

// Фильтрация отделов по выбранной организации
const filteredDepartments = computed(() => {
  if (!form.organization_id) return []
  return props.departments.filter(dept => dept.organization_id == form.organization_id)
})

// Фильтрация должностей по выбранному отделу
const filteredPositions = computed(() => {
  if (!form.department_id) return []
  return props.positions.filter(pos => pos.department_id == form.department_id)
})

// Обработка изменения организации
const onOrganizationChange = () => {
  form.department_id = '' // Сбрасываем выбор отдела при смене организации
  form.position_id = '' // Сбрасываем выбор должности при смене организации
}

// Обработка изменения отдела
const onDepartmentChange = () => {
  form.position_id = '' // Сбрасываем выбор должности при смене отдела
}

// Инициализация формы
const initForm = () => {
  if (props.employee) {
    Object.assign(form, {
      name: props.employee.name || '',
      email: props.employee.email || '',
      phone: props.employee.phone || '',
      
      organization_id: props.employee.organization_id || '',
      department_id: props.employee.department_id || '',
      position_id: props.employee.position_id || '',
      
      role: (props.employee.role as any) || '',
      status: props.employee.status || 'active',
      set_default_password: false
    })
  } else {
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      
      organization_id: '',
      department_id: '',
      position_id: '',
      
      role: '',
      status: 'active',
      set_default_password: true
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
      ...(form.set_default_password && !props.isEdit ? { password: '12345678', password_confirmation: '12345678' } : {}),
      id: props.employee?.id
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Следим за изменениями employee
watch(() => props.employee, initForm, { immediate: true })

onMounted(() => {
  initForm()
})
</script>
