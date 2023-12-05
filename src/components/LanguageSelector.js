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
              onClick={() => changeLanguage(portugues)}
            >Portugues</button>
            <button 
              className={styles.button}
              onClick={() => changeLanguage(ingles)}
            >English</button>
            <button 
              className={styles.button}
              onClick={() => changeLanguage(espanhol)}
            >Español</button>
          </div>
        </div>
      }
    </div>
  )
}