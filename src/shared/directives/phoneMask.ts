import type { DirectiveBinding } from 'vue'

function formatPhone(value: string): string {
  const digits = (value || '').replace(/\D/g, '')

  // Приводим к формату, начинающемуся с 7 и длиной 11
  let normalized = digits
  if (normalized.startsWith('8')) {
    normalized = '7' + normalized.slice(1)
  } else if (!normalized.startsWith('7') && normalized.length > 0) {
    normalized = '7' + normalized
  }
  normalized = normalized.slice(0, 11)

  // Строим строку вида: +7 777 123 45 67
  let out = ''
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i]
    if (i === 0) {
      out += '+7'
      if (normalized.length > 1) out += ' '
      continue
    }
    out += ch
    if (i === 3 || i === 6 || i === 8) {
      if (i !== normalized.length - 1) out += ' '
    }
  }
  return out.trim()
}

function setCursorToEnd(el: HTMLInputElement) {
  requestAnimationFrame(() => {
    const len = el.value.length
    el.setSelectionRange(len, len)
  })
}

export const phoneMask = {
  mounted(el: HTMLInputElement) {
    const handler = () => {
      const formatted = formatPhone(el.value)
      if (el.value !== formatted) {
        el.value = formatted
        el.dispatchEvent(new Event('input'))
        setCursorToEnd(el)
      }
    }
    el.addEventListener('input', handler)
    el.addEventListener('blur', handler)
    // Инициализация
    handler()
    ;(el as any)._phoneMaskHandler = handler
  },
  unmounted(el: HTMLInputElement) {
    const handler = (el as any)._phoneMaskHandler
    if (handler) {
      el.removeEventListener('input', handler)
      el.removeEventListener('blur', handler)
      delete (el as any)._phoneMaskHandler
    }
  }
} as unknown as DirectiveBinding

export default phoneMask


