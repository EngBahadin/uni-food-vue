<template>
  <div class="relative">
    <select
      v-model="currentLocale"
      @change="handleChange"
      class="appearance-none bg-transparent border-none outline-none cursor-pointer text-text-1-medium hover:text-primary transition-colors focus:outline-none"
      :class="[
        'text-gray-100',
        $route.path === '/' || $route.path === '/about' || $route.path.startsWith('/categories')
          ? 'hover:text-primary'
          : '',
        isRTL ? 'pl-6' : 'pr-6',
      ]"
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
      <option value="ckb">کوردی سۆرانی</option>
    </select>
    <Icon
      icon="mdi:translate"
      :class="[
        'absolute top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 text-current',
        isRTL ? 'left-0' : 'right-0',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from '../composables/useI18n'
import type { SupportedLocale } from '../i18n'

const { locale, changeLocale } = useI18n()

const currentLocale = computed({
  get: () => locale.value as SupportedLocale,
  set: (value: SupportedLocale) => {
    changeLocale(value)
  },
})

const isRTL = computed(() => {
  const loc = locale.value as SupportedLocale
  return loc === 'ar' || loc === 'ckb'
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  changeLocale(target.value as SupportedLocale)
}
</script>

