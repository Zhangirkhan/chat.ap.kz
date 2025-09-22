<template>
  <Layout>
    <template #title>Создание пользователя</template>
    
    <template #header-actions>
      <Button href="/admin/users" variant="secondary">
        ← Назад к списку
      </Button>
    </template>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Создание пользователя</h1>
      </div>

      <UserForm 
        @success="handleSuccess"
        @cancel="handleCancel"
      />

      <!-- Показываем уведомления -->
      <Alert 
        v-if="successMessage" 
        type="success" 
        :message="successMessage" 
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Layout, Button, Alert } from '@/shared/ui'
import { UserForm } from '@/features/user-management'
import type { UserFormData } from '@/features/user-management'

const router = useRouter()
const successMessage = ref('')

const handleSuccess = (user: UserFormData) => {
  successMessage.value = `Пользователь "${user.name}" успешно создан!`
  
  // Перенаправляем на список пользователей через 2 секунды
  setTimeout(() => {
    router.push('/admin/users')
  }, 2000)
}

const handleCancel = () => {
  router.push('/admin/users')
}
</script>





