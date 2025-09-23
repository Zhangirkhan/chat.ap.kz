<template>
  <div class="space-y-1">
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          :id="radioId"
          :name="name"
          :value="value"
          :checked="modelValue"
          :disabled="disabled"
          type="radio"
          :class="radioClasses"
          @change="$emit('update:modelValue', value)"
          @blur="$emit('blur')"
          @focus="$emit('focus')"
        />
      </div>
      <div class="ml-3 text-sm">
        <label
          v-if="label"
          :for="radioId"
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
  value: string
  label?: string
  modelValue?: string
  disabled?: boolean
  help?: string
  error?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const radioId = computed(() => `radio-${props.name}-${props.value}`)

const radioClasses = computed(() => {
  const baseClasses = 'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300'

  const stateClasses = props.disabled
    ? 'cursor-not-allowed opacity-50'
    : 'cursor-pointer'

  return [baseClasses, stateClasses].join(' ')
})
</script>
