import { initialState } from "./initialState";
import { getTranslatedText } from './getTranslatedText'

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'switch_language':
      return {
        ...state,
        language: action.payload,
        translations: getTranslatedText(action.payload)
      }
    default:
      return {...state}
  }
}