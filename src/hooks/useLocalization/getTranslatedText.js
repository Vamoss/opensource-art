import { translations } from "./data"

export const getTranslatedText = (lang) => {
  const language = {}

  translations.forEach(translation => {
    language[translation.key] = translation.translations[lang]
  })

  return language
}