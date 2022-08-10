import { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { useFileSystem } from "../hooks/useFileSystemState";
import SideBar, { SideBarActions } from "../components/SideBar";

import styles from "./Layout.module.css";

const CodeEditor = () => {
  const { code, updateCode } = useFileSystem();

  const onChange = (value) => {
    updateCode(value);
  };

  useEffect(() => {
    const sendUserInteractionEvent = () => {
      window.ipcRenderer.send("app:editor-user-interaction");
    };
    window.addEventListener("mousemove", sendUserInteractionEvent);
    window.addEventListener("keydown", sendUserInteractionEvent);

    return () => {
      window.removeEventListener("mousemove", sendUserInteractionEvent);
      window.removeEventListener("keydown", sendUserInteractionEvent);
    };
  }, []);

  return (
    <main className={styles.container}>
      <SideBar actions={<SideBarActions />} />
      <section className={styles.codeContainer}>
        {code && (
          <CodeMirror
            value={code}
            height="50%"
            extensions={[javascript()]}
            onChange={onChange}
            theme={dracula}
          />
        )}
      </section>
    </main>
  );
};

export default CodeEditor;
