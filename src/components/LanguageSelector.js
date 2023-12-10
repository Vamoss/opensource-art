import { useState } from "react"
import styles from "./LanguageSelector.module.css";
import {
  useLocalization,
  espanhol,
  ingles,
  portugues
} from "../hooks/useLocalization";

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { changeLanguage, isCurrentLanguage } = useLocalization()

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
              className={`${styles.button} ${styles.button_small} ${isCurrentLanguage(portugues) ? styles.button_active : ''}`}
              onClick={() => performLanguageChange(portugues)}
            >Portugues</button>
            <button 
              className={`${styles.button} ${styles.button_small} ${isCurrentLanguage(ingles) ? styles.button_active : ''}`}
              onClick={() => performLanguageChange(ingles)}
            >English</button>
            <button 
              className={`${styles.button} ${styles.button_small} ${isCurrentLanguage(espanhol) ? styles.button_active : ''}`}
              onClick={() => performLanguageChange(espanhol)}
            >Español</button>
          </div>
        </div>
      }
    </div>
  )
}