import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  
  // Дополнительные правила для улучшения качества кода
  {
    rules: {
      // Отключаем строгие правила для упрощения разработки
      '@typescript-eslint/no-explicit-any': 'warn', // Предупреждение вместо ошибки
      '@typescript-eslint/no-unused-vars': 'warn', // Предупреждение вместо ошибки
      'vue/multi-word-component-names': 'warn', // Предупреждение вместо ошибки
      'vue/no-mutating-props': 'warn', // Предупреждение вместо ошибки
      'vue/no-duplicate-attributes': 'error', // Оставляем как ошибку
      'vue/no-parsing-error': 'error', // Оставляем как ошибку
      'vue/no-textarea-mustache': 'warn', // Предупреждение вместо ошибки
      
      // Дополнительные правила для качества кода
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'warn',
      
      // Правила для Vue
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
      'vue/component-definition-name-casing': ['warn', 'PascalCase'],
      'vue/require-default-prop': 'warn',
      'vue/require-prop-types': 'warn',
      'vue/require-v-for-key': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      
      // Правила для TypeScript
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    }
  }
)
