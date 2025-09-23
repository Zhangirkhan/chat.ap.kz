<template>
  <Header>
    <template #title>Управление организациями</template>
    <template #subtitle>Создание и управление организациями</template>
    <template #actions>
      <Button
        variant="primary"
        icon="pi pi-plus"
        @click="$emit('createOrganization')"
      >
        Добавить организацию
      </Button>
    </template>
  </Header>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  createOrganization: []
}>()
</script>
