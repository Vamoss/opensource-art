import React, { useEffect, useRef } from "react";
import { useFileSystem } from "../hooks/useFileSystemState";

const Viewer = () => {
  const { currentInView } = useFileSystem();

  useEffect(() => {
    if (currentInView === null) {
      return;
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

    sketchScript.onload = () => {
      let pscript = document.getElementById("p5script");
      if (pscript === null) {
        pscript = document.createElement("script");
        pscript.setAttribute("defer", true);
        pscript.src = `/vendor/p5.js`;
        pscript.id = `p5script`;
        document.body.appendChild(pscript);
      }
    };

    sketchScript.src = `/main/data/${currentInView.dir}/${filePath}`;
  }, [currentInView]);

  return <></>;
};

export default Viewer;
