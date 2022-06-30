import React, { useEffect, useRef } from "react";
import { useFileSystem } from "../hooks/useFileSystemState";

const Viewer = () => {
  const { currentInView } = useFileSystem();

  useEffect(() => {
    if (currentInView === null) {
      return;
    }

    let pscript = document.getElementById("p5script");
    if (pscript === null) {
      pscript = document.createElement("script");
      pscript.src = `https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.js`;
      pscript.id = `p5script`;
      document.body.appendChild(pscript);
    }

    let sketchScript = document.getElementById("sketchScript");
    if (sketchScript === null) {
      sketchScript = document.createElement("script");
      sketchScript.id = `sketchScript`;
      document.body.appendChild(sketchScript);
    }

    const filePath =
      currentInView.dir === "temp"
        ? currentInView.id
        : `${currentInView.id}/sketch.js`;

    sketchScript.src = `/main/data/${currentInView.dir}/${filePath}`;
  }, [currentInView]);

  useEffect(() => {
    window.ipcRenderer.receive("app:reload-viewer", (file) => {
      window.location.reload();
    });
  }, []);

  return <></>;
};

export default Viewer;
