import { ref, computed, watch } from 'vue'

const theme = ref<'light' | 'dark' | 'system'>('system')

export function useTheme() {
  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Apply theme to document
  const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    const appliedTheme = selectedTheme === 'system' ? getSystemTheme() : selectedTheme

    if (appliedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Computed applied theme
  const appliedTheme = computed(() => {
    return theme.value === 'system' ? getSystemTheme() : theme.value
  })

  // Change theme function
  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // Initialize theme from localStorage or system
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system'
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      theme.value = 'system'
    }
    applyTheme(theme.value)
  }

  // Watch for system theme changes
  watch(
    () => theme.value,
    (newTheme) => {
      applyTheme(newTheme)
    },
  )

  return {
    theme: computed(() => theme.value),
    appliedTheme,
    changeTheme,
    initTheme,
  }
}
