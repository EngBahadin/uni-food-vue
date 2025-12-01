<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="handleCancel"></div>

        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8 z-10 transform transition-all"
        >
          <!-- Title -->
          <h2 class="text-xl font-bold mb-6 text-black">{{ $t('cart.selectPaymentMethod') }}</h2>

          <!-- Payment Methods -->
          <div class="space-y-3 mb-6">
            <!-- FIB Payment -->
            <button
              @click="selectPaymentMethod('FIB')"
              :class="[
                'w-full p-4 rounded-lg border-2 transition-all text-left',
                selectedMethod === 'FIB'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50',
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    selectedMethod === 'FIB' ? 'border-primary bg-primary' : 'border-gray-300',
                  ]"
                >
                  <div v-if="selectedMethod === 'FIB'" class="w-3 h-3 rounded-full bg-white"></div>
                </div>
                <div>
                  <p class="font-semibold text-black">{{ $t('cart.payWithFIB') }}</p>
                  <p class="text-sm text-gray-100">Pay securely with First Iraqi Bank</p>
                </div>
              </div>
            </button>

            <!-- Pay on Delivery -->
            <button
              @click="selectPaymentMethod('DELIVERY')"
              :class="[
                'w-full p-4 rounded-lg border-2 transition-all text-left',
                selectedMethod === 'DELIVERY'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50',
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    selectedMethod === 'DELIVERY' ? 'border-primary bg-primary' : 'border-gray-300',
                  ]"
                >
                  <div
                    v-if="selectedMethod === 'DELIVERY'"
                    class="w-3 h-3 rounded-full bg-white"
                  ></div>
                </div>
                <div>
                  <p class="font-semibold text-black">{{ $t('cart.payOnDelivery') }}</p>
                  <p class="text-sm text-gray-100">Pay when you receive your order</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4">
            <button
              @click="handleCancel"
              class="flex-1 border-2 border-gray-500 text-black py-3 rounded-lg transition-all active:scale-95 font-medium"
            >
              {{ $t('cart.cancel') }}
            </button>
            <button
              @click="handleConfirm"
              :disabled="!selectedMethod"
              :class="[
                'flex-1 py-3 rounded-lg transition-all active:scale-95 font-medium',
                selectedMethod
                  ? 'bg-primary text-white hover:bg-opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              {{ $t('cart.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm', method: 'FIB' | 'DELIVERY'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = ref(false)
const selectedMethod = ref<'FIB' | 'DELIVERY' | null>(null)

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      isVisible.value = true
      document.body.style.overflow = 'hidden'
    } else {
      isVisible.value = false
      document.body.style.overflow = ''
      selectedMethod.value = null
    }
  },
  { immediate: true },
)

const selectPaymentMethod = (method: 'FIB' | 'DELIVERY') => {
  selectedMethod.value = method
}

const handleCancel = () => {
  isVisible.value = false
  document.body.style.overflow = ''
  setTimeout(() => {
    emit('close')
  }, 200)
}

const handleConfirm = () => {
  if (!selectedMethod.value) return
  isVisible.value = false
  document.body.style.overflow = ''
  setTimeout(() => {
    emit('confirm', selectedMethod.value as 'FIB' | 'DELIVERY')
  }, 200)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>
