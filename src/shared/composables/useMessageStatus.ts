import type { Message } from '@/shared/lib/types'

export function useMessageStatus() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'pending': return 'yellow'
      default: return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен'
      case 'pending': return 'Ожидает'
      case 'closed': return 'Закрыт'
      default: return 'Неизвестно'
    }
  }

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return 'pi pi-check text-blue-400'
      case 'delivered':
        return 'pi pi-check-double text-gray-400'
      case 'read':
        return 'pi pi-check-double text-blue-500'
      case 'failed':
        return 'pi pi-times text-red-500'
      default:
        return 'pi pi-clock text-gray-400'
    }
  }

  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Отправлено'
      case 'delivered':
        return 'Доставлено'
      case 'read':
        return 'Прочитано'
      case 'failed':
        return 'Ошибка доставки'
      default:
        return 'Обрабатывается'
    }
  }

  return {
    getStatusColor,
    getStatusText,
    getDeliveryStatusIcon,
    getDeliveryStatusText
  }
}
