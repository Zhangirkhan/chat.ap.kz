<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" @click.stop>
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Смена пароля</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Новый пароль *</label>
          <input
            v-model="form.new_password"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Подтверждение пароля *</label>
          <input
            v-model="form.new_password_confirmation"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <p v-if="mismatch" class="text-xs text-red-600 mt-1">Пароли не совпадают</p>
        </div>
      </form>

      <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button type="button" @click="$emit('close')" class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">Закрыть</button>
        <button type="button" @click="handleSubmit" :disabled="loading || mismatch" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-check"></i>
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps<{ defaultPassword?: string }>()

const loading = ref(false)
const form = reactive({
  new_password: '',
  new_password_confirmation: ''
})

const mismatch = computed(() => form.new_password !== form.new_password_confirmation)

onMounted(() => {
  const initial = props.defaultPassword || '12345678'
  form.new_password = initial
  form.new_password_confirmation = initial
})

const handleSubmit = () => {
  if (mismatch.value) return
  loading.value = true
  emit('save', {
    password: form.new_password,
    password_confirmation: form.new_password_confirmation
  })
  setTimeout(() => { loading.value = false }, 300)
}
</script>
