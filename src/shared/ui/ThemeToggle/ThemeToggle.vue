<template>
  <div class="theme-toggle" @click="toggleTheme">
    <div class="theme-toggle-track" :class="{ 'theme-toggle-track--dark': isDark }">
      <div class="theme-toggle-thumb" :class="{ 'theme-toggle-thumb--dark': isDark }">
        <i :class="isDark ? 'pi pi-moon' : 'pi pi-sun'"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/shared/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  cursor: pointer;
  user-select: none;
}

.theme-toggle-track {
  width: 60px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.theme-toggle-track:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.theme-toggle-track--dark {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.3);
}

.theme-toggle-track--dark:hover {
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.4);
}

.theme-toggle-thumb {
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.theme-toggle-thumb--dark {
  transform: translateX(28px);
  background: #f8f9fa;
}

.theme-toggle-thumb i {
  font-size: 14px;
  color: #667eea;
  transition: color 0.3s ease;
}

.theme-toggle-thumb--dark i {
  color: #2c3e50;
}

/* Dark theme styles */
:global(.dark-theme) .theme-toggle-track {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  box-shadow: 0 2px 8px rgba(74, 85, 104, 0.3);
}

:global(.dark-theme) .theme-toggle-track:hover {
  box-shadow: 0 4px 12px rgba(74, 85, 104, 0.4);
}

:global(.dark-theme) .theme-toggle-thumb {
  background: #1a202c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

:global(.dark-theme) .theme-toggle-thumb i {
  color: #e2e8f0;
}

:global(.dark-theme) .theme-toggle-thumb--dark i {
  color: #f7fafc;
}
</style>
