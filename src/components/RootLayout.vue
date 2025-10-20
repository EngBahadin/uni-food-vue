<template>
  <div class="min-h-screen bg-white dark:bg-black transition-colors duration-300">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './NavbarSection.vue'
</script>
