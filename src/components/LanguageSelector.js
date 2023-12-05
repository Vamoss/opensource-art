import { useState } from "react"
import styles from "./LanguageSelector.module.css";
import {
  useLocalization,
  espanhol,
  ingles,
  portugues
} from "../hooks/useLocalization";

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { changeLanguage } = useLocalization()

  const performLanguageChange = (language) => {
    window.ipcRenderer.send("app:editor-change-language", language);
    changeLanguage(language)
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
        language
      </button>
      {
        isOpen &&
        <div className={styles.expandableContainer}>
          <div className={styles.languageOptions}>
            <button 
              className={styles.button}
              onClick={() => performLanguageChange(portugues)}
            >Portugues</button>
            <button 
              className={styles.button}
              onClick={() => performLanguageChange(ingles)}
            >English</button>
            <button 
              className={styles.button}
              onClick={() => performLanguageChange(espanhol)}
            >Español</button>
          </div>
        </div>
      }
    </div>
  )
}