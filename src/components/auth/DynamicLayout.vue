<template>
  <main class="min-h-screen py-14 justify-center flex flex-col">
    <img
      :src="theme === 'dark' ? '/unifood-logo-dm.png' : '/unifood-logo.png'"
      alt="uni food logo"
      class="object-contain z-20 lg:w-24 lg:h-24 md:w-20 md:h-16 sm:w-16 w-14 h-14 absolute left-0 top-0 ml-[4%] mt-[3%] drop-shadow-xl"
    />
    <div class="m-auto relative">
      <section
        class="absolute sm:top-[-45px] sm:right-[-35px] top-[-20px] right-[-15px] z-20"
      >
        <img
          src="/burger.png"
          alt="burger image"
          class="object-contain sm:size-28 size-14"
        />
      </section>
      <div
        class="xl:w-[608px] xl:h-[668px] sm:w-[500px] sm:h-[630px] w-full h-[510px] rounded-[32px] border-primary border-[3px] relative bg-pure-white shadow-xl"
      >
        <AuthHeader :title="title" :description="description" />
        <div class="flex justify-center mt-4">
          <slot />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import AuthHeader from './AuthHeader.vue'
import type { DynamicLayoutProps } from '../../../types'

const props = defineProps<DynamicLayoutProps>()

const { appliedTheme } = useTheme()
const theme = computed(() => appliedTheme.value)
</script>

