<template>
  <button
    :class="[
      'w-full sm:text-text-1-semiBold text-text-2-medium rounded-[8px] bg-primary text-pure-white sm:h-14 h-9 disabled:bg-gray-100 hover:scale-95 duration-300 transition-all active:scale-90',
    ]"
    type="submit"
    :disabled="isPending || disabled"
  >
    <template v-if="isPending">submitting...</template>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import type { ButtonProps } from '../../../types'

defineProps<{
  isPending: boolean
  disabled?: boolean
}>()
</script>

