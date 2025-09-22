<template>
  <!-- Модальное окно просмотрщика -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
    @click="closeViewer"
  >
    <!-- Контейнер изображения -->
    <div
      class="relative max-w-full max-h-full flex items-center justify-center"
      @click.stop
    >
      <!-- Фон для PNG с прозрачностью -->
      <div class="absolute inset-0 bg-white rounded-lg opacity-90"></div>

      <!-- Изображение -->
      <img
        :src="currentImage.src"
        :alt="currentImage.name"
        :style="{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }"
        class="relative max-w-[90vw] max-h-[90vh] object-contain cursor-grab active:cursor-grabbing select-none"
        @mousedown="startDrag"
        @wheel="handleWheel"
        @load="onImageLoad"
        draggable="false"
      />

      <!-- Панель управления -->
      <div class="absolute top-4 right-4 flex items-center gap-2">
        <!-- Информация о файле -->
        <div v-if="currentImage.name" class="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
          {{ currentImage.name }}
        </div>

        <!-- Кнопки управления -->
        <div class="flex items-center gap-1 bg-black bg-opacity-50 rounded-lg p-1">
          <!-- Уменьшить -->
          <button
            @click="zoomOut"
            class="w-8 h-8 text-white hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
            title="Уменьшить"
          >
            <i class="pi pi-minus text-sm"></i>
          </button>

          <!-- Масштаб -->
          <span class="text-white text-xs px-2 min-w-12 text-center">
            {{ Math.round(scale * 100) }}%
          </span>

          <!-- Увеличить -->
          <button
            @click="zoomIn"
            class="w-8 h-8 text-white hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
            title="Увеличить"
          >
            <i class="pi pi-plus text-sm"></i>
          </button>

          <!-- Повернуть -->
          <button
            @click="rotate"
            class="w-8 h-8 text-white hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
            title="Повернуть"
          >
            <i class="pi pi-refresh text-sm"></i>
          </button>

          <!-- Сброс -->
          <button
            @click="resetTransform"
            class="w-8 h-8 text-white hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
            title="Сбросить"
          >
            <i class="pi pi-home text-sm"></i>
          </button>

          <!-- Скачать -->
          <a
            :href="currentImage.src"
            :download="currentImage.name"
            class="w-8 h-8 text-white hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
            title="Скачать"
          >
            <i class="pi pi-download text-sm"></i>
          </a>

          <!-- Закрыть -->
          <button
            @click="closeViewer"
            class="w-8 h-8 text-white hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
            title="Закрыть"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Навигация (если несколько изображений) -->
      <div v-if="images.length > 1" class="absolute inset-y-0 left-4 flex items-center">
        <button
          v-if="currentIndex > 0"
          @click="previousImage"
          class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
          title="Предыдущее"
        >
          <i class="pi pi-chevron-left"></i>
        </button>
      </div>

      <div v-if="images.length > 1" class="absolute inset-y-0 right-4 flex items-center">
        <button
          v-if="currentIndex < images.length - 1"
          @click="nextImage"
          class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
          title="Следующее"
        >
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>

      <!-- Индикатор позиции -->
      <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div class="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
          {{ currentIndex + 1 }} из {{ images.length }}
        </div>
      </div>
    </div>

    <!-- Подсказки -->
    <div class="absolute bottom-4 left-4 text-white text-sm opacity-75">
      <div>Колесо мыши - увеличение</div>
      <div>Перетаскивание - перемещение</div>
      <div>ESC - закрыть</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ImageData {
  src: string
  name?: string
}

const props = defineProps<{
  isOpen: boolean
  images: ImageData[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const currentIndex = ref(props.initialIndex || 0)
const scale = ref(1)
const rotation = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imagePosition = ref({ x: 0, y: 0 })

// Текущее изображение
const currentImage = computed(() => {
  return props.images[currentIndex.value] || { src: '', name: '' }
})

// Функции управления масштабом
const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 5)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.1)
}

const rotate = () => {
  rotation.value = (rotation.value + 90) % 360
}

const resetTransform = () => {
  scale.value = 1
  rotation.value = 0
  imagePosition.value = { x: 0, y: 0 }
}

// Навигация между изображениями
const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetTransform()
  }
}

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
    resetTransform()
  }
}

// Обработка колеса мыши для зума
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()

  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

// Перетаскивание изображения
const startDrag = (event: MouseEvent) => {
  if (scale.value <= 1) return

  isDragging.value = true
  dragStart.value = {
    x: event.clientX - imagePosition.value.x,
    y: event.clientY - imagePosition.value.y
  }
}

const drag = (event: MouseEvent) => {
  if (!isDragging.value) return

  imagePosition.value = {
    x: event.clientX - dragStart.value.x,
    y: event.clientY - dragStart.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
}

// Закрытие просмотрщика
const closeViewer = () => {
  resetTransform()
  emit('close')
}

// Обработка событий загрузки изображения
const onImageLoad = () => {
  resetTransform()
}

// Обработка клавиш
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (event.key) {
    case 'Escape':
      closeViewer()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetTransform()
      break
    case 'r':
    case 'R':
      event.preventDefault()
      rotate()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
})

// Сброс при изменении изображения
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetTransform()
    currentIndex.value = props.initialIndex || 0
  }
})

// Импорт watch
import { watch } from 'vue'
</script>

<style scoped>
/* Предотвращаем выделение текста при перетаскивании */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Анимации */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
