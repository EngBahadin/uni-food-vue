import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/main.css'
import { useTheme } from './composables/useTheme'

// Initialize theme before creating app to prevent FOUC
const { initTheme } = useTheme()
initTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
