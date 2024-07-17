import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import deJSON from './de.json'
import enJSON from './en.json'
import ptJSON from './pt.json'

i18n.use(initReactI18next).init({
  resources: {
    en: enJSON,
    de: deJSON,
    pt: ptJSON,
  }, // Where we're gonna put translations' files
  lng: navigator.language.split('-')[0], // Default language
})

export default i18n
