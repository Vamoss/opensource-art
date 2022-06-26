import React from "react";
import SideBar from "../components/SideBar";
import { useFileSystem } from "../hooks/useFileSystemState";

const Sketches = () => {
  const { files, loadFile } = useFileSystem();

  return (
    <main className="container">
      <SideBar />
      <div>
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
      </div>
    </main>
  );
};

export default Sketches;
