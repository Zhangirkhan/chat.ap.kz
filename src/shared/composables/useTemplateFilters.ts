import { ref, computed, watch } from 'vue'
import type { Template } from '@/shared/api/templates'

export function useTemplateFilters(templates: any, loadTemplates: (searchQuery?: string) => Promise<void>) {
  const searchQuery = ref('')

  const filteredTemplates = computed(() => {
    if (!searchQuery.value) return templates.value

    const query = searchQuery.value.toLowerCase()
    return templates.value.filter((template: Template) =>
      template.name.toLowerCase().includes(query) ||
      template.content.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query) ||
      template.type.toLowerCase().includes(query) ||
      template.language.toLowerCase().includes(query) ||
      template.creator?.name.toLowerCase().includes(query) ||
      template.organization?.name.toLowerCase().includes(query)
    )
  })

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
      loadTemplates(searchQuery.value)
    }, 500)
  })

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    filteredTemplates,
    getCategoryColor,
    getCategoryLabel,
    getTypeLabel,
    getLanguageLabel,
    clearSearch
  }
}
