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

const SideBar = ({ hasPlay }) => {
  const { runSketch, saveFile } = useFileSystem();

  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.title}>Nav</h2>
      <Link to="/" className={styles.button}>
        <ToolTip title="código">
          <SVGParticlesGenWrapper SVGComponent={SVGCode} />
        </ToolTip>
      </Link>
      {/* <Link to="/sketches" className={styles.link}>
        Sketches
      </Link> */}
      <Link to="/force-graph" className={styles.button}>
        <ToolTip title="Arquivo">
          <SVGParticlesGenWrapper SVGComponent={SVGNetwork} />
        </ToolTip>
      </Link>
      <h2 className={styles.title}>Ações</h2>
      <button className={styles.button} onClick={saveFile}>
        <ToolTip title="Salvar Sketch">
          <SVGParticlesGenWrapper SVGComponent={SVGSave} />
        </ToolTip>
      </button>
      {hasPlay && (
        <button className={styles.button} onClick={runSketch}>
          <ToolTip title="Rodar Sketch">
            <SVGParticlesGenWrapper SVGComponent={SVGArrow} />
          </ToolTip>
        </button>
      )}
    </nav>
  );
};

export default SideBar;
