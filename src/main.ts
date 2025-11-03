import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/main.css'
import { useTheme } from './composables/useTheme'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Initialize theme before creating app to prevent FOUC
const { initTheme } = useTheme()
initTheme()

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
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')