import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDarkMode = ref(false)

  const initTheme = () => {
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      // Если тема не сохранена, проверяем системные настройки
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    applyTheme()
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }

  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const setTheme = (theme: 'light' | 'dark') => {
    isDarkMode.value = theme === 'dark'
    applyTheme()
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
    initTheme
  }
}