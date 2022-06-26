import React from "react";
import { Link } from "react-router-dom";
import { useFileSystem } from "../hooks/useFileSystemState";
import styles from "./SideBar.module.css";

const SideBar = () => {
  const { files, runSketch, loadFile, saveFile } = useFileSystem();

  return (
    <nav className={styles.sidebar}>
      <Link to="/" className={styles.link}>
        Code
      </Link>
      <Link to="/sketches" className={styles.link}>
        Sketches
      </Link>
      <h2 className={styles.title}>Actions</h2>
      <button className={styles.button} onClick={runSketch}>
        Rodar Sketch
      </button>
      <button className={styles.button} onClick={saveFile}>
        Salvar Sketch
      </button>
    </nav>
  );
};

export default SideBar;
