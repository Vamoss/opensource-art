import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useFileSystem } from "../hooks/useFileSystemState";

const CodeEditor = () => {
  const { files, code, updateCode, runSketch, loadFile } = useFileSystem();

  const onChange = (value) => {
    updateCode(value);
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
