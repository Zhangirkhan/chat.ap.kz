import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface DialogState {
  isOpen: boolean
  data?: unknown
  loading?: boolean
  config?: DialogConfig
}

export interface DialogConfig {
  width?: string
  height?: string
  closable?: boolean
  modal?: boolean
  draggable?: boolean
  resizable?: boolean
  maximizable?: boolean
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'
  showHeader?: boolean
  showFooter?: boolean
  confirmLabel?: string
  cancelLabel?: string
  confirmIcon?: string
  cancelIcon?: string
  confirmSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger'
  cancelSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger'
}

export const useDialogStore = defineStore('dialog', () => {
  // State
  const dialogs = ref<Record<string, DialogState>>({})
  const dialogHistory = ref<string[]>([])
  const maxHistorySize = 10

  // Getters
  const isDialogOpen = computed(() => (name: string) => {
    return dialogs.value[name]?.isOpen || false
  })

  const getDialogData = computed(() => (name: string) => {
    return dialogs.value[name]?.data
  })

  const getDialogConfig = computed(() => (name: string) => {
    return dialogs.value[name]?.config
  })

  const isDialogLoading = computed(() => (name: string) => {
    return dialogs.value[name]?.loading || false
  })

  const getOpenDialogs = computed(() => {
    return Object.keys(dialogs.value).filter(name => dialogs.value[name]?.isOpen)
  })

  const getDialogHistory = computed(() => dialogHistory.value)

  // Actions
  const openDialog = (name: string, data?: unknown, config?: DialogConfig) => {
    dialogs.value[name] = {
      isOpen: true,
      data,
      loading: false,
      config: {
        width: '50vw',
        height: 'auto',
        closable: true,
        modal: true,
        draggable: false,
        resizable: false,
        maximizable: false,
        position: 'center',
        showHeader: true,
        showFooter: true,
        confirmLabel: 'Сохранить',
        cancelLabel: 'Отмена',
        confirmIcon: 'pi pi-check',
        cancelIcon: 'pi pi-times',
        confirmSeverity: 'primary',
        cancelSeverity: 'secondary',
        ...config
      }
    }

    // Добавляем в историю
    addToHistory(name)
  }

  const closeDialog = (name: string) => {
    if (dialogs.value[name]) {
      dialogs.value[name].isOpen = false
      dialogs.value[name].data = undefined
      dialogs.value[name].loading = false
    }
  }

  const setDialogData = (name: string, data: unknown) => {
    if (dialogs.value[name]) {
      dialogs.value[name].data = data
    }
  }

  const setDialogLoading = (name: string, loading: boolean) => {
    if (dialogs.value[name]) {
      dialogs.value[name].loading = loading
    }
  }

  const setDialogConfig = (name: string, config: Partial<DialogConfig>) => {
    if (dialogs.value[name]) {
      dialogs.value[name].config = {
        ...dialogs.value[name].config,
        ...config
      }
    }
  }

  const toggleDialog = (name: string, data?: unknown, config?: DialogConfig) => {
    if (isDialogOpen.value(name)) {
      closeDialog(name)
    } else {
      openDialog(name, data, config)
    }
  }

  const closeAllDialogs = () => {
    Object.keys(dialogs.value).forEach(name => {
      closeDialog(name)
    })
    dialogHistory.value = []
  }

  const closeLastDialog = () => {
    if (dialogHistory.value.length > 0) {
      const lastDialog = dialogHistory.value[dialogHistory.value.length - 1]
      closeDialog(lastDialog)
    }
  }

  // Групповые операции
  const openMultipleDialogs = (dialogNames: string[], data?: unknown, config?: DialogConfig) => {
    dialogNames.forEach(name => openDialog(name, data, config))
  }

  const closeMultipleDialogs = (dialogNames: string[]) => {
    dialogNames.forEach(name => closeDialog(name))
  }

  const addToHistory = (name: string) => {
    // Удаляем из истории если уже есть
    const index = dialogHistory.value.indexOf(name)
    if (index > -1) {
      dialogHistory.value.splice(index, 1)
    }

    // Добавляем в начало
    dialogHistory.value.unshift(name)

    // Ограничиваем размер истории
    if (dialogHistory.value.length > maxHistorySize) {
      dialogHistory.value = dialogHistory.value.slice(0, maxHistorySize)
    }
  }

  const clearHistory = () => {
    dialogHistory.value = []
  }

  // Утилиты
  const getDialogStack = () => {
    return dialogHistory.value.filter(name => isDialogOpen.value(name))
  }

  const isTopDialog = (name: string) => {
    const stack = getDialogStack()
    return stack.length > 0 && stack[0] === name
  }

  return {
    // State
    dialogs: computed(() => dialogs.value),
    
    // Getters
    isDialogOpen,
    getDialogData,
    getDialogConfig,
    isDialogLoading,
    getOpenDialogs,
    getDialogHistory,
    
    // Actions
    openDialog,
    closeDialog,
    setDialogData,
    setDialogLoading,
    setDialogConfig,
    toggleDialog,
    closeAllDialogs,
    closeLastDialog,
    openMultipleDialogs,
    closeMultipleDialogs,
    clearHistory,
    
    // Utilities
    getDialogStack,
    isTopDialog
  }
})