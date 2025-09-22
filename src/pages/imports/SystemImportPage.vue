<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Импорт системных данных
        </h1>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="max-w-2xl">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Загрузка данных
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Выберите файл для импорта
              </label>
              <input
                type="file"
                @change="handleFileSelect"
                accept=".csv,.xlsx,.xls"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            <div v-if="selectedFile" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Выбранный файл: <span class="font-medium">{{ selectedFile.name }}</span>
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Размер: {{ formatFileSize(selectedFile.size) }}
              </p>
            </div>

            <div class="flex gap-4">
              <button
                @click="uploadFile"
                :disabled="!selectedFile || isUploading"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isUploading">Загрузка...</span>
                <span v-else>Загрузить</span>
              </button>

              <button
                @click="clearFile"
                v-if="selectedFile"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Очистить
              </button>
            </div>
          </div>

          <div v-if="uploadResult" class="mt-6 p-4 rounded-md" :class="{
            'bg-green-50 border border-green-200': uploadResult.success,
            'bg-red-50 border border-red-200': !uploadResult.success
          }">
            <p class="text-sm" :class="{
              'text-green-800': uploadResult.success,
              'text-red-800': !uploadResult.success
            }">
              {{ uploadResult.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/shared/ui/AdminLayout/AdminLayout.vue'
import { apiClient } from '@/shared/api/client'

const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadResult = ref<{ success: boolean; message: string } | null>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    uploadResult.value = null
  }
}

const clearFile = () => {
  selectedFile.value = null
  uploadResult.value = null
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  uploadResult.value = null

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await apiClient.post('/imports/system', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    uploadResult.value = {
      success: true,
      message: response.data.message || 'Файл успешно загружен и обработан'
    }
  } catch (error: any) {
    uploadResult.value = {
      success: false,
      message: error.response?.data?.message || 'Произошла ошибка при загрузке файла'
    }
  } finally {
    isUploading.value = false
  }
}
</script>
