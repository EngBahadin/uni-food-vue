<template>
  <div class="relative">
    <menu>
      <div
        @click="toggleShowMenu"
        class="border-gray-100 border-[0.2px] hover:border-[1.5px] hover:border-primary transition-all duration-200 bg-primary md:size-9 sm:size-8 size-7 rounded-full cursor-pointer"
      >
        <img
          :src="profile_pic || '/default-avatar.png'"
          alt="Profile Pic"
          width="50"
          height="32"
          class="rounded-full hover:object-cover size-full object-cover"
          @error="handleImageError"
        />
      </div>
    </menu>
    <div v-if="openBar" class="inset-0 fixed z-10" @click="toggleShowMenu" />
    <article
      :class="[
        openBar ? 'p-6 z-20' : 'h-0 p-0',
        'overflow-hidden absolute rounded-bl-xl duration-300 ease-out bg-pure-white drop-shadow-md top-14 right-0 whitespace-nowrap',
      ]"
    >
      <template v-if="accessToken && !isLoading">
        <header class="flex flex-row items-center gap-x-2 mb-4">
          <div
            class="border-black border-[0.02px] hover:border-2 bg-primary md:size-9 sm:size-7 size-6 rounded-full flex-shrink-0"
          >
            <img
              :src="profile_pic || '/default-avatar.png'"
              alt="Profile Pic"
              width="50"
              height="32"
              class="rounded-full size-full object-cover"
              @error="handleImageError"
            />
          </div>
          <h4
            class="text-text-1-regular text-black whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ username }}
          </h4>
        </header>

        <div class="flex flex-col gap-y-4 sm:text-text-1-regular text-text-3-regular">
          <router-link @click="closeMenu" to="/profile" :class="linkClasses">
            <Icon icon="mdi:account" class="sm:w-6 sm:h-6 w-5 h-5 flex-shrink-0" />
            <span class="whitespace-nowrap">{{ $t('accountMenu.profile') }}</span>
          </router-link>

          <router-link @click="closeMenu" to="/order_history/preparing" :class="linkClasses">
            <Icon icon="mdi:cart" class="sm:w-6 sm:h-6 w-5 h-5 flex-shrink-0" />
            <span class="whitespace-nowrap">{{ $t('accountMenu.orderHistory') }}</span>
          </router-link>

          <router-link @click="closeMenu" to="/setting" :class="linkClasses">
            <Icon icon="mdi:cog" class="sm:w-6 sm:h-6 w-5 h-5 hover:text-primary flex-shrink-0" />
            <span class="whitespace-nowrap">{{ $t('accountMenu.setting') }}</span>
          </router-link>

          <router-link @click="handleLogout" to="/auth/signin" :class="linkClasses">
            <Icon
              icon="mdi:logout"
              class="sm:w-6 sm:h-6 w-5 h-5 hover:text-primary flex-shrink-0"
            />
            <span class="whitespace-nowrap">{{ $t('accountMenu.logOut') }}</span>
          </router-link>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-y-4 sm:text-text-1-regular text-text-3-regular">
          <router-link @click="handleLogin" to="/auth/signin" :class="linkClasses">
            <Icon icon="mdi:login" class="sm:w-6 sm:h-6 w-5 h-5 hover:text-primary flex-shrink-0" />
            <span class="whitespace-nowrap">{{ $t('accountMenu.logIn') }}</span>
          </router-link>
          <router-link @click="closeMenu" to="/setting" :class="linkClasses">
            <Icon icon="mdi:cog" class="sm:w-6 sm:h-6 w-5 h-5 hover:text-primary flex-shrink-0" />
            <span class="whitespace-nowrap">{{ $t('accountMenu.setting') }}</span>
          </router-link>
        </div>
      </template>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getToken, removeTokens } from '../utils/auth'
import { useUserDetails } from '../composables/useUserDetails'

const router = useRouter()
const { username, profile_pic, isLoading } = useUserDetails()

const accessToken = ref(false)
const openBar = ref(false)

const linkClasses =
  'flex items-center gap-3 hover:text-primary text-black hover:scale-95 active:scale-90 transition-all whitespace-nowrap'

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
  { immediate: true },
)

const toggleShowMenu = () => {
  openBar.value = !openBar.value
}

const closeMenu = () => {
  openBar.value = false
}

const toggleAuth = () => {
  if (accessToken.value) {
    removeTokens()
    // Cart will be cleared automatically when tokens are removed
  }
}

const handleLogout = () => {
  closeMenu()
  toggleAuth()
}

const handleLogin = () => {
  closeMenu()
  toggleAuth()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Prevent infinite loop if default avatar also fails
  if (img.src.includes('data:image/svg+xml')) {
    return
  }
  // Use a better default avatar with user icon
  const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#F56E76"/>
      <circle cx="50" cy="40" r="18" fill="white" opacity="0.9"/>
      <path d="M 30 70 Q 30 60 50 60 Q 70 60 70 70 L 70 80 L 30 80 Z" fill="white" opacity="0.9"/>
    </svg>
  `)}`
  img.src = defaultAvatar
}
</script>
