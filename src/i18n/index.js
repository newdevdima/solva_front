import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

const saved = localStorage.getItem('crm_locale')
const browser = navigator.language?.startsWith('fr') ? 'fr' : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: saved ?? browser,
  fallbackLocale: 'en',
  messages: { en, fr },
})

export function setLocale(lang) {
  i18n.global.locale.value = lang
  localStorage.setItem('crm_locale', lang)
  document.documentElement.lang = lang
}
