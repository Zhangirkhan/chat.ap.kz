<template>
  <div class="departments-header">
    <Button
      variant="primary"
      icon="pi pi-plus"
      @click="$emit('createDepartment')"
    >
      Добавить отдел
    </Button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  createDepartment: []
}>()
</script>

<style scoped>
.departments-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}
</style>
