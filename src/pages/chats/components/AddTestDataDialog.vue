<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="close"
  >
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
      <!-- Заголовок -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Добавить тестовые данные
          </h2>
          <button
            @click="close"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <i class="pi pi-times text-lg"></i>
          </button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Создать тестовых контрагентов для демонстрации
        </p>
      </div>

      <!-- Содержимое -->
      <div class="p-6">
        <div class="space-y-4">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            Будет создано {{ testContractors.length }} тестовых контрагентов:
          </div>

          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="contractor in testContractors"
              :key="contractor.name"
              class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span class="text-white font-semibold text-xs">{{ contractor.name.charAt(0) }}</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ contractor.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ contractor.phone }}</div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="text-center py-4">
            <div class="flex items-center justify-center gap-2">
              <i class="pi pi-spin pi-spinner text-blue-500"></i>
              <span class="text-gray-600 dark:text-gray-400">Создание контрагентов...</span>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div class="flex items-start gap-2">
              <i class="pi pi-exclamation-triangle text-red-500 mt-0.5"></i>
              <div class="text-red-700 dark:text-red-300 text-sm whitespace-pre-line">{{ error }}</div>
            </div>
          </div>

          <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-green-500"></i>
              <span class="text-green-700 dark:text-green-300 text-sm">{{ success }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
        <button
          @click="close"
          :disabled="loading"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50"
        >
          Отмена
        </button>
        <button
          @click="createTestData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { contractorsApi } from '@/shared/api/contractors'
import type { CreateContractorData } from '@/shared/api/contractors'
import { useToast } from 'primevue/usetoast'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toast = useToast()
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

// Функция для генерации уникального ИНН
const generateUniqueInn = (): string => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return (timestamp.slice(-7) + random).slice(0, 10)
}

const testContractors: CreateContractorData[] = []

const createTestData = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    let createdCount = 0
    const errors: string[] = []

    for (const contractorData of testContractors) {
      try {
        await contractorsApi.createContractor(contractorData)
        createdCount++
      } catch (err) {

        // Обрабатываем различные типы ошибок
        let errorMessage = 'Неизвестная ошибка'
        if (err instanceof Error) {
          if (err.message.includes('inn has already been taken')) {
            errorMessage = 'ИНН уже существует'
          } else if (err.message.includes('passport number field must not be greater than 6 characters')) {
            errorMessage = 'Номер паспорта превышает 6 символов'
          } else {
            errorMessage = err.message
          }
        }

        errors.push(`${contractorData.name}: ${errorMessage}`)
      }
    }

    if (createdCount > 0) {
      success.value = `Создано ${createdCount} из ${testContractors.length} контрагентов`

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: `Создано ${createdCount} тестовых контрагентов`,
        life: 4000,
        closable: true,
        group: 'main'
      })

      emit('created')
    }

    if (errors.length > 0) {
      error.value = `Ошибки при создании:\n${errors.join('\n')}`

      // Показываем уведомление об ошибках
      toast.add({
        severity: 'warn',
        summary: 'Частично успешно',
        detail: `Создано ${createdCount} из ${testContractors.length} контрагентов. Некоторые не удалось создать.`,
        life: 5000,
        closable: true,
        group: 'main'
      })
    }

    // Если ничего не создалось
    if (createdCount === 0) {
      error.value = `Не удалось создать ни одного контрагента:\n${errors.join('\n')}`

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось создать тестовых контрагентов',
        life: 5000,
        closable: true,
        group: 'main'
      })
    }

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка создания тестовых данных'

    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Ошибка создания тестовых данных',
      life: 5000,
      closable: true,
      group: 'main'
    })
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (!loading.value) {
    error.value = null
    success.value = null
    emit('close')
  }
}
</script>



