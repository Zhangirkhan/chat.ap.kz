<template>
  <Card>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="name"
          label="Имя пользователя"
          v-model="form.name"
          :error="errors.name"
          required
        />

        <Input
          name="email"
          label="Email"
          type="email"
          v-model="form.email"
          :error="errors.email"
          required
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          name="role"
          label="Роль"
          :options="roleOptions"
          v-model="form.role"
          :error="errors.role"
          required
        />

        <div class="flex items-center">
          <Checkbox
            name="is_active"
            label="Активный пользователь"
            v-model="form.is_active"
            :error="errors.is_active"
          />
        </div>
      </div>

      <Textarea
        name="description"
        label="Описание"
        v-model="form.description"
        placeholder="Введите описание..."
        rows="4"
        help="Максимум 500 символов"
        :error="errors.description"
      />

      <div class="flex justify-end space-x-3">
        <Button type="button" variant="secondary" @click="handleCancel">
          Отмена
        </Button>
        <Button type="submit" variant="primary" :loading="isSubmitting">
          {{ isEditing ? 'Обновить' : 'Создать' }} пользователя
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Input, Select, Textarea, Checkbox, Button, Card } from '@/shared/ui'
import { useUserForm } from '../model/useUserForm'
import { roleOptions } from '../lib/constants'

interface Props {
  userId?: string
  initialData?: Partial<UserFormData>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  success: [user: UserFormData]
  cancel: []
}>()

const { form, errors, isSubmitting, isEditing, handleSubmit, handleCancel } = useUserForm({
  userId: props.userId,
  initialData: props.initialData,
  onSuccess: (user) => emit('success', user),
  onCancel: () => emit('cancel')
})
</script>
