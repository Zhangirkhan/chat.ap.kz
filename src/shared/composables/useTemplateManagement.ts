import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { templatesApi, type Template, type CreateTemplateData, type UpdateTemplateData } from '@/shared/api/templates'

export function useTemplateManagement() {
  const toast = useToast()
  const templates = ref<Template[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadTemplates = async (searchQuery?: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await templatesApi.getTemplates({
        per_page: 50,
        search: searchQuery || undefined
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

  const createTemplate = async (templateData: CreateTemplateData) => {
    try {
      loading.value = true
      const response = await templatesApi.createTemplate(templateData)

      // Проверяем формат ответа
      if (response.template) {
        templates.value.push(response.template)
      } else if (response.data?.id) {
        templates.value.push(response.data)
      } else if (response.id) {
        templates.value.push(response)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Шаблон создан',
        life: 4000,
        closable: true,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания шаблона'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 6000,
        closable: true,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const updateTemplate = async (id: number, templateData: UpdateTemplateData) => {
    try {
      loading.value = true
      const response = await templatesApi.updateTemplate(id, templateData)

      const index = templates.value.findIndex(template => template.id === id)
      if (index !== -1) {
        // Проверяем формат ответа
        if (response.template) {
          templates.value[index] = response.template
        } else if (response.data?.id) {
          templates.value[index] = response.data
        } else if (response.id) {
          templates.value[index] = response
        } else {
          throw new Error('Неожиданный формат ответа от сервера')
        }
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Шаблон обновлен',
        life: 4000,
        closable: true,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления шаблона'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 6000,
        closable: true,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
  }

  const deleteTemplate = async (id: number) => {
    try {
      loading.value = true
      await templatesApi.deleteTemplate(id)

      const index = templates.value.findIndex(template => template.id === id)
      if (index !== -1) {
        templates.value.splice(index, 1)
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Шаблон удален',
        life: 4000,
        closable: true,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления шаблона'
      error.value = errorMessage

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 6000,
        closable: true,
        group: 'main'
      })

      return false
    } finally {
      loading.value = false
    }
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
      } else if (response.data?.id) {
        templates.value.push(response.data)
      } else if (response.id) {
        templates.value.push(response)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Шаблон скопирован',
        life: 4000,
        closable: true,
        group: 'main'
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка копирования шаблона'

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 6000,
        closable: true,
        group: 'main'
      })

      return false
    }
  }

  return {
    templates,
    loading,
    error,
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    copyTemplate
  }
}
