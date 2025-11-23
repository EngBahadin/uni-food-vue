<template>
  <div ref="searchBarRef" class="relative z-50">
    <form
      @submit.prevent="handleSubmit"
      class="bg-white overflow-hidden rounded-[10px]"
    >
      <div class="relative flex items-center">
        <span
          tabindex="0"
          @focus="handleFocus"
          class="ml-2 absolute hover:cursor-pointer focus-within:text-gray-75 z-10"
          @click="handleSearchClick"
        >
          <Icon
            icon="mdi:magnify"
            class="hover:text-primary md:w-7 md:h-7 sm:w-5 sm:h-5 w-4 h-4 text-black"
          />
        </span>

        <input
          ref="inputRef"
          v-model="value"
          @focus="handleFocus"
          @blur="handleBlur"
          :class="[
            'transition-width text-pure-black duration-300 ease-out pl-9 sm:pl-9 md:pl-12 placeholder:gray-100 outline-none md:bg-white text-caption-2-regular md:text-text-3-regular lg:text-text-2-regular',
            searchFocused
              ? 'w-[140px] bg-white'
              : 'w-0 bg-pure-white',
            'lg:w-[345px] md:w-[180px] md:h-10 sm:h-8 h-7',
          ]"
          type="text"
          :placeholder="$t('search.placeholder')"
        />
      </div>
    </form>

    <div
      v-if="(isSuccess || isLoading) && searchFocused && value"
      class="bg-white text-pure-black absolute top-full left-0 mt-2 lg:w-[345px] md:w-[180px] w-[140px] flex flex-col rounded-b-md max-h-64 overflow-y-auto py-0 gap-1 cursor-pointer transition-all z-[60] shadow-lg"
    >
      <div v-if="isLoading" class="px-3 py-2">
        <div class="h-3 bg-gray-200 rounded animate-pulse mb-2" v-for="i in 3" :key="i"></div>
      </div>
      <div v-else-if="isSuccess && data && Array.isArray(data) && data.length > 0" class="transition-all">
        <router-link
          v-for="(item, index) in data"
          :key="item.id || index"
          :to="`/search?searchedName=${item.name}`"
          @mousedown.prevent
          @click="handleItemClick(item.name)"
          class="flex justify-between items-center hover:bg-primary transition-all hover:text-white duration-200 text-caption-2-regular md:text-text-3-regular lg:text-text-2-regular px-3 py-2"
        >
          <p>{{ item.name }}</p>
          <Icon icon="mdi:arrow-top-left" class="lg:w-4 lg:h-4 md:w-3 md:h-3 w-3 h-3" />
        </router-link>
      </div>
      <div v-else-if="isSuccess && (!data || (Array.isArray(data) && data.length === 0))" class="px-3 py-2">
        <p class="text-gray-100 text-caption-2-regular">No results found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useSearchQuery } from '../../services/query'

interface Props {
  searchFocused: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  'update:searchFocused': [value: boolean]
}>()

const router = useRouter()
const value = ref('')
const debouncedValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const searchBarRef = ref<HTMLDivElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const stopWatch = watch(value, (newValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    debouncedValue.value = newValue
  }, 500)
})

// Use computed to ensure reactivity
const searchTerm = computed(() => debouncedValue.value)
const { data, isSuccess, isLoading } = useSearchQuery(searchTerm)

const handleFocus = () => {
  emit('update:searchFocused', true)
}

const handleBlur = () => {
  // Delay closing to allow clicks on dropdown items
  setTimeout(() => {
    if (!searchBarRef.value?.contains(document.activeElement)) {
      emit('update:searchFocused', false)
    }
  }, 300)
}

const handleSearchClick = () => {
  if (value.value.trim()) {
    handleSubmit()
  }
}

const handleItemClick = (itemName: string) => {
  value.value = itemName
  debouncedValue.value = itemName
  handleSubmit()
}

const handleSubmit = () => {
  if (!value.value.trim()) {
    return
  }
  router.push(`/search?searchedName=${value.value}`)
  if (inputRef.value) {
    inputRef.value.blur()
  }
  debouncedValue.value = ''
  handleBlur()
}

const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as Node
  if (searchBarRef.value && !searchBarRef.value.contains(target)) {
    emit('update:searchFocused', false)
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  stopWatch() // Stop the watcher to prevent memory leaks
})
</script>

