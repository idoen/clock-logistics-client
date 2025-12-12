import { ref } from 'vue'

type Toast = { id: number; message: string }

const toasts = ref<Toast[]>([])
let counter = 1

export function useToastBus() {
  function push(message: string) {
    const id = counter++
    toasts.value.push({ id, message })
    setTimeout(() => remove(id), 2500)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, push, remove }
}
