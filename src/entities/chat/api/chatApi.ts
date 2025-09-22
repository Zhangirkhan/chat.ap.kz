import { apiClient } from '@/shared/api/client'
import { API_CONFIG } from '@/shared/config/api'
import type { ApiResponse } from '@/shared/lib/types'
import type {
  Chat,
  Message,
  CreateChatData,
  UpdateChatData,
  SendMessageData,
  SystemMessageData
} from '@/shared/lib/types'

export const chatApi = {
  // Получение списка чатов
  getChats: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string
  }): Promise<ApiResponse<Chat[]>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const url = queryParams.toString() ? `${API_CONFIG.ENDPOINTS.CHATS}?${queryParams}` : API_CONFIG.ENDPOINTS.CHATS
    return apiClient.get(url)
  },

  // Поиск чатов
  searchChats: (params: {
    query: string;
    status?: string;
    page?: number;
    per_page?: number
  }): Promise<ApiResponse<Chat[]>> => {
    const queryParams = new URLSearchParams()
    queryParams.append('query', params.query)
    if (params.status) queryParams.append('status', params.status)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.per_page) queryParams.append('per_page', params.per_page.toString())

    return apiClient.get(`${API_CONFIG.ENDPOINTS.CHATS}/search?${queryParams}`)
  },

  // Получение чата по ID
  getChatById: (id: number): Promise<ApiResponse<Chat>> => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.CHATS}/${id}`)
  },

  // Создание чата
  createChat: (data: CreateChatData): Promise<ApiResponse<Chat>> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.CHATS, data)
  },

  // Обновление чата
  updateChat: (id: number, data: UpdateChatData): Promise<ApiResponse<Chat>> => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.CHATS}/${id}`, data)
  },

  // Завершение чата
  endChat: (id: number): Promise<ApiResponse<Chat>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.CHATS}/${id}/end`)
  },

  // Передача чата
  transferChat: (id: number, data: { assigned_to: number; note?: string }): Promise<ApiResponse<Chat>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.CHATS}/${id}/transfer`, data)
  },

  // Получение сообщений чата
  getChatMessages: (chatId: number, params?: {
    page?: number;
    per_page?: number
  }): Promise<ApiResponse<Message[]>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

    const url = queryParams.toString()
      ? `${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/messages?${queryParams}`
      : `${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/messages`

    return apiClient.get(url)
  },

  // Отправка сообщения
  sendMessage: (chatId: number, data: SendMessageData): Promise<ApiResponse<Message>> => {
    // Если есть файл, используем FormData
    if (data.file) {
      const formData = new FormData()
      formData.append('message', data.message || '')
      formData.append('type', data.type || 'text')
      formData.append('file', data.file)

      return apiClient.post(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/send`, formData)
    }

    // Для текстовых сообщений используем JSON
    return apiClient.post(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/send`, {
      message: data.message,
      type: data.type || 'text'
    })
  },

  // Отправка медиа через Wazzup24
  sendWazzupMedia: (chatId: number, data: {
    media_url: string;
    media_type: 'image' | 'video' | 'audio' | 'document';
    caption?: string;
    file_name?: string;
  }): Promise<ApiResponse<Message>> => {
    return apiClient.post(`/wazzup24/chats/${chatId}/send-media`, data)
  },

  // Отправка системного сообщения
  sendSystemMessage: (chatId: number, data: SystemMessageData): Promise<ApiResponse<Message>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.CHATS}/${chatId}/system-message`, data)
  },

  // Скрытие сообщения
  hideMessage: (messageId: number): Promise<ApiResponse<null>> => {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.CHATS}/messages/${messageId}/hide`)
  },

  // Получение токена для WebSocket
  getWebSocketToken: (): Promise<ApiResponse<{ token: string; expires_at: string }>> => {
    return apiClient.get('/websocket/token')
  },

  // Проверка токена WebSocket
  verifyWebSocketToken: (token: string): Promise<ApiResponse<{ valid: boolean; user_id: number }>> => {
    return apiClient.get(`/websocket/verify?token=${token}`)
  },

  // Отметить сообщение как прочитанное
  markMessageAsRead: (messageId: number): Promise<ApiResponse<{ message_id: number; user_id: number; read_at: string }>> => {
    return apiClient.post(`/messages/${messageId}/mark-read`)
  },

  // Отметить множество сообщений как прочитанные
  markMultipleMessagesAsRead: (messageIds: number[]): Promise<ApiResponse<{ marked_count: number; message_ids: number[] }>> => {
    return apiClient.post('/messages/mark-multiple-read', { message_ids: messageIds })
  },

  // Отметить весь чат как прочитанный
  markChatAsRead: (chatId: number): Promise<ApiResponse<{ chat_id: number; marked_count: number }>> => {
    return apiClient.post(`/chats/${chatId}/mark-read`)
  },

  // Получить статус прочтения сообщений
  getMessagesReadStatus: (messageIds: number[]): Promise<ApiResponse<Record<number, { is_read: boolean; read_at: string | null }>>> => {
    return apiClient.post('/messages/read-status', { message_ids: messageIds })
  },

  // Закрыть мессенджер чат
  closeMessengerChat: (chatId: number): Promise<ApiResponse<null>> => {
    return apiClient.post(`/chats/${chatId}/close`)
  },

  // Универсальный POST метод
  post: (url: string, data?: any): Promise<ApiResponse<any>> => {
    return apiClient.post(url, data)
  }
}
