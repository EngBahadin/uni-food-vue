interface PaymentInfo {
  payment_method: 'FIB' | 'DELIVERY'
  order_id: number
  created_at: string
}

const STORAGE_KEY = 'unifood_payment_info'

export function savePaymentInfo(orderId: number, paymentMethod: 'FIB' | 'DELIVERY') {
  try {
    const existingData = getStoredPayments()
    const paymentInfo: PaymentInfo = {
      payment_method: paymentMethod,
      order_id: orderId,
      created_at: new Date().toISOString(),
    }

    existingData[orderId] = paymentInfo
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData))
  } catch (error) {
    console.error('Failed to save payment info:', error)
  }
}

export function getPaymentInfo(orderId: number): PaymentInfo | null {
  try {
    const storedPayments = getStoredPayments()
    return storedPayments[orderId] || null
  } catch (error) {
    console.error('Failed to get payment info:', error)
    return null
  }
}

function getStoredPayments(): Record<number, PaymentInfo> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse stored payments:', error)
    return {}
  }
}

export function clearOldPayments() {
  try {
    const storedPayments = getStoredPayments()
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    const filtered: Record<number, PaymentInfo> = {}
    for (const [orderId, info] of Object.entries(storedPayments)) {
      const createdAt = new Date(info.created_at).getTime()
      if (createdAt > thirtyDaysAgo) {
        filtered[Number(orderId)] = info
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to clear old payments:', error)
  }
}

