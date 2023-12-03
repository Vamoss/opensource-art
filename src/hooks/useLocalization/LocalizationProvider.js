import { useReducer } from "react";
import { LocalizationContext } from "./LocalizationContext";
import { initialState } from "./initialState";
import { reducer } from "./reducer";

export const LocalizationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const changeLanguage = (lang) => {
    dispatch({
      type: "switch_language",
      payload: lang,
    })
  }

  const getTextByKey = (key) => {
    return state.translations[key]
  }

  return (
    <LocalizationContext.Provider
      value={{ ...state, changeLanguage, getTextByKey }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
