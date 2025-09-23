import type { Message } from '@/shared/lib/types'

export function useMessageFormatting() {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileExtension = (fileName?: string) => {
    if (!fileName) return ''
    const extension = fileName.split('.').pop()?.toLowerCase()
    return extension ? extension.toUpperCase() : ''
  }

  const getDocumentIcon = (fileName?: string) => {
    if (!fileName) return 'pi pi-file'
    
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    const iconMap: Record<string, string> = {
      'pdf': 'pi pi-file-pdf',
      'doc': 'pi pi-file-word',
      'docx': 'pi pi-file-word',
      'xls': 'pi pi-file-excel',
      'xlsx': 'pi pi-file-excel',
      'ppt': 'pi pi-file-powerpoint',
      'pptx': 'pi pi-file-powerpoint',
      'txt': 'pi pi-file',
      'csv': 'pi pi-file',
      'zip': 'pi pi-file-archive',
      'rar': 'pi pi-file-archive',
      '7z': 'pi pi-file-archive',
      'jpg': 'pi pi-image',
      'jpeg': 'pi pi-image',
      'png': 'pi pi-image',
      'gif': 'pi pi-image',
      'webp': 'pi pi-image',
      'json': 'pi pi-file',
      'xml': 'pi pi-file'
    }
    
    return iconMap[extension || ''] || 'pi pi-file'
  }

  return {
    formatTime,
    formatFileSize,
    getFileExtension,
    getDocumentIcon
  }
}
