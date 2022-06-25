import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const CodeEditor = () => {
  const [code, setCode] = useState("console.log('hello world!');");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    window.ipcRenderer.invoke("app:get-files").then((files = []) => {
      setFiles(files);
    });
  });

  const onChange = (value) => {
    setCode(value);
  };

  const saveFile = () => {
    window.ipcRenderer.send("app:save-file", {
      name: "testfile.js",
      content: code,
    });
  };

  const updateFile = () => {
    window.ipcRenderer.send("app:update-file", {
      name: "testfile.js",
      content: code,
    });
  };

  const loadFile = (fileName) => {
    window.ipcRenderer.invoke("app:load-file", fileName).then((file = null) => {
      if (file === null) {
        return;
      }
      setCode(file.content);
    });
  };

  return (
    <main className="container">
      <nav>
        <button onClick={saveFile}>Salvar Sketch</button>
        <button onClick={updateFile}>Atualizar Sketch</button>
        <h2>files</h2>
        {files.map((fileName) => (
          <button key={fileName} onClick={() => loadFile(fileName)}>
            {fileName}
          </button>
        ))}
      </nav>
      <section>
        <CodeMirror
          value={code}
          height="50%"
          extensions={[javascript()]}
          onChange={onChange}
        />
      </section>
    </main>
  );
};

export default CodeEditor;
