import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/main.css'
import 'vue-sonner/style.css'
import { useTheme } from './composables/useTheme'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import i18n from './i18n'

// Initialize theme before creating app to prevent FOUC
const { initTheme } = useTheme()
initTheme()

// Initialize locale and dir attributes
const savedLocale = localStorage.getItem('locale') || 'en'
document.documentElement.lang = savedLocale
if (savedLocale === 'ar' || savedLocale === 'ckb') {
  document.documentElement.dir = 'rtl'
} else {
  document.documentElement.dir = 'ltr'
}

// Create a query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')