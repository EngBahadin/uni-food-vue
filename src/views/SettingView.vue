<template>
  <section class="min-h-screen lg:px-20 md:px-6 px-3 pt-10 bg-white">
    <h1
      class="md:text-sub-heading-1-semiBold sm:text-sub-heading-2-semiBold text-body-1-semiBold text-primary border-l-8 p-2 self-start mb-10"
    >
      {{ $t('settings.title') }}
    </h1>

    <div class="flex justify-center p-4">
      <div class="w-full max-w-2xl bg-pure-white rounded-xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-gray-50">
          <p
            class="text-gray-600 dark:text-gray-400 text-center md:text-body-4-semiBold sm:text-text-1-medium text-text-2-medium text-black"
          >
            {{ $t('settings.description') }}
          </p>
        </div>

        <!-- Language Selection -->
        <div class="p-6 border-b border-gray-50">
          <h2
            class="text-black md:text-body-4-semiBold sm:text-text-1-semiBold text-text-2-semiBold mb-4"
          >
            {{ $t('settings.language') }}
          </h2>
          <div class="relative w-full">
            <select
              v-model="currentLocale"
              :class="[
                'w-full p-2 px-3 rounded-lg appearance-none focus:outline-none bg-white md:text-text-1-regular sm:text-text-2-regular text-text-3-regular text-black border border-gray-50',
                isRTL ? 'pl-10' : 'pr-10',
              ]"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="ckb">کوردی سۆرانی</option>
            </select>
            <Icon
              icon="mdi:translate"
              :class="[
                'absolute top-1/2 transform -translate-y-1/2 md:w-5 md:h-5 sm:w-4 sm:h-4 w-3 h-3 pointer-events-none text-black',
                isRTL ? 'left-3' : 'right-3',
              ]"
            />
          </div>
        </div>

        <!-- Dark/Light/System Mode Toggle -->
        <div class="p-6 border-b border-gray-50">
          <h2
            class="text-black md:text-body-4-semiBold sm:text-text-1-semiBold text-text-2-semiBold mb-4"
          >
            {{ $t('settings.appearance') }}
          </h2>
          <div class="relative space-y-4 text-sm">
            <button
              v-for="mode in ['light', 'dark', 'system']"
              :key="mode"
              :class="[
                'relative z-10 flex items-center gap-2 w-full p-3 rounded-lg text-left transition-all',
                theme === mode ? 'text-white' : 'text-black',
              ]"
              @click="changeTheme(mode as 'light' | 'dark' | 'system')"
            >
              <div
                v-if="theme === mode"
                class="absolute inset-0 w-full h-full bg-primary rounded-lg z-0 transition-all"
              />
              <span class="relative z-10 flex items-center gap-3">
                <Icon
                  v-if="mode === 'dark'"
                  icon="mdi:weather-night"
                  class="w-5 h-5"
                />
                <Icon
                  v-else-if="mode === 'light'"
                  icon="mdi:weather-sunny"
                  class="w-5 h-5"
                />
                <Icon
                  v-else-if="mode === 'system'"
                  icon="mdi:cog"
                  class="w-5 h-5"
                />
                <p>{{ getModeLabel(mode) }}</p>
              </span>
            </button>
          </div>
        </div>

        <!-- Account Management -->
        <div class="p-6">
          <h2
            class="text-black md:text-body-4-semiBold sm:text-text-1-semiBold text-text-2-semiBold mb-4"
          >
            {{ $t('settings.account') }}
          </h2>
          <div v-if="accessToken" class="grid grid-flow-col items-center grid-cols-2 gap-x-4">
            <router-link
              to="/profile"
              class="w-full p-3 rounded-lg border border-info flex items-center justify-center gap-x-[8%] text-info hover:text-gray-25 hover:bg-info transition-all duration-300"
            >
              <Icon
                icon="mdi:account-cog"
                class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4"
              />
              <span class="md:text-text-1-medium sm:text-text-2-medium text-text-3-medium">
                {{ $t('settings.manageAccount') }}
              </span>
            </router-link>
            <router-link
              to="/auth/signin"
              @click="handleLogout"
              class="w-full p-3 rounded-lg border border-error flex items-center justify-center gap-x-[8%] hover:bg-error hover:text-gray-25 text-error transition-all duration-300"
            >
              <Icon
                icon="mdi:logout"
                class="md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4"
              />
              <span class="md:text-text-1-medium sm:text-text-2-medium text-text-3-medium">
                {{ $t('settings.logout') }}
              </span>
            </router-link>
          </div>
          <div
            v-else
            class="grid grid-flow-col items-center grid-cols-2 gap-x-4 md:text-text-1-medium sm:text-text-2-medium text-text-3-medium"
          >
            <router-link
              to="/auth/signin"
              @click="handleLogin"
              class="p-3 rounded-lg bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              {{ $t('settings.login') }}
            </router-link>
            <router-link
              to="/auth/signup"
              class="p-3 rounded-lg bg-white border border-success text-success hover:bg-success hover:text-white transition-all duration-300"
            >
              {{ $t('settings.signUp') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getToken, removeTokens } from '../utils/auth'
import { useTheme } from '../composables/useTheme'
import { useCartStore } from '../stores/cart'
import { useI18n } from '../composables/useI18n'
import type { SupportedLocale } from '../i18n'

const router = useRouter()
const { theme, changeTheme } = useTheme()
const cartStore = useCartStore()
const { locale, changeLocale, t } = useI18n()

const accessToken = ref(false)

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

onMounted(() => {
  const token = getToken()
  accessToken.value = !!token
})

watch(
  () => router.currentRoute.value.path,
  () => {
    const token = getToken()
    accessToken.value = !!token
  },
)

// Watch for token changes
watch(
  () => getToken(),
  (newToken) => {
    accessToken.value = !!newToken
  },
  { immediate: true }
)

const getModeLabel = (mode: string) => {
  switch (mode) {
    case 'dark':
      return t('settings.darkMode')
    case 'light':
      return t('settings.lightMode')
    case 'system':
      return t('settings.systemPreference')
    default:
      return mode
  }
}


const toggleAuth = () => {
  cartStore.clearCart()
  if (accessToken.value) {
    removeTokens()
  }
}

const handleLogout = () => {
  toggleAuth()
}

const handleLogin = () => {
  toggleAuth()
}
</script>
