import React from "react";
import { Link } from "react-router-dom";
import { useFileSystem } from "../hooks/useFileSystemState";
import styles from "./SideBar.module.css";

const SideBar = () => {
  const { files, runSketch, loadFile, saveFile } = useFileSystem();

  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.title}>Navegação</h2>=
      <Link to="/" className={styles.link}>
        Código
      </Link>
      <Link to="/sketches" className={styles.link}>
        Sketches
      </Link>
      <Link to="/force-graph" className={styles.link}>
        Gráfico
      </Link>
      <h2 className={styles.title}>Ações</h2>
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
