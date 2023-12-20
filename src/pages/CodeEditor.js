import { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { useFileSystem } from "../hooks/useFileSystemState";
import SideBar from "../components/SideBar";

import styles from "./Layout.module.css";

const CodeEditor = () => {
  const containerRef = useRef()
  const codeMirrorRef = useRef()
  const { code, updateCode } = useFileSystem();

  const onChange = (value) => {
    updateCode(value);
  };

  const onEditorCreate = (view) => {
    view.focus()
    const localStorageScrollPosition = localStorage.getItem("scrollPosition");
    if (localStorageScrollPosition) {
      containerRef.current.scrollTop = localStorageScrollPosition
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

  useEffect(() => {
    const currentContainer = containerRef.current

    const onScroll = (scrollEvent) => {
      localStorage.setItem("scrollPosition", scrollEvent.target.scrollTop);
    }

    if(currentContainer) {
      currentContainer.addEventListener("scroll", onScroll)
    }

    return () => {
      if(currentContainer) {
        currentContainer.removeEventListener("scroll", onScroll)
      }
    }
  }, [containerRef])

  return (
    <main className={styles.container}>
      <SideBar hasActions />
      <section ref={containerRef} className={styles.codeContainer}>
        {code && (
          <CodeMirror
            ref={codeMirrorRef}
            value={code}
            height="50%"
            extensions={[javascript()]}
            onChange={onChange}
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
