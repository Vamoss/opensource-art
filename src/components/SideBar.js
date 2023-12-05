import React from "react";
import { Link } from "react-router-dom";
import { useFileSystem } from "../hooks/useFileSystemState";
import styles from "./SideBar.module.css";
import ToolTip from "./ToolTip";
import SVGArrow from "./SVGArrow";
import SVGCode from "./SVGCode";
import SVGNetwork from "./SVGNetwork";
import SVGSave from "./SVGSave";
import SVGParticlesGenWrapper from "./SVGParticlesGenWrapper";
import { LanguageSelector } from "./LanguageSelector";
import { useLocalization } from "../hooks/useLocalization";

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

const SideBar = () => {
  return (
    <nav className={styles.sidebar}>
      <SideBarNav />
      <SideBarActions />
    </nav>
  );
};

export default SideBar;
