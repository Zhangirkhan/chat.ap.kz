<template>
  <div
    :class="[
      'fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
      'w-72',
      sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
    ]"
  >
    <SidebarHeader />
    <SidebarNavigation
      :open-groups="openGroups"
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-group="$emit('toggleGroup', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import SidebarHeader from './SidebarHeader.vue'
import SidebarNavigation from './SidebarNavigation.vue'

interface Props {
  sidebarCollapsed: boolean
  openGroups: {
    companies: boolean
    communication: boolean
  }
}

defineProps<Props>()

const emit = defineEmits<{
  toggleGroup: [groupName: string]
}>()
</script>
