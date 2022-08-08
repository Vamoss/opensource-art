import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { useFileSystem } from "../hooks/useFileSystemState";
import SideBar from "../components/SideBar";

import styles from "./Layout.module.css";

const CodeEditor = () => {
  const { code, updateCode } = useFileSystem();

  const onChange = (value) => {
    updateCode(value);
  };

  return (
    <main className={styles.container}>
      <SideBar hasPlay />
      <section className={styles.codeContainer}>
        <CodeMirror
          value={code}
          height="50%"
          extensions={[javascript()]}
          onChange={onChange}
          theme={dracula}
        />
      </section>
    </main>
  );
};

export default CodeEditor;
