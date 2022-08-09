import React, { useEffect } from "react";

const ScreenSaver = () => {
  useEffect(() => {
    let sketchScript = document.getElementById("sketchScript");
    if (sketchScript === null) {
      sketchScript = document.createElement("script");
      sketchScript.id = `sketchScript`;
      document.body.appendChild(sketchScript);
    }

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

    sketchScript.src = `/assets/screensaver.js`;

    window.ipcRenderer.receive("app:server-user-interaction", () => {
      window.location = "/viewer";
    });
  }, []);

  useEffect(() => {
    const sendUserInteractionEvent = () => {
      window.location = "/viewer";
    };
    window.addEventListener("mousemove", sendUserInteractionEvent);
    window.addEventListener("keydown", sendUserInteractionEvent);

    return () => {
      window.removeEventListener("mousemove", sendUserInteractionEvent);
      window.removeEventListener("keydown", sendUserInteractionEvent);
    };
  }, []);

  return <></>;
};

export default ScreenSaver;
