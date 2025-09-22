import type { DirectiveBinding } from 'vue'

function formatEmail(value: string): string {
  const raw = (value || '').trim()
  // Удаляем пробелы, переводим в нижний регистр
  let out = raw.replace(/\s+/g, '').toLowerCase()
  // Разрешаем буквы, цифры и спецсимволы email до одного @ и доменной части
  // Удаляем все недопустимые символы
  out = out.replace(/[^a-z0-9!#$%&'*+\-/=?^_`{|}~.@]/g, '')
  // Не допускаем более одного символа @
  const parts = out.split('@')
  if (parts.length > 2) {
    out = parts.shift() + '@' + parts.join('')
  }
  // Удаляем точку в начале/конце локальной части и доменной части
  const idx = out.indexOf('@')
  if (idx !== -1) {
    let local = out.slice(0, idx)
    let domain = out.slice(idx + 1)
    local = local.replace(/^\.+|\.+$/g, '')
    domain = domain.replace(/^\.+|\.+$/g, '')
    out = local + '@' + domain
  } else {
    out = out.replace(/^\.+|\.+$/g, '')
  }
  return out
}

export const emailMask = {
  mounted(el: HTMLInputElement) {
    const handler = () => {
      const formatted = formatEmail(el.value)
      if (el.value !== formatted) {
        el.value = formatted
        el.dispatchEvent(new Event('input'))
      }
    }
    el.addEventListener('input', handler)
    el.addEventListener('blur', handler)
    ;(el as any)._emailMaskHandler = handler
  },
  unmounted(el: HTMLInputElement) {
    const handler = (el as any)._emailMaskHandler
    if (handler) {
      el.removeEventListener('input', handler)
      el.removeEventListener('blur', handler)
      delete (el as any)._emailMaskHandler
    }
  }
} as unknown as DirectiveBinding

export default emailMask
