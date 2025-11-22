<template>
  <div class="min-h-screen bg-white transition-colors duration-300">
    <Navbar v-if="!isAuthPage" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './NavbarSection.vue'

const route = useRoute()

const isAuthPage = computed(() => {
  return route.path.startsWith('/auth')
})
</script>
