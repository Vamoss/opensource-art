import React from "react";
import SideBar from "../components/SideBar";
import { useFileSystem } from "../hooks/useFileSystemState";

const Sketches = () => {
  const { files, loadFile } = useFileSystem();

  return (
    <main className="container">
      <SideBar />
      <div>
        {files.initial.map((id) => (
          <button
            key={id}
            onClick={() =>
              loadFile({
                dir: "initial",
                name: id,
                id,
              })
            }
          >
            {id}
          </button>
        ))}
        {files.derived.map((id) => (
          <button
            key={id}
            onClick={() =>
              loadFile({
                dir: "derived",
                name: id,
                id,
              })
            }
          >
            {id}
          </button>
        ))}
      </div>
    </main>
  );
};

export default Sketches;
