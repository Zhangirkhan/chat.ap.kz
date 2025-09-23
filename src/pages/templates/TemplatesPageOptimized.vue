<template>
  <AdminLayout>
    <template #title>Шаблоны ответов</template>
    <template #subtitle>Управление шаблонами сообщений</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <TemplatePageHeader
        :templates="{ value: templates }"
        :load-templates="loadTemplates"
        @add-template="openAddDialog"
      />

      <!-- Индикатор загрузки -->
      <LoadingState v-if="loading" message="Загрузка шаблонов..." />

      <!-- Сообщение об ошибке -->
      <ErrorState v-if="error" :message="error" />

      <!-- Таблица шаблонов -->
      <TemplateTable
        v-if="!loading"
        :templates="filteredTemplates"
        @view="openViewDialog"
        @edit="openEditDialog"
        @copy="handleCopy"
        @delete="openDeleteDialog"
      />
    </div>

    <!-- Диалоги -->
    <TemplateDialog
      v-if="showAddDialog || showEditDialog"
      :template="selectedTemplate"
      :is-edit="showEditDialog"
      @close="closeAllDialogs"
      @save="handleSave"
    />

    <TemplateViewDialog
      v-if="showViewDialog"
      :template="selectedTemplate"
      @close="closeAllDialogs"
    />

    <ConfirmDialog
      v-if="showDeleteDialog && selectedTemplate"
      :title="'Удаление шаблона'"
      :message="`Вы уверены, что хотите удалить шаблон '${selectedTemplate.name}'?`"
      @confirm="handleDelete"
      @cancel="closeDeleteDialog"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog, LoadingState, ErrorState } from '@/shared/ui'
import TemplatePageHeader from './components/TemplatePageHeader.vue'
import TemplateTable from './components/TemplateTable.vue'
import TemplateDialog from './components/TemplateDialog.vue'
import TemplateViewDialog from './components/TemplateViewDialog.vue'
import { useTemplateManagement } from '@/shared/composables/useTemplateManagement'
import { useTemplateFilters } from '@/shared/composables/useTemplateFilters'
import { useTemplateDialogs } from '@/shared/composables/useTemplateDialogs'
import { useOrganizationStore } from '@/entities/organization'
import { useAuthStore } from '@/features/auth'
import type { CreateTemplateData, UpdateTemplateData } from '@/shared/api/templates'

// Composables
const {
  templates,
  loading,
  error,
  loadTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  copyTemplate
} = useTemplateManagement()

const { filteredTemplates } = useTemplateFilters({ value: templates }, loadTemplates)

const {
  showAddDialog,
  showEditDialog,
  showViewDialog,
  showDeleteDialog,
  selectedTemplate,
  openAddDialog,
  closeAddDialog,
  openEditDialog,
  closeEditDialog,
  openViewDialog,
  closeViewDialog,
  openDeleteDialog,
  closeDeleteDialog,
  closeAllDialogs
} = useTemplateDialogs()

const authStore = useAuthStore()
const organizationStore = useOrganizationStore()

// Обработчики событий
const handleSave = async (templateData: CreateTemplateData | UpdateTemplateData) => {
  let success = false

  if (showEditDialog.value && selectedTemplate.value) {
    success = await updateTemplate(selectedTemplate.value.id, templateData as UpdateTemplateData)
  } else {
    success = await createTemplate(templateData as CreateTemplateData)
  }

  if (success) {
    closeAllDialogs()
  }
}

const handleDelete = async () => {
  if (selectedTemplate.value) {
    const success = await deleteTemplate(selectedTemplate.value.id)
    if (success) {
      closeAllDialogs()
    }
  }
}

const handleCopy = async (template: any) => {
  const success = await copyTemplate(template)
  if (success) {
    // Копирование не требует закрытия диалогов
  }
}

const loadOrganizations = async () => {
  if (!authStore.isAuthenticated) {
    return
  }

  try {
    await organizationStore.getOrganizations()
  } catch (err) {
    // Не показываем уведомления - организации не критичны для работы страницы
  }
}

onMounted(async () => {
  await Promise.all([
    loadOrganizations(),
    loadTemplates()
  ])
})
</script>
