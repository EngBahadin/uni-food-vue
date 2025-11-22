<template>
  <button v-if="type === 'header'" @click="handleNavigate" class="hidden md:block">
    <Icon
      :icon="isFavoritesPage ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'"
      :class="[
        'md:w-8 md:h-8 sm:w-7 sm:h-7 w-6 h-6 transition-all',
        isFavoritesPage
          ? 'text-primary hover:scale-105 active:scale-95'
          : 'text-gray-100 hover:text-primary hover:scale-105 active:scale-95',
      ]"
    />
  </button>
  <button
    v-else-if="setOpenBar"
    @click="handleNavigate"
    :class="[
      'flex items-center gap-3 hover:text-primary hover:scale-105 active:scale-95 transition-all',
      isFavoritesPage ? 'border-b-[3px] rounded-b-sm border-primary text-primary' : '',
    ]"
  >
    <Icon icon="material-symbols:favorite-outline" class="sm:w-6 sm:h-6 w-5 h-5" />
    <span>{{ $t('favorites.title') }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getToken } from '../utils/auth'
import { useI18n } from '../composables/useI18n'

interface Props {
  type?: 'header' | 'sidebar'
  setOpenBar?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'header',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const isFavoritesPage = computed(() => route.path === '/favorites')

const handleNavigate = () => {
  const token = getToken()
  if (token) {
    router.push('/favorites')
    if (props.setOpenBar) {
      props.setOpenBar()
    }
  } else {
    // You can add toast notification here
    console.log(t('common.pleaseLoginToFavorites'))
  }
}
</script>
