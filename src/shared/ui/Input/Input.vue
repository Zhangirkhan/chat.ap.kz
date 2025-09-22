<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <i v-if="icon" :class="['absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400', icon]"></i>
    </div>

    <p v-if="help && !error" class="text-sm text-gray-500">
      {{ help }}
    </p>

    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  name: string
  label?: string
  modelValue?: string | number
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  help?: string
  error?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'error' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  focus: []
}>()

const inputId = computed(() => `input-${props.name}`)

const inputClasses = computed(() => {
  const baseClasses = 'block w-full rounded-md border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  }

  const variantClasses = {
    default: 'border-gray-300',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  }

  const stateClasses = props.disabled
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
    : props.readonly
    ? 'bg-gray-50 text-gray-900'
    : 'bg-white'

  const iconClasses = props.icon ? 'pl-10' : ''

  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    stateClasses,
    iconClasses
  ].join(' ')
})
</script>

