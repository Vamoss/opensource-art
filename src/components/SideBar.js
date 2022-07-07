import React from "react";
import { Link } from "react-router-dom";
import { useFileSystem } from "../hooks/useFileSystemState";
import styles from "./SideBar.module.css";

const SideBar = () => {
  const { activeSketch, runSketch, saveFile } = useFileSystem();

  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.title}>Nav</h2>
      <Link to="/" className={styles.button}>
        <img src="/assets/code-svgrepo-com.svg" alt="code" />
      </Link>
      {/* <Link to="/sketches" className={styles.link}>
        Sketches
      </Link> */}
      <Link to="/force-graph" className={styles.button}>
        <img src="/assets/network-svgrepo-com.svg" alt="network graph" />
      </Link>
      <h2 className={styles.title}>Ações</h2>
      <button className={styles.button} onClick={runSketch}>
        <img src="/assets/play-svgrepo-com.svg" alt="rodar sketch" />
      </button>
      <button className={styles.button} onClick={saveFile}>
        <img src="/assets/save-svgrepo-com.svg" alt="salvar sketch" />
      </button>
    </nav>
  );
};

export default SideBar;
