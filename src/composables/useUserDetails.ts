import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getToken } from '../utils/auth'
import { useUserDetailsQuery } from '../../services/query'

export function useUserDetails() {
  const route = useRoute()
  const inValidPaths = computed(() => route.path.startsWith('/auth'))
  const userToken = computed(() => getToken())
  const enabled = computed(() => !!userToken.value && !inValidPaths.value)
  const profilePicVersion = ref(0)

  const {
    data: userDetails,
    isLoading,
    refetch,
    error,
  } = useUserDetailsQuery(enabled)

  // Watch for profile_pic changes and update version
  watch(
    () => userDetails.value?.profile_pic,
    () => {
      profilePicVersion.value = Date.now()
    },
  )

  const username = computed(() => userDetails.value?.username || 'user-name')
  const email = computed(() => userDetails.value?.email || 'example@example.com')
  const id = computed(() => String(userDetails.value?.id || '1'))
  const profile_pic = computed(() => {
    const pic = userDetails.value?.profile_pic
    // Return a better default avatar if no profile pic
    if (!pic || pic === '/mypic.png') {
      const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#F56E76"/>
          <circle cx="50" cy="40" r="18" fill="white" opacity="0.9"/>
          <path d="M 30 70 Q 30 60 50 60 Q 70 60 70 70 L 70 80 L 30 80 Z" fill="white" opacity="0.9"/>
        </svg>
      `)}`
      return defaultAvatar
    }
    // Add cache-busting parameter to force reload when profile pic changes
    const separator = pic.includes('?') ? '&' : '?'
    return `${pic}${separator}v=${profilePicVersion.value}`
  })

  // Function to force profile picture refresh
  const refreshProfilePic = () => {
    profilePicVersion.value = Date.now()
  }

  return {
    username,
    email,
    id,
    profile_pic,
    isLoading,
    refetch,
    error,
    refreshProfilePic,
  }
}

