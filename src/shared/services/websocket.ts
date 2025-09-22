import type { WebSocketEvent, TypingEvent, OnlineStatusEvent } from '@/shared/lib/types'

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 3000
  private heartbeatInterval: number | null = null
  private eventHandlers: Map<string, Function[]> = new Map()

  constructor(private url: string, private token: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.url}?token=${this.token}`)

        this.ws.onopen = () => {
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.emit('connected')
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data: WebSocketEvent = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
          }
        }

        this.ws.onclose = (event) => {
          this.stopHeartbeat()
          this.emit('disconnected', event)

          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnect()
          }
        }

        this.ws.onerror = (error) => {
          this.emit('error', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.stopHeartbeat()
  }

  private reconnect(): void {
    this.reconnectAttempts++

    setTimeout(() => {
      this.connect().catch(error => {
      })
    }, this.reconnectInterval)
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', data: {}, timestamp: new Date().toISOString() })
      }
    }, 30000) // Ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private handleMessage(event: WebSocketEvent): void {
    switch (event.type) {
      case 'message':
        this.emit('message', event.data)
        break
      case 'chat_update':
        this.emit('chat_update', event.data)
        break
      case 'user_typing':
        this.emit('user_typing', event.data as TypingEvent)
        break
      case 'user_online':
      case 'user_offline':
        this.emit('user_status', event.data as OnlineStatusEvent)
        break
      case 'pong':
        // Heartbeat response
        break
      default:
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
    }
  }

  // Event handling
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }

  // Chat specific methods
  joinChat(chatId: number): void {
    this.send({
      type: 'join_chat',
      data: { chat_id: chatId },
      timestamp: new Date().toISOString()
    })
  }

  leaveChat(chatId: number): void {
    this.send({
      type: 'leave_chat',
      data: { chat_id: chatId },
      timestamp: new Date().toISOString()
    })
  }

  sendTyping(chatId: number, isTyping: boolean): void {
    this.send({
      type: 'typing',
      data: { chat_id: chatId, is_typing: isTyping },
      timestamp: new Date().toISOString()
    })
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
let wsService: WebSocketService | null = null

export const useWebSocket = (url?: string, token?: string): WebSocketService => {
  if (!wsService && url && token) {
    wsService = new WebSocketService(url, token)
  }
  return wsService!
}

export const initWebSocket = (url: string, token: string): WebSocketService => {
  if (wsService) {
    wsService.disconnect()
  }
  wsService = new WebSocketService(url, token)
  return wsService
}
