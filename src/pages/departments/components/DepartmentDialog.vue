<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Редактировать отдел' : 'Добавить отдел' }}
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
              Название отдела *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите название отдела"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Организация *
            </label>
            <select
              v-model="form.organization_id"
              required
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
              Руководитель
            </label>
            <input
              v-model="form.manager"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите ФИО руководителя"
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
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Описание
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Введите описание отдела"
          ></textarea>
        </div>

        <!-- Дополнительная информация -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Дополнительная информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Количество сотрудников
              </label>
              <input
                v-model.number="form.employee_count"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Бюджет отдела (тенге)
              </label>
              <input
                v-model.number="form.budget"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Контактная информация
            </label>
            <input
              v-model="form.contact_info"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Телефон, email или другие контакты"
            />
          </div>
        </div>

        <!-- Настройки чат-бота -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Настройки чат-бота</h3>

          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="show_in_chatbot"
                v-model="form.show_in_chatbot"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="show_in_chatbot" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Показывать отдел в меню чат-бота
              </label>
            </div>

            <div v-if="form.show_in_chatbot">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Порядок отображения в чат-боте
              </label>
              <input
                v-model.number="form.chatbot_order"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Порядок сортировки (меньше число = выше в списке)"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Отделы будут отображаться в чат-боте в порядке возрастания этого числа
              </p>
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
import { ref, reactive, watch, onMounted } from 'vue'
import { departmentApi } from '@/entities/department/api/departmentApi'
import type { Department } from '@/shared/lib/types'

const props = defineProps({
  department: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  organizations: {
    type: Array as () => Array<{ id: number; name: string }>,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  manager: '',
  organization_id: '' as string | number,
  status: 'active' as 'active' | 'inactive',
  employee_count: 0,
  budget: 0,
  contact_info: '',
  show_in_chatbot: false,
  chatbot_order: 1
})

// Инициализация формы
const initForm = () => {
  if (props.department) {
    Object.assign(form, {
      name: props.department.name || '',
      description: props.department.description || '',
      manager: props.department.manager || '',
      organization_id: props.department.organization_id || '',
      status: props.department.status || 'active',
      employee_count: props.department.employee_count || 0,
      budget: props.department.budget || 0,
      contact_info: props.department.contact_info || '',
      show_in_chatbot: props.department.show_in_chatbot || false,
      chatbot_order: props.department.chatbot_order || 1
    })
  } else {
    Object.assign(form, {
      name: '',
      description: '',
      manager: '',
      organization_id: '',
      status: 'active',
      employee_count: 0,
      budget: 0,
      contact_info: '',
      show_in_chatbot: false,
      chatbot_order: 1
    })
  }
}

// Отправка формы
const handleSubmit = async () => {
  loading.value = true

  try {
    let result: { data: Department }

    if (props.department) {
      // Обновление существующего отдела
      result = await departmentApi.updateDepartment(props.department.id, {
        name: form.name,
        description: form.description || undefined,
        organization_id: Number(form.organization_id),
        show_in_chatbot: form.show_in_chatbot,
        chatbot_order: form.chatbot_order
      })
    } else {
      // Создание нового отдела
      result = await departmentApi.createDepartment({
        name: form.name,
        description: form.description || undefined,
        organization_id: Number(form.organization_id),
        show_in_chatbot: form.show_in_chatbot,
        chatbot_order: form.chatbot_order
      })
    }

    emit('save', result.data)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Следим за изменениями department
watch(() => props.department, initForm, { immediate: true })

onMounted(() => {
  initForm()
})
</script>
