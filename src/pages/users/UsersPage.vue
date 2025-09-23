<template>
  <AdminLayout>
    <template #title>Пользователи</template>
    <template #subtitle>Управление пользователями системы</template>

    <div class="users-page">
      <div class="users-content">
        <div class="users-header">
          <div class="search-section">
            <Input
              v-model="searchQuery"
              placeholder="Поиск пользователей..."
              icon="pi pi-search"
            />
          </div>

          <Button
            variant="primary"
            icon="pi pi-plus"
            @click="showAddUserDialog = true"
            class="add-button"
          >
            Добавить пользователя
          </Button>
        </div>

        <Card class="users-table">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Должность</th>
                  <th>Роль</th>
                  <th>Организация</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone || '-' }}</td>
                  <td>{{ user.position || '-' }}</td>
                  <td>
                    <span :class="`role-badge role-badge--${user.role}`">
                      {{ getUserRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td>{{ user.organization?.name || '-' }}</td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <Button
                        variant="secondary"
                        size="small"
                        icon="pi pi-pencil"
                        @click="editUser(user)"
                      />
                      <Button
                        variant="danger"
                        size="small"
                        icon="pi pi-trash"
                        @click="confirmDelete(user)"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/entities/user'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { Button, Input, Card } from '@/shared/ui'
import { formatDate, getUserRoleLabel } from '@/shared/lib'

const userStore = useUserStore()

const searchQuery = ref('')
const showAddUserDialog = ref(false)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return userStore.users

  const query = searchQuery.value.toLowerCase()
  return userStore.users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    (user.phone?.includes(query)) ||
    (user.position?.toLowerCase().includes(query))
  )
})

const loadUsers = async () => {
  await userStore.fetchUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users-page {
  min-height: 100vh;
}

.users-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.users-header {
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
  height: 44px;
  font-weight: 600;
}

.users-table {
  overflow: hidden;
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
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge--danger {
  background: #f8d7da;
  color: #721c24;
}

.role-badge--warning {
  background: #fff3cd;
  color: #856404;
}

.role-badge--info {
  background: #d1ecf1;
  color: #0c5460;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .users-content {
    padding: 16px;
  }

  .users-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-section {
    max-width: none;
  }
}
</style>
