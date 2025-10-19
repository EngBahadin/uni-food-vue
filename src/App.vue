<script setup lang="ts">
import { useTheme } from './composables/useTheme'

const { theme, appliedTheme, changeTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-black transition-colors duration-300">
    <!-- Theme Toggle -->
    <div class="fixed top-4 right-4 z-50">
      <div class="bg-gray-15 dark:bg-gray-100 rounded-lg p-2 shadow-lg">
        <button
          @click="changeTheme('light')"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            theme === 'light' ? 'bg-primary text-white' : 'text-gray-100 hover:bg-gray-25',
          ]"
        >
          Light
        </button>
        <button
          @click="changeTheme('dark')"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors mx-1',
            theme === 'dark' ? 'bg-primary text-white' : 'text-gray-100 hover:bg-gray-25',
          ]"
        >
          Dark
        </button>
        <button
          @click="changeTheme('system')"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            theme === 'system' ? 'bg-primary text-white' : 'text-gray-100 hover:bg-gray-25',
          ]"
        >
          System
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-sub-heading-1-bold text-black dark:text-white mb-4">UniFood Vue.js App</h1>
        <p class="text-body-2-medium text-gray-100 dark:text-gray-50">
          Testing Tailwind Config & Theme System
        </p>
        <p class="text-text-2-regular text-gray-75 dark:text-gray-25 mt-2">
          Current theme: {{ theme }} (Applied: {{ appliedTheme }})
        </p>
      </header>

      <!-- Typography Test -->
      <section class="mb-12">
        <h2 class="text-sub-heading-2-semiBold text-black dark:text-white mb-6">
          Typography System
        </h2>
        <div class="space-y-4">
          <p class="text-sub-heading-1-bold text-primary">Sub Heading 1 Bold</p>
          <p class="text-sub-heading-2-medium text-gray-100 dark:text-gray-50">
            Sub Heading 2 Medium
          </p>
          <p class="text-body-1-regular text-gray-75 dark:text-gray-25">
            Body 1 Regular - Lorem ipsum dolor sit amet
          </p>
          <p class="text-body-2-semiBold text-gray-50 dark:text-gray-15">
            Body 2 SemiBold - Consectetur adipiscing elit
          </p>
          <p class="text-text-1-medium text-gray-25 dark:text-gray-100">
            Text 1 Medium - Sed do eiusmod tempor
          </p>
          <p class="text-text-2-bold text-gray-15 dark:text-gray-75">
            Text 2 Bold - Incididunt ut labore
          </p>
          <p class="text-caption-1-regular text-gray-100 dark:text-gray-50">
            Caption 1 Regular - Et dolore magna aliqua
          </p>
          <p class="text-caption-2-medium text-gray-75 dark:text-gray-25">
            Caption 2 Medium - Ut enim ad minim veniam
          </p>
        </div>
      </section>

      <!-- Color System Test -->
      <section class="mb-12">
        <h2 class="text-sub-heading-2-semiBold text-black dark:text-white mb-6">Color System</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-primary text-white p-4 rounded-lg text-center">
            <p class="text-text-2-bold">Primary</p>
          </div>
          <div class="bg-success text-white p-4 rounded-lg text-center">
            <p class="text-text-2-bold">Success</p>
          </div>
          <div class="bg-error text-white p-4 rounded-lg text-center">
            <p class="text-text-2-bold">Error</p>
          </div>
          <div class="bg-warning text-white p-4 rounded-lg text-center">
            <p class="text-text-2-bold">Warning</p>
          </div>
          <div class="bg-info text-white p-4 rounded-lg text-center">
            <p class="text-text-2-bold">Info</p>
          </div>
          <div class="bg-red-bg text-error p-4 rounded-lg text-center">
            <p class="text-text-2-bold">Red BG</p>
          </div>
          <div
            class="bg-gray-15 dark:bg-gray-100 text-gray-100 dark:text-gray-50 p-4 rounded-lg text-center"
          >
            <p class="text-text-2-bold">Gray 15</p>
          </div>
          <div
            class="bg-gray-25 dark:bg-gray-75 text-gray-75 dark:text-gray-25 p-4 rounded-lg text-center"
          >
            <p class="text-text-2-bold">Gray 25</p>
          </div>
        </div>
      </section>

      <!-- Animation Test -->
      <section class="mb-12">
        <h2 class="text-sub-heading-2-semiBold text-black dark:text-white mb-6">Animations</h2>
        <div
          class="bg-gradient-to-r from-primary to-info animate-gradient-pulse rounded-lg p-6 text-center"
        >
          <p class="text-caption-1-bold text-white">🎉 Gradient Pulse Animation</p>
        </div>
      </section>

      <!-- Loading Spinner Test -->
      <section class="mb-12">
        <h2 class="text-sub-heading-2-semiBold text-black dark:text-white mb-6">Loading Spinner</h2>
        <div class="flex justify-center">
          <div class="lds-ellipsis text-primary">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </section>

      <!-- Responsive Test -->
      <section class="mb-12">
        <h2 class="text-sub-heading-2-semiBold text-black dark:text-white mb-6">
          Responsive Design
        </h2>
        <div
          class="bg-gray-25 dark:bg-gray-100 mini_mobile:bg-primary mini_mobile:text-white p-4 rounded-lg"
        >
          <p class="text-text-2-medium">This background changes on mini_mobile screens (360px+)</p>
        </div>
      </section>

      <!-- Utility Classes Test -->
      <section class="mb-12">
        <h2 class="text-sub-heading-2-semiBold text-black dark:text-white mb-6">Utility Classes</h2>
        <div
          class="cen bg-gray-15 dark:bg-gray-100 p-4 rounded-lg w-32 h-32 flex items-center justify-center"
        >
          <p class="text-text-2-bold text-center">Centered</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
