import { computed } from 'vue'
import { useDialogStore, type DialogConfig } from '@/app/providers/stores/dialogStore'

export function useDialog(dialogName: string) {
  const dialogStore = useDialogStore()
  
  const isOpen = computed(() => dialogStore.isDialogOpen(dialogName))
  const data = computed(() => dialogStore.getDialogData(dialogName))
  const config = computed(() => dialogStore.getDialogConfig(dialogName))
  const loading = computed(() => dialogStore.isDialogLoading(dialogName))
  const isTop = computed(() => dialogStore.isTopDialog(dialogName))
  
  const open = (data?: unknown, config?: DialogConfig) => dialogStore.openDialog(dialogName, data, config)
  const close = () => dialogStore.closeDialog(dialogName)
  const toggle = (data?: unknown, config?: DialogConfig) => dialogStore.toggleDialog(dialogName, data, config)
  const setData = (data: unknown) => dialogStore.setDialogData(dialogName, data)
  const setLoading = (loading: boolean) => dialogStore.setDialogLoading(dialogName, loading)
  const setConfig = (config: Partial<DialogConfig>) => dialogStore.setDialogConfig(dialogName, config)
  
  return {
    isOpen,
    data,
    config,
    loading,
    isTop,
    open,
    close,
    toggle,
    setData,
    setLoading,
    setConfig
  }
}

// Composable для работы с несколькими диалогами
export function useMultipleDialogs(dialogNames: string[]) {
  const dialogStore = useDialogStore()
  
  const dialogs = computed(() => {
    return dialogNames.reduce((acc, name) => {
      acc[name] = {
        isOpen: dialogStore.isDialogOpen(name),
        data: dialogStore.getDialogData(name),
        config: dialogStore.getDialogConfig(name),
        loading: dialogStore.isDialogLoading(name)
      }
      return acc
    }, {} as Record<string, { isOpen: boolean; data: unknown; config: DialogConfig; loading: boolean }>)
  })
  
  const openAll = (data?: unknown, config?: DialogConfig) => dialogStore.openMultipleDialogs(dialogNames, data, config)
  const closeAll = () => dialogStore.closeMultipleDialogs(dialogNames)
  
  const open = (name: string, data?: unknown, config?: DialogConfig) => dialogStore.openDialog(name, data, config)
  const close = (name: string) => dialogStore.closeDialog(name)
  
  return {
    dialogs,
    openAll,
    closeAll,
    open,
    close
  }
}

// Composable для работы с диалогами форм
export function useFormDialog(dialogName: string) {
  const dialog = useDialog(dialogName)
  
  const openForCreate = (config?: DialogConfig) => {
    dialog.open({ mode: 'create' }, config)
  }
  
  const openForEdit = (data: unknown, config?: DialogConfig) => {
    dialog.open({ mode: 'edit', ...data }, config)
  }
  
  const openForView = (data: unknown, config?: DialogConfig) => {
    dialog.open({ mode: 'view', ...data }, { ...config, showFooter: false })
  }
  
  const openForDelete = (data: unknown, config?: DialogConfig) => {
    dialog.open({ mode: 'delete', ...data }, {
      ...config,
      confirmLabel: 'Удалить',
      confirmSeverity: 'danger',
      confirmIcon: 'pi pi-trash'
    })
  }
  
  const isCreateMode = computed(() => dialog.data.value?.mode === 'create')
  const isEditMode = computed(() => dialog.data.value?.mode === 'edit')
  const isViewMode = computed(() => dialog.data.value?.mode === 'view')
  const isDeleteMode = computed(() => dialog.data.value?.mode === 'delete')
  
  return {
    ...dialog,
    openForCreate,
    openForEdit,
    openForView,
    openForDelete,
    isCreateMode,
    isEditMode,
    isViewMode,
    isDeleteMode
  }
}

// Composable для работы с диалогами подтверждения
export function useConfirmDialog(dialogName: string) {
  const dialog = useDialog(dialogName)
  
  const confirm = (message: string, title: string = 'Подтверждение', config?: DialogConfig) => {
    return new Promise<boolean>((resolve) => {
      dialog.open({
        message,
        title,
        onConfirm: () => {
          dialog.close()
          resolve(true)
        },
        onCancel: () => {
          dialog.close()
          resolve(false)
        }
      }, {
        width: '400px',
        showFooter: false,
        ...config
      })
    })
  }
  
  const confirmDelete = (itemName: string, config?: DialogConfig) => {
    return confirm(
      `Вы уверены, что хотите удалить "${itemName}"? Это действие нельзя отменить.`,
      'Подтверждение удаления',
      {
        confirmLabel: 'Удалить',
        confirmSeverity: 'danger',
        confirmIcon: 'pi pi-trash',
        ...config
      }
    )
  }
  
  return {
    ...dialog,
    confirm,
    confirmDelete
  }
}