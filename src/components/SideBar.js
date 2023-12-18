import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFileSystem } from "../hooks/useFileSystemState";
import styles from "./SideBar.module.css";
import ToolTip from "./ToolTip";
import SVGArrow from "./SVGArrow";
import SVGCode from "./SVGCode";
import SVGNetwork from "./SVGNetwork";
import SVGSave from "./SVGSave";
import SVGParticlesGenWrapper from "./SVGParticlesGenWrapper";
import {
  useLocalization,
  espanhol,
  ingles,
  portugues
} from "../hooks/useLocalization";

const LanguageSelector = () => {
  const { changeLanguage, isCurrentLanguage } = useLocalization()

  const performLanguageChange = useCallback((language) => {
    localStorage.setItem("activeLanguage", language);
    window.ipcRenderer.send("app:editor-change-language", language);
    changeLanguage(language)
  }, [changeLanguage])
  
  useEffect(() => {
    const activeLanguage = localStorage.getItem("activeLanguage");
    if (activeLanguage) {
      performLanguageChange(activeLanguage)
    }
  }, [])

  return (
    <>
      <button
        className={`${styles.button} ${styles.button_small} ${isCurrentLanguage(portugues) ? styles.button_active : ''}`}
        onClick={() => performLanguageChange(portugues)}
      >
        Portugues
      </button>
      <button
        className={`${styles.button} ${styles.button_small} ${isCurrentLanguage(ingles) ? styles.button_active : ''}`}
        onClick={() => performLanguageChange(ingles)}
      >
        English
      </button>
      <button
        className={`${styles.button} ${styles.button_small} ${isCurrentLanguage(espanhol) ? styles.button_active : ''}`}
        onClick={() => performLanguageChange(espanhol)}
      >
        Español
      </button>
    </>
  )
}

const SideBarActions = () => {
  const { translations } = useLocalization()
  const { runSketch, saveFile } = useFileSystem();
  
  return (
    <>
      <h2 className={styles.title}>{translations.nav_title_action}</h2>
      <button className={styles.button} onClick={saveFile}>
        <ToolTip title={translations.nav_tooltip_salvar_sketch}>
          <SVGParticlesGenWrapper SVGComponent={SVGSave} />
        </ToolTip>
      </button>
      <button className={styles.button} onClick={runSketch}>
        <ToolTip title={translations.nav_tooltip_rodar_sketch}>
          <SVGParticlesGenWrapper SVGComponent={SVGArrow} />
        </ToolTip>
      </button>
      <h2 className={styles.title}>{translations.nav_title_idiomas}</h2>
      <LanguageSelector />
    </>
  );
};

const SideBarNav = () => {
  const { translations } = useLocalization()

  return (
    <>
      <h2 className={styles.title}>{translations.nav_title_nav}</h2>
      <Link to="/" className={styles.button}>
        <ToolTip title={translations.nav_tooltip_codigo}>
          <SVGParticlesGenWrapper SVGComponent={SVGCode} />
        </ToolTip>
      </Link>
      {/* <Link to="/sketches" className={styles.link}>
        Sketches
      </Link> */}
      <Link to="/force-graph" className={styles.button}>
        <ToolTip title={translations.nav_tooltip_arquivo}>
          <SVGParticlesGenWrapper SVGComponent={SVGNetwork} />
        </ToolTip>
      </Link>
    </>
  )
}

const SideBar = ({ hasActions = false }) => {
  return (
    <nav className={styles.sidebar}>
      <SideBarNav />
      {hasActions && <SideBarActions />}
    </nav>
  );
};

export default SideBar;
