import { ref, computed, onMounted, onUnmounted } from 'vue'

export function usePerformanceOptimization() {
  const performanceMetrics = ref({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0
  })

  const isLowPerformance = ref(false)
  const performanceMode = ref<'normal' | 'optimized' | 'minimal'>('normal')

  // Мониторинг производительности
  const startPerformanceMonitoring = () => {
    // Мониторинг памяти
    const memoryObserver = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory
        performanceMetrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
        
        // Переключаемся в режим оптимизации при высоком использовании памяти
        if (performanceMetrics.value.memoryUsage > 100) {
          isLowPerformance.value = true
          performanceMode.value = 'optimized'
        } else if (performanceMetrics.value.memoryUsage < 50) {
          isLowPerformance.value = false
          performanceMode.value = 'normal'
        }
      }
    }, 5000)

    // Мониторинг FPS
    let lastTime = performance.now()
    let frameCount = 0
    let fps = 60

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime
        
        // Переключаемся в минимальный режим при низком FPS
        if (fps < 30) {
          performanceMode.value = 'minimal'
        } else if (fps > 45 && performanceMode.value === 'minimal') {
          performanceMode.value = 'optimized'
        }
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    measureFPS()

    return () => {
      clearInterval(memoryObserver)
    }
  }

  // Debounce для оптимизации
  const useDebounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: number | null = null
    
    return ((...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }) as T
  }

  // Throttle для оптимизации
  const useThrottle = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): T => {
    let lastCall = 0
    
    return ((...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }) as T
  }

  // Виртуализация для больших списков
  const useVirtualization = (items: unknown[], itemHeight: number, containerHeight: number) => {
    const scrollTop = ref(0)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const overscan = 5

    const startIndex = computed(() => Math.floor(scrollTop.value / itemHeight))
    const endIndex = computed(() => Math.min(
      items.length,
      startIndex.value + visibleCount + overscan
    ))

    const visibleItems = computed(() => 
      items.slice(startIndex.value, endIndex.value)
    )

    const offsetY = computed(() => startIndex.value * itemHeight)

    return {
      visibleItems,
      offsetY,
      startIndex,
      endIndex
    }
  }

  // Ленивая загрузка изображений
  const useLazyImages = () => {
    const imageObserver = ref<IntersectionObserver | null>(null)
    const loadedImages = ref<Set<string>>(new Set())

    const observeImage = (img: HTMLImageElement, src: string) => {
      if (imageObserver.value) {
        imageObserver.value.observe(img)
      }
    }

    const setupImageObserver = () => {
      imageObserver.value = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            
            if (src && !loadedImages.value.has(src)) {
              img.src = src
              loadedImages.value.add(src)
              imageObserver.value?.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px'
      })
    }

    return {
      observeImage,
      setupImageObserver,
      loadedImages: computed(() => loadedImages.value)
    }
  }

  // Оптимизация рендеринга
  const useRenderOptimization = () => {
    const shouldRender = ref(true)
    const renderCount = ref(0)

    const skipRender = () => {
      shouldRender.value = false
    }

    const enableRender = () => {
      shouldRender.value = true
    }

    const incrementRenderCount = () => {
      renderCount.value++
    }

    return {
      shouldRender: computed(() => shouldRender.value),
      renderCount: computed(() => renderCount.value),
      skipRender,
      enableRender,
      incrementRenderCount
    }
  }

  // Кэширование вычислений
  const useComputedCache = <T>(computeFn: () => T, deps: unknown[]) => {
    const cache = ref<Map<string, T>>(new Map())
    const lastDeps = ref<unknown[]>([])

    return computed(() => {
      const depsKey = JSON.stringify(deps)
      
      if (depsKey === JSON.stringify(lastDeps.value) && cache.value.has(depsKey)) {
        performanceMetrics.value.cacheHits++
        return cache.value.get(depsKey)!
      }

      performanceMetrics.value.cacheMisses++
      const result = computeFn()
      cache.value.set(depsKey, result)
      lastDeps.value = [...deps]
      
      return result
    })
  }

  // Статистика производительности
  const performanceStats = computed(() => ({
    ...performanceMetrics.value,
    isLowPerformance: isLowPerformance.value,
    performanceMode: performanceMode.value,
    cacheHitRate: performanceMetrics.value.cacheHits / 
      (performanceMetrics.value.cacheHits + performanceMetrics.value.cacheMisses) * 100
  }))

  // Инициализация мониторинга
  onMounted(() => {
    const cleanup = startPerformanceMonitoring()
    
    onUnmounted(cleanup)
  })

  return {
    // Состояние
    performanceMetrics: computed(() => performanceMetrics.value),
    isLowPerformance: computed(() => isLowPerformance.value),
    performanceMode: computed(() => performanceMode.value),
    performanceStats,
    
    // Утилиты
    useDebounce,
    useThrottle,
    useVirtualization,
    useLazyImages,
    useRenderOptimization,
    useComputedCache,
    
    // Методы
    startPerformanceMonitoring
  }
}
