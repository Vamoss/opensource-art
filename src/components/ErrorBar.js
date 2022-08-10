import React from "react";
import styles from "./ErrorBar.module.css";

const ErrorBar = () => {
  return (
    <div className={styles.errorbar}>
        <h3>Encontrei um erro na linha 2:</h3>
        <p>Descrição do erro aqui.</p>
    </div>
  );
};

export default ErrorBar;
