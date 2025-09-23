<template>
  <div class="space-y-1">
    <label 
      v-if="label" 
      :for="textareaId" 
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <textarea
      :id="textareaId"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :class="textareaClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    
    <p v-if="help && !error" class="text-sm text-gray-500">
      {{ help }}
    </p>
    
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  label?: string
  modelValue?: string | number
  placeholder?: string
  rows?: number
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  help?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  focus: []
}>()

const textareaId = computed(() => `textarea-${props.name}`)

const textareaClasses = computed(() => {
  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  }
  
  const stateClasses = props.disabled 
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
    : props.readonly 
    ? 'bg-gray-50 text-gray-900' 
    : 'bg-white'
  
  return [
    baseClasses,
    sizeClasses[props.size],
    stateClasses
  ].join(' ')
})
</script>
