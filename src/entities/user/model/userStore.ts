import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '../api/userApi'
import type { User, UserStats } from '@/shared/lib/types'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const userStats = ref<UserStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!currentUser.value)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await userApi.getUsers()
      if (response.success) {
        users.value = response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки пользователей'
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await userApi.getUserById(id)
      if (response.success) {
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки пользователя'
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await userApi.createUser(userData)
      if (response.status === 'success') {
        users.value.push(response.data)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка создания пользователя'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, userData: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await userApi.updateUser(id, userData)
      if (response.status === 'success') {
        const index = users.value.findIndex(user => user.id === id)
        if (index !== -1) {
          users.value[index] = response.data
        }
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка обновления пользователя'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await userApi.deleteUser(id)
      if (response.status === 'success') {
        users.value = users.value.filter(user => user.id !== id)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка удаления пользователя'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await userApi.getUserStats()
      if (response.status === 'success') {
        userStats.value = response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки статистики'
    } finally {
      loading.value = false
    }
  }

  const setCurrentUser = (user: User | null) => {
    currentUser.value = user
  }

  const clearError = () => {
    error.value = null
  }

  return {
    users,
    currentUser,
    userStats,
    loading,
    error,
    isAuthenticated,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    fetchUserStats,
    setCurrentUser,
    clearError
  }
})
