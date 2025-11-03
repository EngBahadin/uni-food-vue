<template>
  <nav
    class="sticky bg-pure-white z-50 top-0 w-full h-16 md:h-20 flex items-center border-b-[1px] border-gray-50"
  >
    <div class="flex justify-between w-full px-4 md:px-10">
      <!-- Logo and Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <router-link to="/" class="flex items-center">
          <img
            :src="
              theme === 'light' ? `${basePath}unifood-logo.png` : `${basePath}unifood-logo-dm.png`
            "
            alt="UniFood logo"
            class="w-8 h-8 md:w-10 md:h-10 cursor-pointer"
          />
        </router-link>

        <ul class="flex items-center gap-6 text-gray-100">
          <li>
            <router-link
              to="/"
              class="text-text-1-medium hover:text-primary transition-colors"
              :class="{ 'text-primary': $route.path === '/' }"
            >
              Home
            </router-link>
          </li>
          <CategoriesDropdown
            :is-open="showCategoriesDropdown"
            @update:is-open="showCategoriesDropdown = $event"
          />
          <li>
            <router-link
              to="/about"
              class="text-text-1-medium hover:text-primary transition-colors"
              :class="{ 'text-primary': $route.path === '/about' }"
            >
              About
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Mobile Logo -->
      <div class="md:hidden">
        <router-link to="/" class="flex items-center">
          <img
            :src="
              theme === 'light' ? `${basePath}unifood-logo.png` : `${basePath}unifood-logo-dm.png`
            "
            alt="UniFood logo"
            class="w-8 h-8"
          />
        </router-link>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-4">
        <!-- Theme Toggle Icon -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
        >
          <svg
            v-if="theme === 'light'"
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-600 hover:text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Sidebar -->
    <div
      v-if="showMobileMenu"
      class="md:hidden fixed top-0 right-0 h-full w-1/2 max-w-xs bg-pure-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': showMobileMenu, 'translate-x-full': !showMobileMenu }"
    >
      <!-- Close Button -->
      <div class="flex justify-end p-4 border-b border-gray-25">
        <button
          @click="closeMobileMenu"
          class="p-2 text-gray-100 hover:text-primary transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="px-4 py-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
        <router-link
          to="/"
          @click="closeMobileMenu"
          class="block py-2 text-text-1-medium text-gray-100 hover:text-primary"
          :class="{ 'text-primary': $route.path === '/' }"
        >
          Home
        </router-link>
        <!-- Categories in Mobile Menu -->
        <CategoriesDropdown
          :is-mobile="true"
          :is-open="showMobileCategories"
          @update:is-open="showMobileCategories = $event"
          @category-click="closeMobileMenu"
        />
        <router-link
          to="/about"
          @click="closeMobileMenu"
          class="block py-2 text-text-1-medium text-gray-100 hover:text-primary"
          :class="{ 'text-primary': $route.path === '/about' }"
        >
          About
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import CategoriesDropdown from './CategoriesDropdown.vue'

const basePath = import.meta.env.BASE_URL
const { theme, changeTheme } = useTheme()
const showMobileMenu = ref(false)
const showCategoriesDropdown = ref(false)
const showMobileCategories = ref(false)

const toggleTheme = () => {
  changeTheme(theme.value === 'light' ? 'dark' : 'light')
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  // Close categories when mobile menu closes
  if (!showMobileMenu.value) {
    showMobileCategories.value = false
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  showMobileCategories.value = false
}
</script>
