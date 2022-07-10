import React from "react";
import styles from "./ToolTip.module.css";

const ToolTip = ({ title, children }) => {
  return (
    <div className={styles.wrapper}>
      {children}
      <p className={styles.title}>{title}</p>
    </div>
  );
};

export default ToolTip;
