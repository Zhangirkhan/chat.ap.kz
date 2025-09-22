<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Редактировать шаблон' : 'Добавить шаблон' }}
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
              Название шаблона *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Введите название шаблона"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Категория *
            </label>
            <select
              v-model="form.category"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите категорию</option>
              <option value="Общие">Общие</option>
              <option value="Поддержка">Поддержка</option>
              <option value="Продажи">Продажи</option>
              <option value="Документооборот">Документооборот</option>
              <option value="Уведомления">Уведомления</option>
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

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Описание
          </label>
          <input
            v-model="form.description"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Введите описание шаблона"
          />
        </div>

        <!-- Текст шаблона -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Текст шаблона *
          </label>
          <textarea
            v-model="form.text"
            required
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Введите текст шаблона..."
          ></textarea>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Символов: {{ form.text.length }}
          </p>
        </div>

        <!-- Теги -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Теги
          </label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs rounded-full"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(index)"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              @keydown.enter.prevent="addTag"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Добавить тег и нажать Enter"
            />
            <button
              type="button"
              @click="addTag"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              <i class="pi pi-plus"></i>
            </button>
          </div>
        </div>

        <!-- Предварительный просмотр -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Предварительный просмотр</h3>
          
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Категория:</span>
              <span :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                getCategoryColor(form.category)
              ]">
                {{ form.category || 'Не выбрана' }}
              </span>
            </div>
            <div class="text-sm text-gray-900 dark:text-white whitespace-pre-line">{{ form.text || 'Текст шаблона не введен' }}</div>
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

const props = defineProps({
  template: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const newTag = ref('')

const form = reactive({
  name: '',
  description: '',
  category: '',
  text: '',
  status: 'active',
  tags: [] as string[]
})

// Инициализация формы
const initForm = () => {
  if (props.template) {
    Object.assign(form, {
      name: props.template.name || '',
      description: props.template.description || '',
      category: props.template.category || '',
      text: props.template.text || '',
      status: props.template.status || 'active',
      tags: props.template.tags ? [...props.template.tags] : []
    })
  } else {
    Object.assign(form, {
      name: '',
      description: '',
      category: '',
      text: '',
      status: 'active',
      tags: []
    })
  }
}

// Добавление тега
const addTag = () => {
  if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
    form.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

// Удаление тега
const removeTag = (index: number) => {
  form.tags.splice(index, 1)
}

// Получение цвета категории
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Общие': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    case 'Поддержка': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    case 'Продажи': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    case 'Документооборот': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    case 'Уведомления': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
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
      id: props.template?.id
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Следим за изменениями template
watch(() => props.template, initForm, { immediate: true })

onMounted(() => {
  initForm()
})
</script>
