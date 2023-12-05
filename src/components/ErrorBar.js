import React from "react";
import styles from "./ErrorBar.module.css";
import { useLocalization } from "../hooks/useLocalization";

const ErrorBar = ({ message, lineno, colno }) => {
  const { translations } = useLocalization()

  return (
    <div className={styles.errorbar}>
      <h3>{translations.error_at_line} {lineno}:</h3>
      <p>{message}</p>
    </div>
  );
};

export default ErrorBar;
