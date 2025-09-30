<template>
  <Card
    class="chat-card"
    :class="{ 'chat-card--selected': isSelected }"
    @click="onClick"
  >
    <template #header>
      <div class="chat-card__header">
        <Avatar
          :image="chat.client_avatar"
          :label="getClientInitial(chat)"
          size="large"
          class="chat-card__avatar"
        />
        <div class="chat-card__info">
          <h4 class="chat-card__name">{{ getClientDisplayName(chat) }}</h4>
          <p class="chat-card__phone">{{ chat.client_phone }}</p>
        </div>
        <div class="chat-card__meta">
          <span class="chat-card__time">{{ formatTime(chat.last_activity_at) }}</span>
          <Badge
            v-if="chat.unread_count > 0"
            :value="chat.unread_count"
            severity="danger"
            class="chat-card__badge"
          />
        </div>
      </div>
    </template>
    
    <template #content>
      <div class="chat-card__content">
        <p class="chat-card__last-message">{{ chat.last_message || 'Нет сообщений' }}</p>
        <div class="chat-card__status">
          <Tag
            :value="getStatusLabel(chat.status)"
            :severity="getStatusSeverity(chat.status)"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Chat } from '@/shared/lib/types'

interface Props {
  chat: Chat
  selected?: boolean
}

interface Emits {
  (e: 'select', chat: Chat): void
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

const emit = defineEmits<Emits>()

const isSelected = computed(() => props.selected)

const onClick = () => {
  emit('select', props.chat)
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активный',
    closed: 'Закрыт',
    pending: 'Ожидает'
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status: string) => {
  const severityMap: Record<string, string> = {
    active: 'success',
    closed: 'danger',
    pending: 'warning'
  }
  return severityMap[status] || 'info'
}

// Функция для получения отображаемого имени клиента
const getClientDisplayName = (chat: Chat) => {
  // Если есть имя клиента в объекте client, показываем его
  if (chat.client?.name && chat.client.name.trim()) {
    return chat.client.name
  }
  
  // Если есть имя клиента в старом формате, показываем его
  if (chat.client_name && chat.client_name.trim()) {
    return chat.client_name
  }
  
  // Если нет имени, но есть номер телефона в объекте client, показываем его
  if (chat.client?.phone && chat.client.phone.trim()) {
    return chat.client.phone
  }
  
  // Если нет имени, но есть номер телефона в старом формате, показываем его
  if (chat.client_phone && chat.client_phone.trim()) {
    return chat.client_phone
  }
  
  // Если нет ни имени, ни телефона, показываем ID чата
  return `Чат #${chat.id}`
}

// Функция для получения инициалов клиента
const getClientInitial = (chat: Chat) => {
  const displayName = getClientDisplayName(chat)
  
  if (!displayName) return '?'

  // Если это номер телефона, берем последнюю цифру
  if (/^\+?[0-9]+$/.test(displayName)) {
    return displayName.slice(-1)
  }

  // Если это имя, берем первую букву
  return displayName.charAt(0).toUpperCase()
}
</script>

<style scoped>
.chat-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.chat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-card--selected {
  border-color: var(--primary-color);
  background-color: var(--primary-50);
}

.chat-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.chat-card__avatar {
  flex-shrink: 0;
}

.chat-card__info {
  flex: 1;
  min-width: 0;
}

.chat-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-card__phone {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

.chat-card__time {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.chat-card__badge {
  font-size: 0.7rem;
}

.chat-card__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 1rem;
  gap: 1rem;
}

.chat-card__last-message {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.chat-card__status {
  flex-shrink: 0;
}

/* Темная тема */
.dark .chat-card--selected {
  background-color: var(--primary-900);
  border-color: var(--primary-500);
}

/* Адаптивность */
@media (max-width: 768px) {
  .chat-card__header {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .chat-card__content {
    padding: 0 0.75rem 0.75rem;
  }
  
  .chat-card__name {
    font-size: 1rem;
  }
  
  .chat-card__phone {
    font-size: 0.8rem;
  }
}
</style>
