import { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { useFileSystem } from "../hooks/useFileSystemState";
import SideBar from "../components/SideBar";

import styles from "./Layout.module.css";

const CodeEditor = () => {
  const codeMirrorRef = useRef()
  const { code, updateCode } = useFileSystem();

  const onChange = (value) => {
    updateCode(value);
  };

  const onUpdate = () => {
    if (codeMirrorRef.current) {
      const view = codeMirrorRef?.current?.view
      const cursorPosition = view?.viewState?.state?.selection?.ranges[0]?.from
      if (cursorPosition) {
        localStorage.setItem("cursorPosition", cursorPosition);
      }
    }
  }

  const onEditorCreate = (view) => {
    view.focus()
    const localStorageCursorPosition = localStorage.getItem("cursorPosition");
    if(localStorageCursorPosition) {
      try {
        // dispatches the cursor position event and scrolls into view
        view.dispatch({
          selection: {
            anchor: localStorageCursorPosition,
            head: localStorageCursorPosition
          },
          scrollIntoView: true
        })
      } catch(e) {
        console.warn(e)
      }
    }
  }

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
      <SideBar hasActions />
      <section className={styles.codeContainer}>
        {code && (
          <CodeMirror
            ref={codeMirrorRef}
            value={code}
            height="50%"
            extensions={[javascript()]}
            onChange={onChange}
            onUpdate={onUpdate}
            onCreateEditor={onEditorCreate}
            theme={dracula}
            autoFocus={true}
          />
        )}
      </section>
    </main>
  );
};

export default CodeEditor;
