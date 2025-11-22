<template>
  <nav
    class="sticky bg-pure-white z-50 top-0 w-full h-16 md:h-20 flex items-center border-b-[1px] border-gray-50"
  >
    <div class="flex justify-between w-full gap-y-4 md:px-10 px-4">
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
              {{ $t('nav.home') }}
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
              {{ $t('nav.about') }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Mobile Sidebar (Left Side) -->
      <nav class="md:hidden bg-pure-white z-20 relative">
        <menu class="flex items-center ml-4 sm:ml-8 gap-x-4 sm:gap-x-8">
          <button
            @click="toggleMobileMenu"
            class="text-primary hover:scale-105 active:scale-95 transition-all"
          >
            <svg
              v-if="!showMobileMenu"
              class="sm:w-7 sm:h-7 w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              v-else
              class="sm:w-7 sm:h-7 w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <router-link to="/" class="flex items-center">
            <img
              :src="
                theme === 'light' ? `${basePath}unifood-logo.png` : `${basePath}unifood-logo-dm.png`
              "
              alt="UniFood logo"
              class="object-contain cursor-pointer sm:w-12 sm:h-12 w-8 h-8"
            />
          </router-link>
        </menu>

        <!-- Mobile Menu Dropdown -->
        <article
          :class="[
            showMobileMenu ? 'sm:p-6 p-4' : 'h-0 p-0',
            'overflow-hidden absolute rounded-br-xl duration-300 ease-out bg-pure-white drop-shadow-md z-30',
          ]"
        >
          <div
            class="flex flex-col sm:gap-y-4 gap-y-2 text-gray-75 sm:text-text-1-regular text-text-3-regular"
          >
            <router-link
              @click="closeMobileMenu"
              to="/"
              :class="[
                'flex items-center gap-3 hover:text-primary hover:scale-105 active:scale-95 transition-all',
                $route.path === '/'
                  ? 'border-b-[3px] rounded-b-sm border-primary text-primary'
                  : '',
              ]"
            >
              <Icon icon="mdi:home" class="sm:w-6 sm:h-6 w-5 h-5" />
              <span>{{ $t('nav.home') }}</span>
            </router-link>

            <router-link
              @click="closeMobileMenu"
              to="/about"
              :class="[
                'flex items-center gap-3 hover:text-primary hover:scale-105 active:scale-95 transition-all',
                $route.path === '/about'
                  ? 'border-b-[3px] rounded-b-sm border-primary text-primary'
                  : '',
              ]"
            >
              <Icon icon="mdi:information" class="sm:w-6 sm:h-6 w-5 h-5" />
              <span>{{ $t('nav.about') }}</span>
            </router-link>

            <div class="flex flex-row items-center gap-x-3 group">
              <Icon
                icon="mdi:view-grid"
                :class="[
                  'sm:w-6 sm:h-6 w-5 h-5 group-hover:text-primary group-hover:scale-105 transition-all group-active:scale-95',
                  $route.path.startsWith('/categories') ? 'text-primary' : '',
                ]"
              />
              <CategoriesDropdown
                :is-mobile="true"
                :is-open="showMobileCategories"
                @update:is-open="showMobileCategories = $event"
                @category-click="closeMobileMenu"
              />
            </div>

            <FavoriteIcon type="sidebar" :set-open-bar="closeMobileMenu" />
          </div>
        </article>
      </nav>

      <!-- Search Bar and Right Actions Container -->
      <div class="flex items-center gap-4 pr-4 md:pr-0">
        <!-- Search Bar -->
        <SearchBar
          :search-focused="searchFocused"
          @update:search-focused="searchFocused = $event"
        />

        <!-- Cart Icon -->
        <CartIcon :search-focused="searchFocused" />

        <!-- Favorite Icon -->
        <FavoriteIcon type="header" />

        <!-- Theme Toggle Icon -->
        <button
          @click="toggleTheme"
          class="cursor-pointer transition-all"
          :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
        >
          <Icon
            :icon="
              theme === 'light'
                ? 'material-symbols:dark-mode-outline'
                : 'material-symbols:light-mode-outline'
            "
            :class="[
              'md:w-8 md:h-8 sm:w-7 sm:h-7 w-6 h-6 transition-all',
              'text-gray-100 hover:text-primary hover:scale-105 active:scale-95',
            ]"
          />
        </button>
        <!-- Account Menu -->
        <AccountMenu />
      </div>
    </div>

    <!-- Overlay for Mobile Menu -->
    <div v-if="showMobileMenu" class="md:hidden fixed inset-0 z-10" @click="closeMobileMenu"></div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useTheme } from '../composables/useTheme'
import CategoriesDropdown from './CategoriesDropdown.vue'
import AccountMenu from './AccountMenu.vue'
import SearchBar from './SearchBar.vue'
import CartIcon from './CartIcon.vue'
import FavoriteIcon from './FavoriteIcon.vue'

const basePath = import.meta.env.BASE_URL
const { theme, changeTheme } = useTheme()
const showMobileMenu = ref(false)
const showCategoriesDropdown = ref(false)
const showMobileCategories = ref(false)
const searchFocused = ref(false)

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
