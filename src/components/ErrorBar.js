import React from "react";
import styles from "./ErrorBar.module.css";

const ErrorBar = ({ message, lineno, colno }) => {
  return (
    <div className={styles.errorbar}>
      <h3>Encontrei um erro na linha {lineno}:</h3>
      <p>{message}</p>
    </div>
  );
};

export default ErrorBar;
