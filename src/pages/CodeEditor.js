import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { v4 as uuidv4 } from "uuid";

const initialFilesState = {
  initial: [],
  derived: [],
};

const initialCodeState = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  fill(255);
  ellipse(mouseX, mouseY, 80, 80);
}
`;

const CodeEditor = () => {
  const [code, setCode] = useState(initialCodeState);
  const [files, setFiles] = useState(initialFilesState);

  useEffect(() => {
    window.ipcRenderer
      .invoke("app:get-files")
      .then((files = initialFilesState) => {
        setFiles(files);
      });
  }, []);

  const onChange = (value) => {
    setCode(value);
  };

  const runSketch = () => {
    window.ipcRenderer.send("app:run-sketch", {
      name: `${uuidv4()}.js`,
      content: code,
    });
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

  const loadFile = (fileData = { dir: null, name: null }) => {
    window.ipcRenderer.invoke("app:load-file", fileData).then((file = null) => {
      if (file === null) {
        return;
      }
      setCode(file.content);
    });
  };

  return (
    <main className="container">
      <nav>
        <button onClick={runSketch}>Rodar Sketch</button>
        <button onClick={saveFile}>Salvar Sketch</button>
        <button onClick={updateFile}>Atualizar Sketch</button>
        <h2>files</h2>
        {files.initial.map((fileName) => (
          <button
            key={fileName}
            onClick={() =>
              loadFile({
                dir: "initial",
                name: fileName,
              })
            }
          >
            {fileName}
          </button>
        ))}
        {files.derived.map((fileName) => (
          <button
            key={fileName}
            onClick={() =>
              loadFile({
                dir: "derived",
                name: fileName,
              })
            }
          >
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
