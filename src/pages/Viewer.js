import React, { useEffect, useRef } from "react";
import { useFileSystem } from "../hooks/useFileSystemState";

const Viewer = () => {
  const { currentSketch } = useFileSystem();

  useEffect(() => {
    if (currentSketch === null) {
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
      currentSketch.dir === "temp"
        ? currentSketch.name
        : `${currentSketch.name}/sketch.js`;

    sketchScript.src = `/main/data/${currentSketch.dir}/${filePath}`;
  }, [currentSketch]);

  useEffect(() => {
    window.ipcRenderer.receive("app:load-code", (file) => {
      window.location.reload();
    });
  }, []);

  return <></>;
};

export default Viewer;
