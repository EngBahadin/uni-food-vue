<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <!-- Backdrop with blur -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="handleCancel"></div>

        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8 z-10 transform transition-all"
        >
          <!-- Title -->
          <h2 class="text-xl font-bold mb-4 text-black">{{ $t('cart.confirmOrder') }}</h2>

          <!-- Message -->
          <p class="mb-6 text-gray-100 md:text-text-1-regular text-text-2-regular">
            {{ $t('cart.areYouSure') }}
          </p>

          <!-- Buttons -->
          <div class="flex gap-4">
            <button
              @click="handleCancel"
              class="flex-1 bg-gray-200 text-black py-3 rounded-lg hover:bg-gray-300 transition-all active:scale-95 font-medium md:text-text-1-regular text-text-2-regular"
            >
              {{ $t('cart.cancel') }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-all active:scale-95 font-medium md:text-text-1-regular text-text-2-regular"
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
import { ref, watch, onMounted } from 'vue'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = ref(false)

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      isVisible.value = true
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      isVisible.value = false
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (props.show) {
    isVisible.value = true
    document.body.style.overflow = 'hidden'
  }
})

const handleCancel = () => {
  isVisible.value = false
  document.body.style.overflow = ''
  setTimeout(() => {
    emit('close')
  }, 200)
}

const handleConfirm = () => {
  isVisible.value = false
  document.body.style.overflow = ''
  setTimeout(() => {
    emit('confirm')
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
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>


