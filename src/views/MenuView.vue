<template>
  <div class="min-h-screen min-w-full">
    <CategorySection v-for="category in categories" :key="category.id" :category="category" />
  </div>
</template>

<script setup lang="ts">
import { categories } from '../utils/menuData'
import CategorySection from '../components/CategorySection.vue'
</script>
