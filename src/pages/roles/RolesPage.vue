<template>
  <AdminLayout>
    <template #title>Роли</template>
    <template #subtitle>Управление ролями и разрешениями пользователей</template>

    <div class="space-y-6">
      <!-- Заголовок с поиском и кнопкой добавления -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск ролей..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="showAddRoleDialog = true"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Добавить роль
          </button>
        </div>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="text-gray-600 dark:text-gray-400">Загрузка ролей...</span>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-red-500"></i>
          <span class="text-red-700 dark:text-red-300">{{ error }}</span>
        </div>
      </div>

      <!-- Таблица ролей -->
      <div v-if="!loading" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">ID</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Роль</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Отображаемое имя</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">Описание</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Разрешения</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">Тип</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-28">Действия</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="role in filteredRoles" :key="role.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ role.id }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <i class="pi pi-shield text-purple-700 dark:text-purple-300 text-sm"></i>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ role.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ role.display_name }}</td>
                <td class="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">
                  <div class="max-w-xs truncate" :title="role.description">
                    {{ role.description || '-' }}
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center gap-1">
                    <i class="pi pi-key text-gray-400"></i>
                    {{ role.permissions.length }}
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    role.is_system
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  ]">
                    {{ role.is_system ? 'Системная' : 'Пользовательская' }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewRole(role)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Просмотр"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button
                      v-if="!role.is_system"
                      @click="editRole(role)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Редактировать"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button
                      v-if="!role.is_system"
                      @click="confirmDelete(role)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Удалить"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="!loading && filteredRoles.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <i class="pi pi-shield text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Роли не найдены</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Создайте первую роль для управления разрешениями' }}
        </p>
        <button
          v-if="!searchQuery"
          @click="showAddRoleDialog = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <i class="pi pi-plus"></i>
          Добавить роль
        </button>
      </div>
    </div>

    <!-- Диалог добавления/редактирования роли -->
    <RoleDialog
      v-if="showAddRoleDialog || showEditDialog"
      :role="selectedRole || undefined"
      :is-edit="showEditDialog"
      @close="closeDialog"
      @save="handleSave"
    />

    <!-- Диалог просмотра роли -->
    <RoleViewDialog
      v-if="showViewDialog && selectedRole"
      :role="selectedRole"
      @close="closeDialog"
    />

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog
      v-if="showDeleteDialog"
      :title="'Удаление роли'"
      :message="`Вы уверены, что хотите удалить роль '${selectedRole?.display_name}'?`"
      @confirm="deleteRole"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { ConfirmDialog } from '@/shared/ui'
import { rolesApi, type Role, type CreateRoleData, type UpdateRoleData } from '@/shared/api/roles'
import RoleDialog from './components/RoleDialog.vue'
import RoleViewDialog from './components/RoleViewDialog.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const searchQuery = ref('')
const showAddRoleDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedRole = ref<Role | null>(null)
const roles = ref<Role[]>([])
const loading = ref(false)
const error = ref<string | null>(null)


const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value

  const query = searchQuery.value.toLowerCase()
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(query) ||
    role.display_name.toLowerCase().includes(query) ||
    role.description?.toLowerCase().includes(query)
  )
})

const loadRoles = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await rolesApi.getRoles({
      per_page: 50,
      search: searchQuery.value || undefined
    })


    // Обрабатываем ответ в зависимости от формата
    if (response.data && Array.isArray(response.data)) {
      roles.value = response.data
    } else if (Array.isArray(response)) {
      roles.value = response
    } else {
      roles.value = []
      error.value = 'Неожиданный формат ответа от сервера'
    }
  } catch (err) {
    roles.value = []
    error.value = 'Ошибка загрузки данных с сервера'
  } finally {
    loading.value = false
  }
}

const viewRole = (role: Role) => {
  selectedRole.value = role
  showViewDialog.value = true
}

const editRole = (role: Role) => {
  selectedRole.value = role
  showEditDialog.value = true
}

const confirmDelete = (role: Role) => {
  selectedRole.value = role
  showDeleteDialog.value = true
}

const closeDialog = () => {
  showAddRoleDialog.value = false
  showEditDialog.value = false
  showViewDialog.value = false
  showDeleteDialog.value = false
  selectedRole.value = null
}

const handleSave = async (roleData: CreateRoleData | UpdateRoleData) => {
  try {
    loading.value = true

    if (showEditDialog.value && selectedRole.value) {
      // Редактирование существующей роли
      const response = await rolesApi.updateRole(selectedRole.value.id, roleData as UpdateRoleData)


      const index = roles.value.findIndex(role => role.id === selectedRole.value?.id)
      if (index !== -1) {
      // Обновляем роль в списке
      if (response.role) {
        roles.value[index] = response.role
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
      }
    } else {
      // Добавление новой роли
      const response = await rolesApi.createRole(roleData as CreateRoleData)


      // Добавляем новую роль в список
      if (response.role) {
        roles.value.push(response.role)
      } else {
        throw new Error('Неожиданный формат ответа от сервера')
      }
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: showEditDialog.value ? 'Роль обновлена' : 'Роль создана',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка сохранения роли'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка сохранения роли',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const deleteRole = async () => {
  if (!selectedRole.value) return

  try {
    loading.value = true

    await rolesApi.deleteRole(selectedRole.value.id)

    const index = roles.value.findIndex(role => role.id === selectedRole.value?.id)
    if (index !== -1) {
      roles.value.splice(index, 1)
    }

    // Показываем уведомление об успехе
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Роль удалена',
      life: 4000,
      closable: true,
      group: 'main'
    })

    closeDialog()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка удаления роли'

    // Показываем уведомление об ошибке
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: err instanceof Error ? err.message : 'Ошибка удаления роли',
      life: 6000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

// Обработка поиска с задержкой
let searchTimeout: number | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadRoles()
  }, 500)
})

onMounted(() => {
  loadRoles()
})
</script>
