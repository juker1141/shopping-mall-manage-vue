import { ref } from 'vue'

interface Product {
  id: number
  name: string
  price: number
  quantity: number
}

export function useCalculateTotal(items: Product[]) {
  const total = ref(0)

  function calculateTotal() {
    total.value = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }

  return { total, calculateTotal }
}
