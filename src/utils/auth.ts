import Cookies from 'js-cookie'
import { apiAuth } from '../../lib/axios'

type NewTokensProps = {
  access: string
  refresh: string
}

export const newToken = ({ access, refresh }: NewTokensProps) => {
  Cookies.set('access_token', access, { expires: 7 }) // 7 days
  Cookies.set('refresh_token', refresh, { expires: 30 }) // 30 days
}

export const getToken = (): string | undefined => {
  return Cookies.get('access_token')
}

export const getUserEmail = (): string | undefined => {
  return Cookies.get('user_email')
}

export const addUserEmail = (email: string) => {
  Cookies.set('user_email', email, { expires: 7 })
}

export const removeUserEmail = () => {
  Cookies.remove('user_email')
}

export const removeTokens = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
}

// to order new access token using the refresh token
export const orderNewAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('refresh_token')
  if (!refreshToken) return null
  try {
    const response = await apiAuth.post('/jwt/refresh/', {
      refresh: refreshToken,
    })
    const newAccessToken = response.data.access
    Cookies.set('access_token', newAccessToken, { expires: 7 })

    return newAccessToken
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('remove tokens')
      removeTokens() // refresh token is expired
      return null
    }
    return null
  }
}

