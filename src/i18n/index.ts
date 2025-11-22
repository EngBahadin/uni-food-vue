import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ar from './locales/ar.json'
import ckb from './locales/ckb.json'

export type SupportedLocale = 'en' | 'ar' | 'ckb'

const messages = {
  en,
  ar,
  ckb,
}

// Get saved locale from localStorage or default to 'en'
const getSavedLocale = (): SupportedLocale => {
  const saved = localStorage.getItem('locale') as SupportedLocale
  return saved && ['en', 'ar', 'ckb'].includes(saved) ? saved : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages,
})

export default i18n


