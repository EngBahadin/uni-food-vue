<template>
  <Teleport to="body">
    <div
      :class="[
        'fixed backdrop-blur-sm inset-0 flex items-center justify-center z-20 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
      ]"
    >
      <div
        :class="[
          'bg-white md:p-10 p-6 rounded-xl shadow-2xl sm:max-w-lg w-[90%] flex flex-col items-center gap-y-6 relative transition-transform duration-300',
          isVisible ? 'translate-y-0' : 'translate-y-10',
        ]"
      >
        <!-- Title Section -->
        <h2 class="text-text-1-regular md:text-body-4-regular text-center text-black">
          🎉 {{ $t('orderHistory.goodVibes') }}
        </h2>
        <p
          v-if="isSuccess && data"
          class="text-center text-primary md:text-body-4-semiBold text-text-1-semiBold leading-snug"
        >
          {{ data.estimated_time }} - {{ addMinutesToTime(data.estimated_time, 30) }}
        </p>

        <!-- Buttons Section -->
        <div class="grid grid-cols-2 gap-x-8 w-full">
          <button
            @click="handleCancel"
            class="active:scale-90 hover:scale-95 text-primary border border-primary px-6 py-3 rounded-lg transition hover:bg-primary hover:text-white font-medium text-base"
          >
            {{ $t('orderHistory.cancelOrder') }}
          </button>

          <button
            @click="handleConfirm"
            class="active:scale-90 hover:scale-95 duration-300 bg-success text-white px-6 py-3 rounded-lg shadow-lg transition hover:bg-green-700 font-medium text-base"
          >
            {{ $t('orderHistory.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEstimatedTimeQuery } from '../../services/query'
import { addMinutesToTime } from '../utils/timeUtils'

interface Props {
  onClose: () => void
  onNavigate: () => void
}

const props = defineProps<Props>()

const isVisible = ref(false)
const { data, isSuccess } = useEstimatedTimeQuery()

onMounted(() => {
  isVisible.value = true
})

const handleCancel = () => {
  isVisible.value = false
  setTimeout(() => {
    props.onClose()
  }, 300)
}

const handleConfirm = () => {
  isVisible.value = false
  setTimeout(() => {
    props.onNavigate()
  }, 300)
}
</script>


