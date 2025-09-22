import { apiClient } from '@/shared/api/client'

/**
 * Загружает файл на сервер и возвращает публичный URL
 */
export async function uploadFileToServer(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await apiClient.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success && response.data.data.url) {
      return response.data.data.url
    }
    
    throw new Error('Не удалось получить URL файла')
  } catch (error) {
    console.error('Ошибка загрузки файла:', error)
    throw new Error('Ошибка загрузки файла на сервер')
  }
}

/**
 * Определяет тип медиа файла по MIME типу
 */
export function getMediaTypeFromFile(file: File): 'image' | 'video' | 'audio' | 'document' {
  if (file.type.startsWith('image/')) {
    return 'image'
  } else if (file.type.startsWith('video/')) {
    return 'video'
  } else if (file.type.startsWith('audio/')) {
    return 'audio'
  } else {
    return 'document'
  }
}

/**
 * Проверяет, является ли файл медиа файлом
 */
export function isMediaFile(file: File): boolean {
  return file.type.startsWith('image/') || 
         file.type.startsWith('video/') || 
         file.type.startsWith('audio/')
}

/**
 * Получает расширение файла
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || ''
}
