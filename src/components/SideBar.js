import React from "react";
import { useFileSystem } from "../hooks/useFileSystemState";

const SideBar = () => {
  const { files, code, updateCode, runSketch, loadFile, saveFile } =
    useFileSystem();

  return (
    <nav>
      <button onClick={runSketch}>Rodar Sketch</button>
      <button onClick={saveFile}>Salvar Sketch</button>
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
  );
};

export default SideBar;
