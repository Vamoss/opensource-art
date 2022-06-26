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
    sketchScript.src = `/main/data/${currentSketch.dir}/${currentSketch.name}`;
  }, [currentSketch]);

  useEffect(() => {
    window.ipcRenderer.receive("app:load-code", (file) => {
      location.reload();
    });
  }, []);

  return <></>;
};

export default Viewer;
