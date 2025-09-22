<template>
  <AdminLayout>
    <template #title>Шаблоны ответов</template>
    <template #subtitle>Управление шаблонами сообщений</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск шаблонов..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          @click="showAddDialog = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Добавить шаблон
        </button>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка шаблонов...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица шаблонов -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Название</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Тип</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Категория</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Язык</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Статус</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="template in filteredTemplates" :key="template.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ template.id }}</td>
                <td class="px-3 py-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ template.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ template.content.substring(0, 50) }}{{ template.content.length > 50 ? '...' : '' }}
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    {{ getTypeLabel(template.type) }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getCategoryColor(template.category)
                  ]">
                    {{ getCategoryLabel(template.category) }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300">
                    {{ getLanguageLabel(template.language) }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    template.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  ]">
                    {{ template.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewTemplate(template)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      v-if="!template.is_system"
                      @click="editTemplate(template)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      @click="copyTemplate(template)"
                      class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
                      title="Копировать"
                    >
                      <i class="pi pi-copy"></i>
                    </button>
                    <button
                      v-if="!template.is_system"
                      @click="confirmDelete(template)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Удалить"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Диалог добавления/редактирования -->
    <TemplateDialog
      v-if="showAddDialog || showEditDialog"
      :template="selectedTemplate"
      :is-edit="showEditDialog"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра -->
    <TemplateViewDialog
      v-if="showViewDialog"
      :template="selectedTemplate"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление шаблона'"
      :message="`Вы уверены, что хотите удалить шаблон '${selectedTemplate?.name}'?`"
      @confirm="deleteTemplate"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { templatesApi, type Template, type CreateTemplateData, type UpdateTemplateData, TEMPLATE_TYPES, TEMPLATE_CATEGORIES, TEMPLATE_LANGUAGES } from '@/shared/api/templates'
import { useOrganizationStore } from '@/entities/organization'
import TemplateDialog from './components/TemplateDialog.vue'
import TemplateViewDialog from './components/TemplateViewDialog.vue'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/features/auth'

const toast = useToast()
const authStore = useAuthStore()
const organizationStore = useOrganizationStore()
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedTemplate = ref<Template | null>(null)
const templates = ref<Template[]>([])
const loading = ref(false)
const error = ref<string | null>(null)


const filteredTemplates = computed(() => {
  if (!searchQuery.value) return templates.value

  const query = searchQuery.value.toLowerCase()
  return templates.value.filter(template =>
    template.name.toLowerCase().includes(query) ||
    template.content.toLowerCase().includes(query) ||
    template.category.toLowerCase().includes(query) ||
    template.type.toLowerCase().includes(query) ||
    template.language.toLowerCase().includes(query) ||
    template.creator?.name.toLowerCase().includes(query) ||
    template.organization?.name.toLowerCase().includes(query)
  )
})

const loadTemplates = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await templatesApi.getTemplates({
      per_page: 50,
      search: searchQuery.value || undefined
    })


    // Обрабатываем ответ в зависимости от формата
    if (response.data && Array.isArray(response.data)) {
      templates.value = response.data
    } else if (Array.isArray(response)) {
      templates.value = response
    } else {
      templates.value = []
      error.value = 'Неожиданный формат ответа от сервера'
    }
  } catch (err) {
    templates.value = []
    error.value = 'Ошибка загрузки данных с сервера'
  } finally {
    loading.value = false
  }
}

const loadOrganizations = async () => {
  // Проверяем аутентификацию перед загрузкой
  if (!authStore.isAuthenticated) {
    return
  }

  try {
    await organizationStore.getOrganizations()
  } catch (err) {
    // Не показываем уведомления - организации не критичны для работы страницы
  }
}

const viewTemplate = (template: Template) => {
  selectedTemplate.value = template
  showViewDialog.value = true
}

const editTemplate = (template: Template) => {
  selectedTemplate.value = template
  showEditDialog.value = true
}

const copyTemplate = async (template: Template) => {
  try {
    const newTemplateData: CreateTemplateData = {
      name: `${template.name} (копия)`,
      content: template.content,
      type: template.type,
      category: template.category,
      variables: template.variables,
      language: template.language,
      is_active: template.is_active,
      organization_id: template.organization?.id
    }

    const response = await templatesApi.createTemplate(newTemplateData)


    // Проверяем формат ответа
    if (response.template) {
      templates.value.push(response.template)
    } else if (response.data && response.data.id) {
      templates.value.push(response.data)
    } else if (response.id) {
      templates.value.push(response)
    } else {
      throw new Error('Неожиданный формат ответа от сервера')
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Шаблон скопирован',
      life: 4000,
      closable: true,
      group: 'main'
    })
  } catch (err) {

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка копирования шаблона',
      life: 6000,
      closable: true,
      group: 'main'
    })
  }
}

const confirmDelete = (template: Template) => {
  selectedTemplate.value = template
  showDeleteDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedTemplate.value = null
}

const handleSave = async (templateData: CreateTemplateData | UpdateTemplateData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedTemplate.value) {
      // Редактирование существующего шаблона
      const response = await templatesApi.updateTemplate(selectedTemplate.value.id, templateData as UpdateTemplateData)


      const index = templates.value.findIndex(template => template.id === selectedTemplate.value?.id)
      if (index !== -1) {
        // Проверяем формат ответа
        if (response.template) {
          templates.value[index] = response.template
        } else if (response.data && response.data.id) {
          templates.value[index] = response.data
        } else if (response.id) {
          templates.value[index] = response
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }
    } else {
      // Добавление нового шаблона
      const response = await templatesApi.createTemplate(templateData as CreateTemplateData)


      // Проверяем формат ответа
      if (response.template) {
        templates.value.push(response.template)
      } else if (response.data && response.data.id) {
        templates.value.push(response.data)
      } else if (response.id) {
        templates.value.push(response)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Шаблон обновлен' : 'Шаблон создан',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения шаблона'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения шаблона',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const deleteTemplate = async () => {
  if (!selectedTemplate.value) return

  try {
    loading.value = true

    await templatesApi.deleteTemplate(selectedTemplate.value.id)

    const index = templates.value.findIndex(template => template.id === selectedTemplate.value?.id)
    if (index !== -1) {
      templates.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Шаблон удален',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления шаблона'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления шаблона',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'greeting': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    case 'farewell': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    case 'support': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
    case 'sales': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    case 'technical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    case 'general': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }
}

const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    'greeting': 'Приветствие',
    'farewell': 'Прощание',
    'support': 'Поддержка',
    'sales': 'Продажи',
    'technical': 'Техническая',
    'general': 'Общее'
  }
  return categoryMap[category] || category
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'message': 'Сообщение',
    'email': 'Email',
    'sms': 'SMS',
    'notification': 'Уведомление'
  }
  return typeMap[type] || type
}

const getLanguageLabel = (language: string) => {
  const languageMap: Record<string, string> = {
    'ru': 'Русский',
    'en': 'English',
    'kk': 'Қазақша'
  }
  return languageMap[language] || language
}

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadTemplates()
  }, 500)
})

onMounted(() => {
  loadOrganizations()
  loadTemplates()
})
</script>

<style scoped>
/* Все стили в Tailwind CSS */
</style>
