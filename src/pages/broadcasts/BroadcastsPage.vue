<template>
  <AdminLayout>
    <template #title>Рассылки</template>
    <template #subtitle>Управление массовыми рассылками</template>

    <div class="broadcasts-page">
      <div class="broadcasts-content">
        <div class="broadcasts-header">
          <div class="search-section">
            <Input
              v-model="searchQuery"
              placeholder="Поиск рассылок..."
              icon="pi pi-search"
            />
          </div>

          <Button
            variant="primary"
            icon="pi pi-plus"
            @click="showCreateBroadcastDialog = true"
            class="add-button"
          >
            Создать рассылку
          </Button>
        </div>

        <Card class="broadcasts-table">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Получатели</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Дата отправки</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="broadcast in filteredBroadcasts" :key="broadcast.id">
                  <td>{{ broadcast.id }}</td>
                  <td>{{ broadcast.title }}</td>
                  <td>{{ broadcast.recipients_count }}</td>
                  <td>
                    <span class="status-badge" :class="`status-badge--${getStatusSeverity(broadcast.status)}`">
                      {{ broadcast.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(broadcast.created_at) }}</td>
                  <td>{{ broadcast.sent_at ? formatDate(broadcast.sent_at) : '-' }}</td>
                  <td>
                    <div class="action-buttons">
                      <Button
                        icon="pi pi-eye"
                        text
                        rounded
                        @click="viewBroadcast(broadcast)"
                        v-tooltip="'Просмотр'"
                      />
                      <Button
                        icon="pi pi-pencil"
                        text
                        rounded
                        @click="editBroadcast(broadcast)"
                        v-tooltip="'Редактировать'"
                      />
                      <Button
                        v-if="broadcast.status === 'Черновик'"
                        icon="pi pi-send"
                        text
                        rounded
                        severity="success"
                        @click="sendBroadcast(broadcast)"
                        v-tooltip="'Отправить'"
                      />
                      <Button
                        icon="pi pi-trash"
                        text
                        rounded
                        severity="danger"
                        @click="deleteBroadcast(broadcast)"
                        v-tooltip="'Удалить'"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { Button, Input, Card } from '@/shared/ui'
import { formatDate } from '@/shared/lib'

const searchQuery = ref('')
const showCreateBroadcastDialog = ref(false)

// Моковые данные рассылок
const broadcasts = ref([
  {
    id: 1,
    title: 'Новогодние поздравления',
    recipients_count: 150,
    status: 'Отправлено',
    created_at: '2024-01-15',
    sent_at: '2024-01-20'
  },
  {
    id: 2,
    title: 'Акция на услуги',
    recipients_count: 75,
    status: 'Черновик',
    created_at: '2024-01-25',
    sent_at: null
  },
  {
    id: 3,
    title: 'Напоминание о встрече',
    recipients_count: 30,
    status: 'Отправлено',
    created_at: '2024-01-28',
    sent_at: '2024-01-28'
  }
])

const filteredBroadcasts = computed(() => {
  if (!searchQuery.value) return broadcasts.value

  return broadcasts.value.filter(broadcast =>
    broadcast.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'Отправлено':
      return 'success'
    case 'Черновик':
      return 'warning'
    case 'Ошибка':
      return 'danger'
    default:
      return 'info'
  }
}

const viewBroadcast = (broadcast: any) => {
}

const editBroadcast = (broadcast: any) => {
}

const sendBroadcast = (broadcast: any) => {
}

const deleteBroadcast = (broadcast: any) => {
}

onMounted(() => {
  // Загрузка данных рассылок
})
</script>

<style scoped>
.broadcasts-page {
  min-height: 100vh;
}

.broadcasts-content {
  max-width: 1400px;
  margin: 0 auto;
}

.broadcasts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.add-button {
  white-space: nowrap;
}

.broadcasts-table {
  margin-bottom: 24px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge--success {
  background-color: #d4edda;
  color: #155724;
}

.status-badge--warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge--danger {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge--info {
  background-color: #d1ecf1;
  color: #0c5460;
}

@media (max-width: 768px) {
  .broadcasts-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-section {
    max-width: none;
  }

  .data-table {
    font-size: 14px;
  }

  .data-table th,
  .data-table td {
    padding: 8px 12px;
  }
}
</style>
