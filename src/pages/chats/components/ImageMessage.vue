<template>
  <div class="mb-2">
    <!-- Одиночное изображение -->
    <div v-if="!isPartOfImageGroup" class="single-image">
      <img
        :src="message.file_path"
        :alt="message.file_name || 'Изображение'"
        class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        style="max-height: 250px; width: auto; object-fit: contain;"
        @click="$emit('openImagePreview', message.file_path)"
        @error="handleImageError"
      />
      <p v-if="message.message" class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
    </div>
    
    <!-- Группа изображений (первое изображение в группе) -->
    <div v-else-if="isFirstInImageGroup" class="image-group">
      <div class="grid grid-cols-2 gap-2">
        <div 
          v-for="(imgMsg, index) in imageGroup" 
          :key="imgMsg.id"
          class="relative group"
          :class="getImageGroupGridClass(imageGroup, index)"
        >
          <img
            :src="imgMsg.file_path"
            :alt="imgMsg.file_name || 'Изображение'"
            class="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity object-cover"
            :style="getImageGroupStyle(imageGroup, index)"
            @click="$emit('openImagePreview', imgMsg.file_path)"
            @error="handleImageError"
          />
          <!-- Показать количество оставшихся изображений для последнего элемента -->
          <div 
            v-if="index === 3 && imageGroup.length > 4"
            class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all"
            @click="$emit('openImagePreview', imgMsg.file_path)"
          >
            <span class="text-white font-semibold text-lg">+{{ imageGroup.length - 4 }}</span>
          </div>
        </div>
      </div>
      <p v-if="message.message" class="text-xs text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{{ message.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/shared/lib/types'
import { useImageGrouping } from '@/shared/composables/useImageGrouping'

interface Props {
  message: Message
  messages: Message[]
  isFromClient: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  openImagePreview: [url: string]
}>()

const {
  isPartOfImageGroup: checkIsPartOfImageGroup,
  isFirstInImageGroup: checkIsFirstInImageGroup,
  getImageGroup,
  getImageGroupGridClass,
  getImageGroupStyle
} = useImageGrouping()

const isPartOfImageGroup = computed(() => 
  checkIsPartOfImageGroup(props.message, props.messages)
)

const isFirstInImageGroup = computed(() => 
  checkIsFirstInImageGroup(props.message, props.messages)
)

const imageGroup = computed(() => 
  getImageGroup(props.message, props.messages)
)

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('Failed to load image:', img.src)
}
</script>
