<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <!-- Верхний отступ -->
    <div :style="{ height: offsetY + 'px' }"></div>
    
    <!-- Видимые элементы -->
    <div
      v-for="(item, index) in visibleItems"
      :key="getItemKey(item, startIndex + index)"
      class="virtual-list-item"
      :style="{ height: itemHeight + 'px' }"
    >
      <slot
        :item="item"
        :index="startIndex + index"
        :isVisible="true"
      />
    </div>
    
    <!-- Нижний отступ -->
    <div :style="{ height: (totalHeight - offsetY - visibleHeight) + 'px' }"></div>
    
    <!-- Индикатор загрузки -->
    <div
      v-if="loading"
      class="virtual-list-loading"
      :style="{ height: itemHeight + 'px' }"
    >
      <slot name="loading">
        <div class="flex items-center justify-center h-full">
          <i class="pi pi-spin pi-spinner text-blue-500"></i>
          <span class="ml-2 text-gray-600 dark:text-gray-400">Загрузка...</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Props {
  items: unknown[]
  itemHeight: number
  containerHeight: number
  overscan?: number
  loading?: boolean
  getItemKey?: (item: unknown, index: number) => string | number
}

const props = withDefaults(defineProps<Props>(), {
  overscan: 5,
  loading: false,
  getItemKey: (item: unknown, index: number) => (item as { id?: string | number }).id || index
})

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

// Вычисляемые свойства
const totalHeight = computed(() => props.items.length * props.itemHeight)
const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight))
const endIndex = computed(() => Math.min(
  props.items.length,
  startIndex.value + visibleCount.value + props.overscan
))

const offsetY = computed(() => startIndex.value * props.itemHeight)
const visibleHeight = computed(() => (endIndex.value - startIndex.value) * props.itemHeight)

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value)
})

// Обработка скролла
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// Прокрутка к элементу
const scrollToIndex = (index: number) => {
  if (containerRef.value) {
    const targetScrollTop = index * props.itemHeight
    containerRef.value.scrollTop = targetScrollTop
  }
}

// Прокрутка к элементу по ключу
const scrollToItem = (item: unknown) => {
  const index = props.items.findIndex(i => props.getItemKey(i, 0) === props.getItemKey(item, 0))
  if (index !== -1) {
    scrollToIndex(index)
  }
}

// Прокрутка в начало
const scrollToTop = () => {
  scrollToIndex(0)
}

// Прокрутка в конец
const scrollToBottom = () => {
  scrollToIndex(props.items.length - 1)
}

// Обновление при изменении элементов
watch(() => props.items.length, () => {
  nextTick(() => {
    // Если мы были в конце списка, прокручиваем к новому концу
    if (scrollTop.value + props.containerHeight >= totalHeight.value - props.itemHeight) {
      scrollToBottom()
    }
  })
})

// Экспортируем методы
defineExpose({
  scrollToIndex,
  scrollToItem,
  scrollToTop,
  scrollToBottom,
  containerRef
})
</script>

<style scoped>
.virtual-list-container {
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.virtual-list-item {
  position: relative;
  width: 100%;
}

.virtual-list-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Кастомный скроллбар */
.virtual-list-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .virtual-list-container::-webkit-scrollbar-track {
  background: #374151;
}

.dark .virtual-list-container::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .virtual-list-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>