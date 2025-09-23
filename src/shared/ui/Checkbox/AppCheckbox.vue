<template>
  <div class="space-y-1">
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          :id="checkboxId"
          :name="name"
          :value="value"
          :checked="modelValue"
          :disabled="disabled"
          type="checkbox"
          :class="checkboxClasses"
          @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
          @blur="$emit('blur')"
          @focus="$emit('focus')"
        />
      </div>
      <div class="ml-3 text-sm">
        <label
          v-if="label"
          :for="checkboxId"
          class="font-medium text-gray-700 cursor-pointer"
        >
          {{ label }}
        </label>
        <p v-if="help && !error" class="text-gray-500">
          {{ help }}
        </p>
        <p v-if="error" class="text-red-600">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  label?: string
  modelValue?: boolean
  value?: string
  disabled?: boolean
  help?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: '1'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  blur: []
  focus: []
}>()

const checkboxId = computed(() => `checkbox-${props.name}`)

const checkboxClasses = computed(() => {
  const baseClasses = 'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'

  const stateClasses = props.disabled
    ? 'cursor-not-allowed opacity-50'
    : 'cursor-pointer'

  return [baseClasses, stateClasses].join(' ')
})
</script>
