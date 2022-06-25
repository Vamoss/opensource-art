import React, { useEffect, useRef } from "react";

const Viewer = () => {
  const canvasElement = useRef(null);

  useEffect(() => {
    window.ipcRenderer.receive("app:load-code", (file) => {
      let pscript = document.getElementById("p5script");
      if (pscript === null) {
        pscript = document.createElement("script");
        pscript.src = `https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.js`;
        pscript.id = `p5script`;
        document.body.appendChild(pscript);
      }

      let sketchScript = document.getElementById("sketchScript");
      console.log(sketchScript);
      if (sketchScript === null) {
        sketchScript = document.createElement("script");
        sketchScript.id = `sketchScript`;
        document.body.appendChild(sketchScript);
      }
      sketchScript.src = `/main/files/${file.name}`;
    });
  }, []);

  return <></>;
};

export default Viewer;
