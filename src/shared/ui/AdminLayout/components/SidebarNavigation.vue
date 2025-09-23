<template>
  <nav class="p-2 lg:p-4">
    <ul class="space-y-1 lg:space-y-2">
      <!-- Панель управления -->
      <li>
        <router-link
          to="/admin"
          :class="getActiveClasses({ to: '/admin', label: '', icon: '', group: 'main' })"
        >
          <i class="pi pi-home text-base lg:text-lg"></i>
          <span class="font-medium">
            Панель управления
          </span>
        </router-link>
      </li>

      <!-- Группа: Компании -->
      <li class="pt-4">
        <button
          @click="$emit('toggleGroup', 'companies')"
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <span>Компании</span>
          <i :class="[
            'pi transition-transform duration-200',
            openGroups.companies ? 'pi-chevron-down' : 'pi-chevron-right'
          ]"></i>
        </button>
      </li>

      <!-- Элементы группы Компании -->
      <div v-if="openGroups.companies" class="ml-4 space-y-1">
        <li v-for="item in companyItems" :key="item.to">
          <router-link
            :to="item.to"
            :class="getActiveClasses(item)"
          >
            <i :class="`${item.icon} text-base lg:text-lg`"></i>
            <span class="font-medium transition-opacity duration-300">
              {{ item.label }}
            </span>
          </router-link>
        </li>
      </div>

      <!-- Группа: Общение -->
      <li class="pt-4">
        <button
          @click="$emit('toggleGroup', 'communication')"
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          <span>Общение</span>
          <i :class="[
            'pi transition-transform duration-200',
            openGroups.communication ? 'pi-chevron-down' : 'pi-chevron-right'
          ]"></i>
        </button>
      </li>

      <!-- Элементы группы Общение -->
      <div v-if="!sidebarCollapsed && openGroups.communication" class="ml-4 space-y-1">
        <li v-for="item in communicationItems" :key="item.to">
          <router-link
            :to="item.to"
            :class="getActiveClasses(item)"
          >
            <i :class="`${item.icon} text-base lg:text-lg`"></i>
            <span class="font-medium transition-opacity duration-300">
              {{ item.label }}
            </span>
          </router-link>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNavigation } from '@/shared/composables/useNavigation'

interface Props {
  openGroups: {
    companies: boolean
    communication: boolean
  }
  sidebarCollapsed: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggleGroup: [groupName: string]
}>()

const { getActiveClasses, getGroupItems } = useNavigation()

const companyItems = computed(() => getGroupItems('companies'))
const communicationItems = computed(() => getGroupItems('communication'))
</script>
