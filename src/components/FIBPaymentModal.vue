<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="handleClose"></div>

        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 z-10 transform transition-all max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-black">{{ $t('cart.payWithFIB') }}</h2>
            <button @click="handleClose" class="text-gray-100 hover:text-black transition-colors">
              <Icon icon="mdi:close" class="w-6 h-6" />
            </button>
          </div>

          <div v-if="isLoading" class="text-center py-8">
            <p class="text-primary">{{ $t('cart.processingPayment') }}</p>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <p class="text-error mb-4">{{ error }}</p>
            <button
              @click="handleRetry"
              class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Retry
            </button>
          </div>

          <div v-else-if="paymentData" class="space-y-6">
            <div class="text-center">
              <p class="text-lg font-semibold mb-4 text-black">{{ $t('cart.scanQRCode') }}</p>
              <div class="flex justify-center mb-4">
                <img
                  :src="paymentData.qrCode"
                  alt="Payment QR Code"
                  class="w-64 h-64 border-2 border-gray-200 rounded-lg"
                />
              </div>
              <p class="text-sm text-gray-100 mb-2">{{ $t('cart.orEnterCode') }}</p>
              <div class="flex items-center justify-center gap-2 mb-4">
                <p class="text-xl font-mono font-bold text-primary">
                  {{ paymentData.readableCode }}
                </p>
                <button
                  @click="copyCode"
                  class="text-primary hover:text-primary/80 transition-colors"
                  :title="$t('cart.copyLink')"
                >
                  <Icon icon="mdi:content-copy" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-sm font-semibold text-black">{{ $t('cart.openInApp') }}</p>

              <a
                :href="paymentData.personalAppLink"
                target="_blank"
                class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all"
              >
                <Icon icon="mdi:cellphone" class="w-6 h-6 text-primary" />
                <span class="flex-1 text-left text-black">{{ $t('cart.personalApp') }}</span>
                <Icon icon="mdi:arrow-right" class="w-5 h-5 text-gray-100" />
              </a>

              <a
                :href="paymentData.businessAppLink"
                target="_blank"
                class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-all"
              >
                <Icon icon="mdi:briefcase" class="w-6 h-6 text-primary" />
                <span class="flex-1 text-left text-black">{{ $t('cart.businessApp') }}</span>
                <Icon icon="mdi:arrow-right" class="w-5 h-5 text-gray-100" />
              </a>
            </div>

            <div class="pt-4 border-t border-gray-200 flex gap-3">
              <button
                @click="checkPaymentStatus"
                :disabled="isCheckingStatus"
                :class="[
                  'flex-1 py-3 rounded-lg font-medium transition-all',
                  isCheckingStatus
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-opacity-90 active:scale-95',
                ]"
              >
                {{ isCheckingStatus ? $t('cart.checkingStatus') : $t('cart.checkPaymentStatus') }}
              </button>
              <button
                v-if="paymentStatus?.status === 'UNPAID' || !paymentStatus"
                @click="handleCancelPayment"
                :disabled="isCancelling"
                :class="[
                  'flex-1 py-3 rounded-lg font-medium transition-all',
                  isCancelling
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
                ]"
              >
                {{
                  isCancelling ? $t('orderHistory.cancelling') : $t('orderHistory.cancelPayment')
                }}
              </button>
            </div>

            <div v-if="paymentStatus" class="pt-4 border-t border-gray-200">
              <div
                :class="[
                  'p-4 rounded-lg',
                  paymentStatus.status === 'PAID'
                    ? 'bg-green-50 text-green-800'
                    : paymentStatus.status === 'DECLINED'
                      ? 'bg-red-50 text-red-800'
                      : 'bg-yellow-50 text-yellow-800',
                ]"
              >
                <p class="font-semibold">Status: {{ paymentStatus.status }}</p>
                <p v-if="paymentStatus.status === 'UNPAID'" class="text-sm mt-2">
                  {{ $t('cart.paymentPending') }}
                </p>
                <p v-if="paymentStatus.decliningReason" class="text-sm mt-2">
                  Reason: {{ paymentStatus.decliningReason }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-200">
            <button
              @click="handleClose"
              class="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95 font-medium"
            >
              {{ $t('cart.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import type { FIBPaymentResponse, FIBPaymentStatus } from '../../services/api'
import {
  useCheckFIBPaymentStatusMutation,
  useCancelFIBPaymentMutation,
} from '../../services/actions'

interface Props {
  show: boolean
  paymentId: string | null
  accessToken: string | null
  paymentData: FIBPaymentResponse | null
}

interface Emits {
  (e: 'close'): void
  (e: 'payment-success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isCheckingStatus = ref(false)
const isCancelling = ref(false)
const paymentStatus = ref<FIBPaymentStatus | null>(null)
const { t } = useI18n()

const { mutate: checkStatus } = useCheckFIBPaymentStatusMutation()
const { mutate: cancelPayment } = useCancelFIBPaymentMutation()

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      isVisible.value = true
      document.body.style.overflow = 'hidden'
      paymentStatus.value = null
    } else {
      isVisible.value = false
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

const copyCode = () => {
  if (props.paymentData?.readableCode) {
    navigator.clipboard.writeText(props.paymentData.readableCode)
    toast.success(t('cart.paymentCodeCopied'))
  }
}

const checkPaymentStatus = () => {
  if (!props.paymentId || !props.accessToken) {
    toast.error(t('cart.paymentInformationMissing'))
    return
  }

  isCheckingStatus.value = true
  checkStatus(
    { paymentId: props.paymentId, accessToken: props.accessToken },
    {
      onSuccess: (status) => {
        paymentStatus.value = status
        isCheckingStatus.value = false

        if (status.status === 'PAID') {
          toast.success(t('cart.paymentSuccessful'))
          setTimeout(() => {
            emit('payment-success')
          }, 1500)
        } else if (status.status === 'DECLINED') {
          toast.error(t('cart.paymentDeclined'))
        }
      },
      onError: () => {
        isCheckingStatus.value = false
        toast.error(t('cart.checkPaymentStatusFailed'))
      },
    },
  )
}

const handleRetry = () => {
  error.value = null
  emit('close')
}

const handleClose = () => {
  isVisible.value = false
  document.body.style.overflow = ''
  setTimeout(() => {
    emit('close')
  }, 200)
}

const handleCancelPayment = () => {
  if (!props.paymentId || !props.accessToken) {
    toast.error(t('cart.paymentInformationMissing'))
    return
  }

  isCancelling.value = true
  cancelPayment(
    { paymentId: props.paymentId, accessToken: props.accessToken },
    {
      onSuccess: () => {
        toast.success(t('orderHistory.paymentCancelled'))
        paymentStatus.value = {
          ...paymentStatus.value!,
          status: 'DECLINED',
        }
        isCancelling.value = false
        setTimeout(() => {
          handleClose()
        }, 1500)
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : t('orderHistory.cancelPaymentFailed')
        toast.error(errorMessage)
        isCancelling.value = false
      },
    },
  )
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
