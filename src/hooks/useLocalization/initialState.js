import { portugues } from "./data"
import { getTranslatedText } from './getTranslatedText'

export const initialState = {
  language: portugues,
  translations: getTranslatedText(portugues)
}