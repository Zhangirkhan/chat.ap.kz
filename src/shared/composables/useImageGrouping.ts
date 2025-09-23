import type { Message } from '@/shared/lib/types'

export function useImageGrouping() {
  const isPartOfImageGroup = (message: Message, messages: Message[]) => {
    if (message.type !== 'image') return false
    
    // Ищем соседние изображения в течение 30 секунд
    const currentTime = new Date(message.created_at).getTime()
    const timeWindow = 30 * 1000 // 30 секунд
    
    const nearbyImages = messages.filter((msg) => {
      if (msg.type !== 'image' || msg.id === message.id) return false
      const msgTime = new Date(msg.created_at).getTime()
      return Math.abs(msgTime - currentTime) <= timeWindow
    })
    
    return nearbyImages.length > 0
  }

  const isFirstInImageGroup = (message: Message, messages: Message[]) => {
    if (!isPartOfImageGroup(message, messages)) return false
    
    const currentTime = new Date(message.created_at).getTime()
    const timeWindow = 30 * 1000
    
    // Проверяем, есть ли изображения раньше этого
    const earlierImages = messages.filter((msg) => {
      if (msg.type !== 'image' || msg.id === message.id) return false
      const msgTime = new Date(msg.created_at).getTime()
      return msgTime < currentTime && Math.abs(msgTime - currentTime) <= timeWindow
    })
    
    return earlierImages.length === 0
  }

  const getImageGroup = (message: Message, messages: Message[]) => {
    if (message.type !== 'image') return [message]
    
    const currentTime = new Date(message.created_at).getTime()
    const timeWindow = 30 * 1000
    
    const groupImages = messages.filter((msg) => {
      if (msg.type !== 'image') return false
      const msgTime = new Date(msg.created_at).getTime()
      return Math.abs(msgTime - currentTime) <= timeWindow
    }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    
    return groupImages.slice(0, 4) // Показываем максимум 4 изображения
  }

  const getImageGroupGridClass = (images: Message[], index: number) => {
    const count = images.length
    if (count === 1) return ''
    if (count === 2) return ''
    if (count === 3) {
      if (index === 0) return 'col-span-2'
      return ''
    }
    if (count >= 4) {
      if (index === 0) return 'col-span-2'
      return ''
    }
    return ''
  }

  const getImageGroupStyle = (images: Message[], index: number) => {
    const count = images.length
    if (count === 1) return 'max-height: 250px; object-fit: contain;'
    if (count === 2) return 'height: 120px; object-fit: cover;'
    if (count === 3) {
      if (index === 0) return 'height: 150px; object-fit: cover;'
      return 'height: 70px; object-fit: cover;'
    }
    if (count >= 4) {
      if (index === 0) return 'height: 120px; object-fit: cover;'
      return 'height: 80px; object-fit: cover;'
    }
    return ''
  }

  return {
    isPartOfImageGroup,
    isFirstInImageGroup,
    getImageGroup,
    getImageGroupGridClass,
    getImageGroupStyle
  }
}
