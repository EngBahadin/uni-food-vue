import { useI18n as useVueI18n } from 'vue-i18n'
import type { SupportedLocale } from '../i18n'

export function useI18n() {
  const { locale, t } = useVueI18n()

  const changeLocale = (newLocale: SupportedLocale) => {
    ;(locale as { value: SupportedLocale }).value = newLocale
    localStorage.setItem('locale', newLocale)
    // Update HTML lang attribute
    document.documentElement.lang = newLocale
    // Update HTML dir attribute for RTL languages (Arabic and Kurdish)
    if (newLocale === 'ar' || newLocale === 'ckb') {
      document.documentElement.dir = 'rtl'
    } else {
      document.documentElement.dir = 'ltr'
    }
  }

  return {
    locale: locale as { value: SupportedLocale },
    t,
    changeLocale,
  }
}

