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
import SVGPT from "./SVGPT";
import SVGEN from "./SVGEN";
import SVGES from "./SVGES";

const LanguageSelector = () => {
  const { translations, changeLanguage, isCurrentLanguage } = useLocalization()

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
      <h2 className={styles.title}>{translations.nav_title_idiomas}</h2>
      <button
        className={`${styles.button} ${isCurrentLanguage(portugues) ? styles.button_active : ''}`}
        onClick={() => performLanguageChange(portugues)}
      >
        <ToolTip title="Português">
          <SVGParticlesGenWrapper SVGComponent={SVGPT} />
        </ToolTip>
      </button>
      <button
        className={`${styles.button} ${isCurrentLanguage(ingles) ? styles.button_active : ''}`}
        onClick={() => performLanguageChange(ingles)}
      >
        <ToolTip title="English">
          <SVGParticlesGenWrapper SVGComponent={SVGEN} />
        </ToolTip>
      </button>
      <button
        className={`${styles.button} ${isCurrentLanguage(espanhol) ? styles.button_active : ''}`}
        onClick={() => performLanguageChange(espanhol)}
      >
        <ToolTip title="Español">
          <SVGParticlesGenWrapper SVGComponent={SVGES} />
        </ToolTip>
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
      <div>
        <SideBarNav />
        {hasActions && <SideBarActions />}
      </div>
      <div>
        <LanguageSelector />
      </div>
    </nav>
  );
};

export default SideBar;
