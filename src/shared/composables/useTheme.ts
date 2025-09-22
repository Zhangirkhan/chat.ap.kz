import { ref, computed, watch, onMounted } from 'vue'

const THEME_KEY = 'chat-admin-theme'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  // Сохраняем тему в localStorage
  watch(theme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    applyTheme(newTheme)
  }, { immediate: true })

  // Применяем тему к документу
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    } else {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    }
  }

  // Загружаем сохраненную тему при инициализации
  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      theme.value = savedTheme
    } else {
      // Определяем системную тему
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
  })

  return {
    theme: computed(() => theme.value),
    isDark,
    isLight,
    toggleTheme,
    setTheme
  }
}
